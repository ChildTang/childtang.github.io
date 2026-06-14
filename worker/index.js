/* ============================================================
   Visitor Globe API — Cloudflare Worker + D1
   GET  ->  records a visit (unique per IP per day) and returns:
            { "total": <int>, "countries": { "CN": 12, "US": 3, ... } }

   Privacy: stores only country code + a salted SHA-256 hash of
   (IP + day) for daily de-duplication. No raw IPs, no personal data.
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
    const country = (cf.country || 'XX').toUpperCase();
    const ua = request.headers.get('User-Agent') || '';
    const isBot = /bot|crawl|spider|slurp|bing|preview|monitor|headless|curl|wget/i.test(ua);

    try {
      // Count one unique visitor per country per day (skip bots / unknown / Tor)
      if (!isBot && country !== 'XX' && country !== 'T1') {
        const ip = request.headers.get('CF-Connecting-IP') || '';
        const day = new Date().toISOString().slice(0, 10);
        const iphash = await sha256(ip + '|' + day + '|' + SALT);
        const ins = await env.DB.prepare(
          'INSERT OR IGNORE INTO daily_visitors (day, iphash) VALUES (?, ?)'
        ).bind(day, iphash).run();
        if (ins.meta && ins.meta.changes > 0) {
          await env.DB.prepare(
            'INSERT INTO counts (country, n) VALUES (?, 1) ON CONFLICT(country) DO UPDATE SET n = n + 1'
          ).bind(country).run();
        }
      }

      // Return the aggregate for the globe
      const rows = await env.DB.prepare('SELECT country, n FROM counts').all();
      let total = 0;
      const countries = {};
      for (const r of (rows.results || [])) { countries[r.country] = r.n; total += r.n; }

      return new Response(JSON.stringify({ total, countries }), {
        headers: cors({ 'Content-Type': 'application/json' })
      });
    } catch (e) {
      // Never break the page; return empty stats on error.
      return new Response(JSON.stringify({ total: 0, countries: {}, error: String(e) }), {
        status: 200, headers: cors({ 'Content-Type': 'application/json' })
      });
    }
  }
};
