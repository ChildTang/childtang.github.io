/* ── Scroll-to-top ── */
(function(){
  var btn = document.getElementById('scrollTop');
  if(!btn) return;
  window.addEventListener('scroll', function(){
    btn.classList.toggle('show', window.scrollY > 500);
  }, {passive:true});
})();

/* ── Dark mode toggle ── */
(function(){
  var btn = document.getElementById('darkToggle');
  if(!btn) return;
  try {
    var saved = localStorage.getItem('darkMode');
    if(saved === 'true') { document.body.classList.add('dark-mode'); btn.textContent = '☀️'; }
  } catch(e) {}
  btn.addEventListener('click', function(){
    document.body.classList.toggle('dark-mode');
    var on = document.body.classList.contains('dark-mode');
    btn.textContent = on ? '☀️' : '🌙';
    try { localStorage.setItem('darkMode', on); } catch(e) {}
  });
})();

/* ── Typing effect ── */
(function(){
  var el = document.getElementById('hero-typed');
  if(!el) return;
  var texts = [
    'Model Efficiency',
    'Reinforcement Learning',
    'Embodied AI',
    'Control Theory for AI Systems'
  ];
  /* Respect prefers-reduced-motion: show static text, skip the animation loop */
  if(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches){
    el.textContent = texts[0]; return;
  }
  var ti=0, ci=0, deleting=false, pause=0;
  function tick(){
    var t = texts[ti];
    if(!deleting){
      el.innerHTML = t.substring(0,ci) + '<span class="typing-cursor"></span>';
      ci++;
      if(ci > t.length){ pause++; if(pause > 30){ deleting=true; pause=0; } }
    } else {
      ci--;
      el.innerHTML = t.substring(0,ci) + '<span class="typing-cursor"></span>';
      if(ci === 0){ deleting=false; ti=(ti+1) % texts.length; }
    }
    setTimeout(tick, deleting ? 25 : (ci > t.length ? 60 : 45));
  }
  tick();
})();

/* ── Animated counters (IntersectionObserver — fires reliably on scroll-into-view) ── */
(function(){
  var els = document.querySelectorAll('.stat-number[data-target]');
  if(!els.length) return;
  var reducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  function runCounter(el) {
    if(el._counted) return;
    el._counted = true;
    var target = parseInt(el.getAttribute('data-target'), 10) || 0;
    var suffix = el.getAttribute('data-suffix') || '';
    /* Skip animation for users who prefer reduced motion */
    if(reducedMotion){ el.textContent = target + suffix; return; }
    var dur = 1400, start = performance.now();
    function step(now){
      var p = Math.min((now - start) / dur, 1);
      p = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(target * p) + suffix;
      if(p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }
  if('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function(entries){
      entries.forEach(function(e){ if(e.isIntersecting){ runCounter(e.target); io.unobserve(e.target); } });
    }, {threshold: 0.3});
    els.forEach(function(el){ io.observe(el); });
  } else {
    /* fallback for old browsers */
    els.forEach(function(el){ runCounter(el); });
  }
})();

