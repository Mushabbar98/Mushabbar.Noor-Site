// MHN.ENG case-study behaviour: nav toggle, figure comparison tabs, lightbox with zoom.
// Delegated listeners, so it works whenever the markup is rendered.
(function () {
  if (window.__mhnCaseJs) return;
  window.__mhnCaseJs = true;

  function figures() {
    return Array.prototype.filter.call(
      document.querySelectorAll('.mx-figure__frame img'),
      function (img) { return img.offsetParent !== null; }
    );
  }

  function lightbox() {
    var box = document.querySelector('.mx-lightbox');
    if (box) return box;
    box = document.createElement('div');
    box.className = 'mx-lightbox';
    box.setAttribute('role', 'dialog');
    box.setAttribute('aria-modal', 'true');
    box.setAttribute('aria-label', 'Figure viewer');
    box.innerHTML =
      '<div class="mx-lightbox__bar"><div class="mx-lightbox__cap"></div>' +
      '<div class="mx-lightbox__tools">' +
      '<button class="mx-btn mx-btn--sm" data-lb="zoom">Zoom 2×</button>' +
      '<button class="mx-btn mx-btn--sm" data-lb="close">Close ✕</button></div></div>' +
      '<div class="mx-lightbox__stage">' +
      '<button class="mx-btn mx-btn--sm mx-lightbox__nav mx-lightbox__nav--prev" data-lb="prev" aria-label="Previous figure">←</button>' +
      '<img alt="">' +
      '<button class="mx-btn mx-btn--sm mx-lightbox__nav mx-lightbox__nav--next" data-lb="next" aria-label="Next figure">→</button></div>';
    document.body.appendChild(box);
    return box;
  }

  var current = -1;
  function show(i) {
    var list = figures();
    if (!list.length) return;
    current = (i + list.length) % list.length;
    var src = list[current];
    var box = lightbox();
    var img = box.querySelector('.mx-lightbox__stage img');
    unzoom(box);
    img.src = src.currentSrc || src.src;
    img.alt = src.alt;
    img.classList.toggle('is-dark', !src.closest('.mx-figure__frame--plate'));
    var fig = src.closest('figure');
    var cap = fig && fig.querySelector('figcaption');
    box.querySelector('.mx-lightbox__cap').innerHTML = cap ? cap.innerHTML : '';
    box.classList.add('is-open');
    document.documentElement.style.overflow = 'hidden';
    box.querySelector('[data-lb="close"]').focus();
  }
  function hide() {
    var box = document.querySelector('.mx-lightbox');
    if (!box) return;
    box.classList.remove('is-open');
    document.documentElement.style.overflow = '';
    var list = figures();
    if (list[current]) { var f = list[current].closest('.mx-figure__frame'); if (f) f.focus(); }
  }
  function unzoom(box) {
    box.classList.remove('is-zoomed');
    var img = box.querySelector('.mx-lightbox__stage img');
    img.style.width = '';
    box.querySelector('[data-lb="zoom"]').textContent = 'Zoom 2×';
  }
  function toggleZoom() {
    var box = lightbox();
    var img = box.querySelector('.mx-lightbox__stage img');
    if (box.classList.contains('is-zoomed')) { unzoom(box); return; }
    var w = img.getBoundingClientRect().width;
    box.classList.add('is-zoomed');
    img.style.width = Math.round(w * 2) + 'px';
    box.querySelector('[data-lb="zoom"]').textContent = 'Fit';
  }

  document.addEventListener('click', function (e) {
    var t = e.target;
    if (!t.closest) return;

    var toggle = t.closest('.mx-nav__toggle');
    if (toggle) {
      var nav = toggle.closest('.mx-nav');
      var open = nav.classList.toggle('is-open');
      toggle.textContent = open ? 'Close' : 'Menu';
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      return;
    }

    var tab = t.closest('[data-show]');
    if (tab) {
      var group = tab.closest('.mx-compare');
      var id = tab.getAttribute('data-show');
      group.querySelectorAll('[data-show]').forEach(function (b) {
        b.setAttribute('aria-selected', b.getAttribute('data-show') === id ? 'true' : 'false');
      });
      group.querySelectorAll('.mx-figure[data-id]').forEach(function (f) {
        f.classList.toggle('is-hidden', f.getAttribute('data-id') !== id);
      });
      return;
    }

    var frame = t.closest('.mx-figure__frame');
    if (frame) {
      var img = frame.querySelector('img');
      show(figures().indexOf(img));
      return;
    }

    var act = t.closest('[data-lb]');
    if (act) {
      var a = act.getAttribute('data-lb');
      if (a === 'close') hide();
      else if (a === 'next') show(current + 1);
      else if (a === 'prev') show(current - 1);
      else if (a === 'zoom') toggleZoom();
      return;
    }
    if (t.matches && t.matches('.mx-lightbox__stage img')) { toggleZoom(); return; }
    if (t.classList && (t.classList.contains('mx-lightbox__stage') || t.classList.contains('mx-lightbox'))) hide();
  });

  document.addEventListener('keydown', function (e) {
    var box = document.querySelector('.mx-lightbox.is-open');
    if (box) {
      if (e.key === 'Escape') hide();
      else if (e.key === 'ArrowRight') show(current + 1);
      else if (e.key === 'ArrowLeft') show(current - 1);
      return;
    }
    if ((e.key === 'Enter' || e.key === ' ') && e.target.classList && e.target.classList.contains('mx-figure__frame')) {
      e.preventDefault();
      show(figures().indexOf(e.target.querySelector('img')));
    }
  });
})();
