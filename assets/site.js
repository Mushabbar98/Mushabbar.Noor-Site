// Delegated site behaviour — timing-proof (works no matter when this file loads).
(function () {
  if (window.__mhnSiteJs) return;
  window.__mhnSiteJs = true;

  document.addEventListener('click', function (e) {
    var toggle = e.target.closest && e.target.closest('.nav-toggle');
    if (!toggle) return;
    var links = document.querySelector('.nav-links');
    if (!links) return;
    var open = links.style.display === 'flex';
    if (open) {
      links.style.display = 'none';
    } else {
      links.style.display = 'flex';
      links.style.flexDirection = 'column';
      links.style.position = 'absolute';
      links.style.top = '64px';
      links.style.left = '0';
      links.style.right = '0';
      links.style.background = '#F5F6F3';
      links.style.padding = '20px 32px';
      links.style.borderBottom = '1px solid #D7DBD4';
      links.style.gap = '18px';
    }
    toggle.textContent = open ? 'Menu' : 'Close';
  });

  document.addEventListener('click', function (e) {
    var img = e.target.closest && e.target.closest('.figure img, .figure-pair img, .figure-trio img');
    var box = document.getElementById('lightbox');
    if (img && box) {
      box.querySelector('img').src = img.src;
      box.querySelector('img').alt = img.alt;
      box.classList.add('open');
      return;
    }
    if (box && box.classList.contains('open') && e.target.closest('#lightbox')) {
      box.classList.remove('open');
    }
  });

  document.addEventListener('submit', function (e) {
    var form = e.target.closest && e.target.closest('form.inquiry');
    if (!form) return;
    e.preventDefault();
    var name = form.querySelector('#name');
    var subject = encodeURIComponent('Portfolio inquiry from ' + (name ? name.value : ''));
    var body = [];
    form.querySelectorAll('input,select,textarea').forEach(function (f) {
      if (f.name) body.push(f.previousElementSibling ? f.previousElementSibling.textContent + ': ' + f.value : f.value);
    });
    window.location.href = 'mailto:mushabbarhn@gmail.com?subject=' + subject + '&body=' + encodeURIComponent(body.join('\n'));
    var btn = form.querySelector('button[type=submit]');
    if (btn) btn.textContent = 'Opening mail client…';
  });
})();
