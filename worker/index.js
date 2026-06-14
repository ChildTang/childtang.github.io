/* ============================================================
   Visitor Globe API — Cloudflare Worker + D1
   GET  ->  records a visit (unique per IP per day) and returns:
            { "total": <int>,
              "countries": { "CN": 12, "US": 3, ... },
              "points": [ { "lat": 39.9, "lng": 116.4, "city": "Beijing", "n": 12 }, ... ] }

   Privacy: stores only country code, city-level rounded coordinates
   (~11km), and a salted SHA-256 hash of (IP + 30-min time slot) for
   de-duplication. No raw IPs, no precise location, no personal data.
   ============================================================ */

const SALT = 'ye-li-globe-v1';   // any random string; rotating it resets daily de-dup
const ALLOW_ORIGIN = '*';        // or 'https://childtang.github.io' to lock it down

function cors(extra) {
  return Object.assign({
    'Access-Control-Allow-Origin': ALLOW_ORIGIN,
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Cache-Control': 'no-store'
  }, extra || {});
}

async function sha256(s) {
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(s));
  return [...new Uint8Array(buf)].map(b => b.toString(16).padStart(2, '0')).join('');
}

export default {
  async fetch(request, env) {
    if (request.method === 'OPTIONS') return new Response(null, { headers: cors() });
    if (request.method !== 'GET') return new Response('Method Not Allowed', { status: 405, headers: cors() });

    const cf = request.cf || {};
    let country = (cf.country || 'XX').toUpperCase();
    // Count Hong Kong / Macao / Taiwan under China (CN). The glowing dot is
    // still placed at the visitor's real coordinates, so locations stay visible.
    if (country === 'HK' || country === 'MO' || country === 'TW') country = 'CN';
    const ua = request.headers.get('User-Agent') || '';
    const isBot = /bot|crawl|spider|slurp|bing|preview|monitor|headless|curl|wget/i.test(ua);

    // Record a visit. Isolated so a write error can never zero the response.
    if (!isBot && country !== 'XX' && country !== 'T1') {
      try {
        const ip = request.headers.get('CF-Connecting-IP') || '';
        // De-dup per 30-minute slot: same visitor counts again after 30 min.
        const SLOT_MS = 30 * 60 * 1000;
        const slot = new Date(Math.floor(Date.now() / SLOT_MS) * SLOT_MS).toISOString().slice(0, 16);
        const iphash = await sha256(ip + '|' + slot + '|' + SALT);
        const ins = await env.DB.prepare(
          'INSERT OR IGNORE INTO daily_visitors (day, iphash) VALUES (?, ?)'
        ).bind(slot, iphash).run();
        if (ins.meta && ins.meta.changes > 0) {
          await env.DB.prepare(
            'INSERT INTO counts (country, n) VALUES (?, 1) ON CONFLICT(country) DO UPDATE SET n = n + 1'
          ).bind(country).run();

          // Approximate (city-level) location for the glowing dot. Best-effort.
          const lat = parseFloat(cf.latitude), lng = parseFloat(cf.longitude);
          if (Number.isFinite(lat) && Number.isFinite(lng)) {
            const rlat = Math.round(lat * 10) / 10;   // ~11km cell, privacy-safe
            const rlng = Math.round(lng * 10) / 10;
            await env.DB.prepare(
              'INSERT INTO points (cell, lat, lng, city, n) VALUES (?, ?, ?, ?, 1) ' +
              'ON CONFLICT(cell) DO UPDATE SET n = n + 1'
            ).bind(rlat + ',' + rlng, rlat, rlng, cf.city || '').run();
          }
        }
      } catch (e) { /* recording is best-effort; never block the response */ }
    }

    // Read country counts (the core number). If this fails, return zeros.
    let total = 0;
    const countries = {};
    try {
      const rows = await env.DB.prepare('SELECT country, n FROM counts').all();
      for (const r of (rows.results || [])) { countries[r.country] = r.n; total += r.n; }
    } catch (e) {
      return new Response(JSON.stringify({ total: 0, countries: {}, points: [], error: String(e) }), {
        status: 200, headers: cors({ 'Content-Type': 'application/json' })
      });
    }

    // Read visitor locations. Isolated so a points error keeps counts intact.
    let points = [];
    try {
      const pts = await env.DB.prepare(
        'SELECT lat, lng, city, n FROM points ORDER BY n DESC LIMIT 500'
      ).all();
      points = (pts.results || []).map(r => ({ lat: r.lat, lng: r.lng, city: r.city, n: r.n }));
    } catch (e) { /* dots are optional; keep the counts working */ }

    return new Response(JSON.stringify({ total, countries, points }), {
      headers: cors({ 'Content-Type': 'application/json' })
    });
  }
};