/* ── Particle canvas ── */
(function(){
  if(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  var c = document.getElementById('particles');
  if(!c) return;
  var ctx = c.getContext('2d');
  var pts = [];
  function resize(){
    c.width = c.parentElement.offsetWidth;
    c.height = c.parentElement.offsetHeight;
  }
  resize();
  window.addEventListener('resize', resize);
  for(var i=0;i<40;i++){
    pts.push({
      x: Math.random()*c.width, y: Math.random()*c.height,
      vx: (Math.random()-0.5)*0.4, vy: (Math.random()-0.5)*0.4,
      r: Math.random()*2+1
    });
  }
  var _rafId = null;
  function draw(){
    ctx.clearRect(0,0,c.width,c.height);
    ctx.fillStyle = 'rgba(255,255,255,0.25)';
    for(var i=0;i<pts.length;i++){
      var p=pts[i];
      p.x+=p.vx; p.y+=p.vy;
      if(p.x<0||p.x>c.width) p.vx*=-1;
      if(p.y<0||p.y>c.height) p.vy*=-1;
      ctx.beginPath(); ctx.arc(p.x,p.y,p.r,0,Math.PI*2); ctx.fill();
      /* draw lines between nearby particles */
      for(var j=i+1;j<pts.length;j++){
        var q=pts[j], dx=p.x-q.x, dy=p.y-q.y, d=Math.sqrt(dx*dx+dy*dy);
        if(d<120){
          ctx.strokeStyle='rgba(255,255,255,'+(0.12*(1-d/120))+')';
          ctx.lineWidth=0.8;
          ctx.beginPath(); ctx.moveTo(p.x,p.y); ctx.lineTo(q.x,q.y); ctx.stroke();
        }
      }
    }
    if(!document.hidden) _rafId = requestAnimationFrame(draw);
  }
  document.addEventListener('visibilitychange', function(){
    if(document.hidden){ cancelAnimationFrame(_rafId); _rafId = null; }
    else if(!_rafId){ _rafId = requestAnimationFrame(draw); }
  });
  _rafId = requestAnimationFrame(draw);
})();

/* ── Abstract toggle (click/tap on button) ── */
document.querySelectorAll('.pub-entry').forEach(function(entry){
  entry.querySelectorAll('.pub-abst-btn').forEach(function(btn){
    btn.addEventListener('click', function(e){
      e.stopPropagation();
      var isOpen = entry.classList.contains('abstract-open');
      document.querySelectorAll('.pub-entry.abstract-open').forEach(function(el){
        el.classList.remove('abstract-open');
        el.querySelectorAll('.pub-abst-btn').forEach(function(b){ b.textContent = '▾ Abstract'; b.setAttribute('aria-expanded','false'); });
      });
      if(!isOpen){
        entry.classList.add('abstract-open');
        btn.textContent = '▴ Hide';
        btn.setAttribute('aria-expanded','true');
      }
    });
  });
});

/* ── Lazy load fade-in ── */
document.querySelectorAll('img[loading="lazy"]').forEach(function(img){
  if(img.complete) img.classList.add('loaded');
  else {
    img.addEventListener('load', function(){ img.classList.add('loaded'); });
    img.addEventListener('error', function(){ img.classList.add('loaded'); });
  }
});

/* ── ③ Reading progress bar ── */
(function(){
  var bar = document.getElementById('read-progress');
  if(!bar) return;
  window.addEventListener('scroll', function(){
    var st = document.documentElement.scrollTop || document.body.scrollTop;
    var sh = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    bar.style.width = (sh > 0 ? Math.min(st / sh * 100, 100) : 0) + '%';
  }, {passive: true});
})();

/* ── ② Featured card 3D tilt ── */
document.querySelectorAll('.featured-card').forEach(function(card){
  card.addEventListener('mousemove', function(e){
    var r = card.getBoundingClientRect();
    var x = (e.clientX - r.left - r.width / 2) / r.width;
    var y = (e.clientY - r.top - r.height / 2) / r.height;
    card.style.transform = 'perspective(700px) rotateY(' + (x * 10) + 'deg) rotateX(' + (-y * 8) + 'deg) translateY(-5px)';
  });
  card.addEventListener('mouseleave', function(){
    card.style.transform = '';
  });
});

/* ── ⑤ BibTeX one-click copy ── */
(function(){
  /* BibTeX is embedded per-publication via the .bib-src script in each card
     (from the publication's index.md front matter). This map is only a
     legacy fallback and is intentionally empty. */
  var BIB = {};

  var popup = document.createElement('div');
  popup.className = 'bib-popup';
  popup.innerHTML = '<pre class="bib-pre"></pre><div class="bib-actions"><button class="bib-copy">&#x1F4CB; Copy BibTeX</button><button class="bib-close">&#x2715; Close</button></div>';
  document.body.appendChild(popup);

  var activeEntry = null;
  popup.querySelector('.bib-copy').addEventListener('click', function(){
    var btn = this;
    var text = popup.querySelector('.bib-pre').textContent;
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(function(){
        btn.textContent = '\u2713 Copied!'; btn.style.background = '#059669';
        setTimeout(function(){ btn.textContent = '\uD83D\uDCCB Copy BibTeX'; btn.style.background = ''; }, 2000);
      }).catch(function(){ btn.textContent = 'Select + copy manually'; setTimeout(function(){ btn.textContent = '\uD83D\uDCCB Copy BibTeX'; }, 2000); });
    } else {
      btn.textContent = 'Select + copy manually';
      setTimeout(function(){ btn.textContent = '\uD83D\uDCCB Copy BibTeX'; }, 2000);
    }
  });
  popup.querySelector('.bib-close').addEventListener('click', function(){ popup.classList.remove('show'); activeEntry = null; });
  document.addEventListener('click', function(e){
    if (!popup.contains(e.target) && !(activeEntry && activeEntry.contains(e.target))) {
      popup.classList.remove('show'); activeEntry = null;
    }
  });

  document.querySelectorAll('.pub-entry').forEach(function(entry){
    var bib = null;
    // Prefer the BibTeX embedded from the publication's index.md front matter.
    var src = entry.querySelector('.bib-src');
    if (src) bib = src.textContent.trim();
    // Fallbacks (legacy hardcoded map) for any entry without embedded BibTeX.
    if (!bib) {
      var ax = entry.dataset.arxiv;
      if (ax && BIB[ax]) bib = BIB[ax];
    }
    if (!bib) {
      [].forEach.call(entry.querySelectorAll('a[href]'), function(a){
        if (bib) return;
        Object.keys(BIB).forEach(function(k){ if (a.href && a.href.indexOf(k) >= 0) bib = BIB[k]; });
      });
    }
    if (!bib) return;
    var linksDiv = entry.querySelector('.pub-links');
    if (!linksDiv) {
      linksDiv = document.createElement('div'); linksDiv.className = 'pub-links';
      var pr = entry.querySelector('.pub-right'); if (pr) pr.appendChild(linksDiv);
    }
    var btn = document.createElement('button');
    btn.className = 'pub-link pl-cite'; btn.textContent = '\uD83D\uDCCB Cite';
    var captured = bib;
    btn.addEventListener('click', function(e){
      e.stopPropagation();
      if (activeEntry === entry && popup.classList.contains('show')) {
        popup.classList.remove('show'); activeEntry = null; return;
      }
      popup.querySelector('.bib-pre').textContent = captured;
      var rect = entry.getBoundingClientRect();
      var scrollY = window.scrollY || window.pageYOffset;
      var scrollX = window.scrollX || window.pageXOffset;
      var leftPos = Math.max(rect.left + scrollX, 8);
      var maxW = Math.min(rect.width, window.innerWidth - 16);
      if (leftPos + maxW > scrollX + window.innerWidth - 8) {
        leftPos = scrollX + window.innerWidth - maxW - 8;
      }
      popup.style.top = (rect.bottom + scrollY + 6) + 'px';
      popup.style.left = leftPos + 'px';
      popup.style.maxWidth = maxW + 'px';
      popup.classList.add('show'); activeEntry = entry;
    });
    linksDiv.appendChild(btn);
  });
})();

