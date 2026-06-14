/* Visitor globe: globe.gl + Cloudflare Worker country counts. */
(function () {
  var IMG = 'https://cdn.jsdelivr.net/npm/three-globe/example/img/';
  var GEO_URL = 'https://cdn.jsdelivr.net/gh/vasturiano/globe.gl@master/example/datasets/ne_110m_admin_0_countries.geojson';

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
    var DEMO = {
      total: 1480,
      countries: {
        CN: 620, US: 240, GB: 110, JP: 95, SG: 80, DE: 70,
        FR: 60, AU: 55, IN: 90, CA: 50, AE: 30, BR: 40, KR: 40
      }
    };

    function normalize(d, fallback) {
      if (!d || typeof d !== 'object' || !d.countries) return fallback;
      return { total: Number.isFinite(d.total) ? d.total : sum(d.countries), countries: d.countries };
    }
    function sum(obj) { var t = 0; for (var k in obj) t += obj[k] || 0; return t; }

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

    function updateStats(world, countries, data) {
      if (!world) return;
      var counts = data.countries || {};
      currentData = data;
      world.pointsData([]);
      world.ringsData([]);

      // Add small markers at visited countries when country geometry is available.
      var visitMarkers = [];
      var geometry = countries || currentCountries;
      if (geometry && geometry.features) {
        geometry.features.forEach(function (f) {
          var v = counts[isoOf(f)] || 0;
          if (v <= 0) return;
          var p = f.properties || {};
          var lat = (p.LABEL_Y != null) ? +p.LABEL_Y : null;
          var lng = (p.LABEL_X != null) ? +p.LABEL_X : null;
          if (lat == null || lng == null) { var c = centroid(f); if (c) { lng = c[0]; lat = c[1]; } }
          if (lat != null && lng != null) visitMarkers.push({ lat: lat, lng: lng, name: nameOf(f), count: v });
        });
      }
      world
        .pointsData(visitMarkers)
        .pointLat('lat').pointLng('lng')
        .pointColor(function () { return '#ff7a1a'; })
        .pointAltitude(0.012)
        .pointRadius(0.5)
        .pointLabel(function (d) { return d.name + ' &middot; ' + d.count + ' visits'; })
        .ringsData(visitMarkers)
        .ringColor(function () { return function (t) { return 'rgba(255,122,26,' + (1 - t) + ')'; }; })
        .ringMaxRadius(2.6)
        .ringPropagationSpeed(2)
        .ringRepeatPeriod(1300);

      animateCount(countEl, data.total);
      if (geometry && geometry.features) world.polygonLabel(polygonLabel);
    }

    // Render the globe immediately; country geometry and visitor data are
    // layered in as soon as they arrive.
    var dataP = cfg.endpoint
      ? fetch(cfg.endpoint, { cache: 'no-store' }).then(function (r) { return r.ok ? r.json() : null; }).catch(function () { return null; })
      : Promise.resolve(null);
    var geoP = fetch(GEO_URL).then(function (r) { return r.ok ? r.json() : null; }).catch(function () { return null; });

    var fallback = cfg.endpoint ? EMPTY : DEMO;
    currentData = fallback;
    renderBaseGlobe();
    animateCount(countEl, fallback.total);

    geoP.then(function (geo) {
      applyCountries(currentWorld, geo);
      updateStats(currentWorld, geo, currentData);
      dataP.then(function (d) {
        updateStats(currentWorld, geo, normalize(d, fallback));
      });
    });
  }

  if (document.readyState !== 'loading') init();
  else document.addEventListener('DOMContentLoaded', init);
})();
