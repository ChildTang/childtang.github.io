/* Visitor globe: globe.gl + Cloudflare Worker country counts. */
(function () {
  // Self-hosted (same-origin) so the globe works even when CDNs are blocked.
  var IMG = '/assets/img/';
  var GEO_URL = '/assets/data/ne_110m_admin_0_countries.geojson';
  var STATS_CACHE_KEY = 'vg_stats_cache';

  function init() {
    var rootEl = document.getElementById('visitor-globe');
    if (!rootEl) return;
    var holder = rootEl.querySelector('.vg-globe');
    var countEl = rootEl.querySelector('.vg-count');
    if (!holder) return;
    if (typeof Globe === 'undefined') { rootEl.classList.add('vg-unavailable'); return; }

    var cfg = window.VISITOR_GLOBE_CONFIG || {};
    var reduceMotion = window.matchMedia &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    var EMPTY = { total: 0, countries: {} };

    function normalize(d, fallback) {
      if (!d || typeof d !== 'object' || !d.countries) return fallback;
      return {
        total: Number.isFinite(d.total) ? d.total : sum(d.countries),
        countries: d.countries,
        points: Array.isArray(d.points) ? d.points : []
      };
    }
    function sum(obj) { var t = 0; for (var k in obj) t += obj[k] || 0; return t; }

    // Local cache of last-seen stats, so the globe still shows data when the
    // backend can't be reached. We always display whichever has the larger total.
    function readCache() { try { return JSON.parse(localStorage.getItem(STATS_CACHE_KEY) || 'null'); } catch (e) { return null; } }
    function writeCache(d) { try { localStorage.setItem(STATS_CACHE_KEY, JSON.stringify(d)); } catch (e) {} }
    function totalOf(d) { return (d && Number.isFinite(d.total)) ? d.total : -1; }
    function bigger(a, b) { return totalOf(b) > totalOf(a) ? b : a; }
    function fetchJSON(url) {
      if (!url) return Promise.resolve(null);
      // Cache-bust so a stale CDN/browser copy never sticks (files are tiny).
      var bust = (url.indexOf('?') === -1 ? '?' : '&') + '_=' + Date.now();
      return fetch(url + bust, { cache: 'no-store' })
        .then(function (r) { return r.ok ? r.json() : null; })
        .catch(function () { return null; });
    }

    function animateCount(el, to) {
      if (!el) return;
      if (reduceMotion) { el.textContent = to.toLocaleString(); return; }
      var dur = 1500, start = performance.now();
      (function step(now) {
        var p = Math.min((now - start) / dur, 1);
        var eased = 1 - Math.pow(1 - p, 3);
        el.textContent = Math.round(to * eased).toLocaleString();
        if (p < 1) requestAnimationFrame(step);
      })(performance.now());
    }

    function sizeOf() {
      var w = holder.offsetWidth || 200;
      return Math.max(120, Math.min(w, 460));
    }

    function isoOf(f) { var p = f.properties || {}; return p.ISO_A2 || p.ISO_A2_EH || p.iso_a2 || ''; }
    function nameOf(f) { var p = f.properties || {}; return p.ADMIN || p.NAME || p.name || p.admin || ''; }
    function centroid(f) {
      try {
        var g = f.geometry; if (!g) return null;
        var ring = g.type === 'Polygon' ? g.coordinates[0]
                 : g.type === 'MultiPolygon' ? g.coordinates[0][0] : null;
        if (!ring || !ring.length) return null;
        var x = 0, y = 0;
        for (var i = 0; i < ring.length; i++) { x += ring[i][0]; y += ring[i][1]; }
        return [x / ring.length, y / ring.length];
      } catch (e) { return null; }
    }

    var MARBLE = IMG + 'earth-blue-marble.jpg';
    var NIGHT = IMG + 'earth-night.jpg';
    // Theme-linked texture: light page -> blue marble, dark page -> night.
    // (cfg.texture, if set, always wins.)
    function texFor() {
      return cfg.texture || (document.body.classList.contains('dark-mode') ? NIGHT : MARBLE);
    }

    var currentWorld = null, currentCountries = null, currentData = null;
    var hoverD = null;

    function capColor(f) {
      return f === hoverD ? 'rgba(40,220,255,0.9)' : 'rgba(255,255,255,0)';
    }

    function polygonLabel(f) {
      var counts = (currentData && currentData.countries) || {};
      var v = counts[isoOf(f)] || 0;
      return '<div style="font:600 13px Inter,sans-serif;color:#fff;background:rgba(15,23,42,.85);'
        + 'padding:5px 9px;border-radius:7px;border:1px solid rgba(255,255,255,.15)">'
        + nameOf(f) + (v > 0 ? ' &middot; <span style="color:#22d3ee">' + v + ' visits</span>' : '')
        + '</div>';
    }

    function renderBaseGlobe() {
      var s = sizeOf();

      var world = new Globe(holder, { animateIn: true })
        .width(s).height(s)
        .backgroundColor('rgba(0,0,0,0)')
        .globeImageUrl(texFor())
        .bumpImageUrl(IMG + 'earth-topology.png')
        .showAtmosphere(true)
        .atmosphereColor('#7db1ff')
        .atmosphereAltitude(0.18);

      // Static styling for visitor markers + pulsing rings (data set later).
      world
        .pointLat('lat').pointLng('lng')
        .pointColor(function () { return '#ff7a1a'; })
        .pointAltitude(0.012)
        .pointRadius(function (d) { return 0.28 + Math.min(Math.sqrt(d.count) * 0.12, 0.7); })
        .pointLabel(function (d) {
          return (d.name ? d.name + ' &middot; ' : '') + d.count + ' visits';
        })
        .ringColor(function () { return function (t) { return 'rgba(255,122,26,' + (1 - t) + ')'; }; })
        .ringMaxRadius(2.6)
        .ringPropagationSpeed(2)
        .ringRepeatPeriod(1300);

      currentWorld = world;

      var controls = world.controls();
      controls.enableZoom = false;
      controls.autoRotate = !reduceMotion;
      controls.autoRotateSpeed = 0.6;
      world.pointOfView({ lat: 20, lng: 90, altitude: 2.2 });

      // Swap texture when the site toggles light/dark mode
      if (!cfg.texture && window.MutationObserver) {
        var mo = new MutationObserver(function () { world.globeImageUrl(texFor()); });
        mo.observe(document.body, { attributes: true, attributeFilter: ['class'] });
      }

      var t = null;
      window.addEventListener('resize', function () {
        clearTimeout(t);
        t = setTimeout(function () { var n = sizeOf(); world.width(n).height(n); }, 150);
      });
      requestAnimationFrame(function () { holder.style.opacity = '1'; });
      return world;
    }

    function applyCountries(world, countries) {
      if (!world || !countries || !countries.features) return;
      currentCountries = countries;
      world
        .polygonsData(countries.features.filter(function (f) { return nameOf(f) !== 'Antarctica'; }))
        .polygonCapColor(capColor)
        .polygonSideColor(function () { return 'rgba(0,0,0,0)'; })
        .polygonStrokeColor(function () { return 'rgba(255,255,255,0.28)'; })
        .polygonAltitude(function (f) { return f === hoverD ? 0.05 : 0.008; })
        .polygonLabel(polygonLabel)
        .onPolygonHover(function (h) {
          hoverD = h;
          world.polygonAltitude(function (f) { return f === hoverD ? 0.05 : 0.008; })
               .polygonCapColor(capColor);
        })
        .polygonsTransitionDuration(250);
    }

    // Build glowing dots. Prefer real city-level coordinates from the backend;
    // fall back to one dot per country (at its centroid) when no points exist.
    function markersFrom(geometry, data) {
      if (data.points && data.points.length) {
        return data.points
          .filter(function (p) { return Number.isFinite(+p.lat) && Number.isFinite(+p.lng); })
          .map(function (p) {
            return { lat: +p.lat, lng: +p.lng, name: p.city || p.country || '', count: p.n || 1 };
          });
      }
      var counts = data.countries || {};
      var markers = [];
      if (!geometry || !geometry.features) return markers;
      geometry.features.forEach(function (f) {
        var v = counts[isoOf(f)] || 0;
        if (v <= 0) return;
        var p = f.properties || {};
        var lat = (p.LABEL_Y != null) ? +p.LABEL_Y : null;
        var lng = (p.LABEL_X != null) ? +p.LABEL_X : null;
        if (lat == null || lng == null) { var c = centroid(f); if (c) { lng = c[0]; lat = c[1]; } }
        if (lat != null && lng != null) markers.push({ lat: lat, lng: lng, name: nameOf(f), count: v });
      });
      return markers;
    }

    function updateStats(world, countries, data) {
      if (!world) return;
      currentData = data;
      var markers = markersFrom(countries || currentCountries, data);
      world.pointsData(markers).ringsData(markers);
      animateCount(countEl, data.total);
    }

    // Render the globe immediately; country geometry and visitor data are
    // layered in as soon as they arrive.
    var hasRemote = !!(cfg.endpoint || cfg.snapshot);
    // Stats sources, by preference: live server, then same-origin snapshot.
    var serverP = fetchJSON(cfg.endpoint);
    var snapshotP = fetchJSON(cfg.snapshot);
    var geoP = fetchJSON(GEO_URL);

    var cached = hasRemote ? readCache() : null;
    var initial = cached || EMPTY;
    currentData = initial;
    renderBaseGlobe();
    animateCount(countEl, initial.total);

    geoP.then(function (geo) {
      applyCountries(currentWorld, geo);
      updateStats(currentWorld, geo, currentData);

      Promise.all([serverP, snapshotP]).then(function (res) {
        var server = normalize(res[0], null);   // preferred (usually the largest)
        var snapshot = normalize(res[1], null); // same-origin fallback
        // Pick whichever source has the most data; cache it so we never go backwards.
        var best = [server, snapshot, cached].reduce(function (a, b) { return bigger(a, b); }, null);
        if (!best) return;                        // all sources unavailable -> keep initial
        writeCache(best);
        updateStats(currentWorld, geo, best);
      });
    });
  }

  if (document.readyState !== 'loading') init();
  else document.addEventListener('DOMContentLoaded', init);
})();