/* ══════════════════════════════════════════════════
   ② PUBLICATION FILTER / SEARCH
══════════════════════════════════════════════════ */
var _activeVenue = 'all';
function filterPubs() {
  var box = document.getElementById('pubSearch');
  var q = (box && box.value || '').toLowerCase();
  var visible = 0;
  document.querySelectorAll('.pub-list .pub-entry').forEach(function(el) {
    var venue = (el.dataset.venue || '').toLowerCase();
    var titleEl = el.querySelector('.pub-title > a');
    var title = titleEl ? titleEl.textContent.toLowerCase() : '';
    var authors = el.querySelector('.pub-authors') ? el.querySelector('.pub-authors').textContent.toLowerCase() : '';
    var venueOk = _activeVenue === 'all' || venue === _activeVenue.toLowerCase();
    var searchOk = !q || title.includes(q) || authors.includes(q) || venue.includes(q);
    var show = venueOk && searchOk;
    el.classList.toggle('hidden', !show);
    if (show) visible++;
  });
  var empty = document.getElementById('pub-empty-state');
  if (empty) empty.style.display = visible === 0 ? 'block' : 'none';
}
function filterByVenue(btn, venue) {
  _activeVenue = venue;
  document.querySelectorAll('.filter-btn').forEach(function(b){ b.classList.remove('active'); });
  if (btn) btn.classList.add('active');
  filterPubs();
}

/* ══════════════════════════════════════════════════
   ① CITATION COUNTS — from _data/citations.json
   (auto-updated weekly by GitHub Actions)
══════════════════════════════════════════════════ */
(function(){
  /* Jekyll injects citation data at build time */
  var citations = (window.__CITATIONS__) || {};
  document.querySelectorAll('.pub-entry[data-arxiv]').forEach(function(el){
    var key = el.dataset.arxiv;
    var count = citations[key];
    if(count == null || count === 0) return;
    var links = el.querySelector('.pub-links') || el.querySelector('.pub-right');
    if(!links) return;
    var badge = document.createElement('span');
    badge.className = 'cite-badge';
    badge.textContent = '📊 ' + count + ' citations';
    links.appendChild(badge);
  });
})();


/* ══════════════════════════════════════════════════
   ⑨ QUICK NAV SCROLL HIGHLIGHT
══════════════════════════════════════════════════ */
(function(){
  var sections = ['news','featured','publications','research','impact','vision','awards','deadlines'];
  var navLinks = document.querySelectorAll('.quick-nav a[data-qn]');
  if (!navLinks.length || !window.IntersectionObserver) return;

  var current = '';
  var obs = new IntersectionObserver(function(entries) {
    entries.forEach(function(e) {
      if (e.isIntersecting) current = e.target.id;
      else if (current === e.target.id) current = '';
    });
    navLinks.forEach(function(a) {
      a.classList.toggle('qn-active', a.dataset.qn === current);
    });
  }, { rootMargin: '-15% 0px -75% 0px', threshold: 0 });

  sections.forEach(function(id) {
    var el = document.getElementById(id);
    if (el) obs.observe(el);
  });
})();
