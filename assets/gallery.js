// Simulation gallery: filters, autoplay-in-view for animations, full-screen viewer (images + video).
(function () {
  if (window.__mhnGalleryJs) return;
  window.__mhnGalleryJs = true;

  var filter = 'all';
  function items() { return Array.prototype.slice.call(document.querySelectorAll('.g-item')); }
  function visible() { return items().filter(function (i) { return !i.classList.contains('is-hidden'); }); }

  function apply() {
    var all = items(), shown = 0;
    all.forEach(function (it) {
      var cats = (it.getAttribute('data-cat') || '').split(/\s+/);
      var on = filter === 'all' || cats.indexOf(filter) > -1;
      it.classList.toggle('is-hidden', !on);
      if (on) shown++;
    });
    var c = document.querySelector('.g-count');
    if (c) c.textContent = shown + (shown === 1 ? ' result' : ' results');
    var e = document.querySelector('.g-empty');
    if (e) e.classList.toggle('is-on', shown === 0);
    document.querySelectorAll('.g-filters button').forEach(function (b) {
      b.setAttribute('aria-selected', b.getAttribute('data-filter') === filter ? 'true' : 'false');
    });
  }

  // play animations only while on screen
  var io = 'IntersectionObserver' in window ? new IntersectionObserver(function (es) {
    es.forEach(function (en) {
      var v = en.target;
      if (en.isIntersecting) { var p = v.play(); if (p && p.catch) p.catch(function () {}); } else v.pause();
    });
  }, { threshold: 0.35 }) : null;

  var ready = false;
  function init() {
    if (ready || !document.querySelector('.g-grid')) return;
    ready = true;
    var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    document.querySelectorAll('.g-media video').forEach(function (v) {
      v.muted = true; v.setAttribute('muted', '');
      if (io && !reduce) io.observe(v);
    });
    var anyAnim = items().some(function (i) { return /(^|\s)animation(\s|$)/.test(i.getAttribute('data-cat') || ''); });
    var ab = document.querySelector('.g-filters [data-filter="animation"]');
    if (ab && !anyAnim) ab.hidden = true;
    apply();
  }
  if (document.readyState !== 'loading') init();
  document.addEventListener('DOMContentLoaded', init);
  new MutationObserver(function () { init(); }).observe(document.documentElement, { childList: true, subtree: true });

  // ---- viewer ----
  var cur = -1;
  function box() {
    var b = document.querySelector('.g-lb');
    if (b) return b;
    b = document.createElement('div');
    b.className = 'g-lb';
    b.setAttribute('role', 'dialog');
    b.setAttribute('aria-modal', 'true');
    b.setAttribute('aria-label', 'Gallery viewer');
    b.innerHTML = '<div class="g-lb__bar"><div class="g-lb__cap"></div><div class="g-lb__tools">' +
      '<a class="btn g-lb__case" href="#">Case study →</a><button class="btn" data-g="close">Close ✕</button></div></div>' +
      '<div class="g-lb__stage"><button class="btn g-lb__nav g-lb__nav--prev" data-g="prev" aria-label="Previous">←</button>' +
      '<div class="g-lb__slot" style="display:contents"></div>' +
      '<button class="btn g-lb__nav g-lb__nav--next" data-g="next" aria-label="Next">→</button></div>';
    document.body.appendChild(b);
    return b;
  }
  function open(i) {
    var list = visible(); if (!list.length) return;
    cur = (i + list.length) % list.length;
    var it = list[cur], b = box(), slot = b.querySelector('.g-lb__slot');
    var media = it.querySelector('.g-media'), v = media.querySelector('video'), im = media.querySelector('img');
    slot.innerHTML = '';
    var el;
    if (v) {
      el = document.createElement('video');
      el.src = v.currentSrc || v.getAttribute('src'); el.poster = v.poster || '';
      el.controls = true; el.loop = true; el.muted = true; el.autoplay = true; el.playsInline = true;
    } else {
      el = document.createElement('img'); el.src = im.currentSrc || im.src; el.alt = im.alt;
    }
    if (media.classList.contains('g-plate')) el.className = 'on-plate';
    slot.appendChild(el);
    var title = it.querySelector('.g-title'), meta = it.querySelector('.g-meta span');
    b.querySelector('.g-lb__cap').innerHTML = '<b>' + (title ? title.textContent : '') + '</b>' + (meta ? meta.textContent : '');
    var link = it.querySelector('.g-link'), cl = b.querySelector('.g-lb__case');
    if (link) { cl.href = link.getAttribute('href'); cl.style.display = ''; } else cl.style.display = 'none';
    b.classList.add('is-open');
    document.documentElement.style.overflow = 'hidden';
  }
  function close() {
    var b = document.querySelector('.g-lb'); if (!b) return;
    b.classList.remove('is-open');
    b.querySelector('.g-lb__slot').innerHTML = '';
    document.documentElement.style.overflow = '';
  }

  document.addEventListener('click', function (e) {
    var t = e.target; if (!t.closest) return;
    init();
    var f = t.closest('.g-filters button');
    if (f) { filter = f.getAttribute('data-filter'); apply(); return; }
    var m = t.closest('.g-media');
    if (m) { open(visible().indexOf(m.closest('.g-item'))); return; }
    var a = t.closest('[data-g]');
    if (a) { var k = a.getAttribute('data-g'); if (k === 'close') close(); else if (k === 'next') open(cur + 1); else open(cur - 1); return; }
    if (t.classList && t.classList.contains('g-lb__stage')) close();
  });
  document.addEventListener('keydown', function (e) {
    if (!document.querySelector('.g-lb.is-open')) return;
    if (e.key === 'Escape') close();
    else if (e.key === 'ArrowRight') open(cur + 1);
    else if (e.key === 'ArrowLeft') open(cur - 1);
  });
})();
