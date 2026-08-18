document.addEventListener('DOMContentLoaded', function () {
  // mobile nav toggle
  var toggle = document.querySelector('.nav-toggle');
  var links = document.querySelector('.nav-links');
  if (toggle && links) {
    toggle.addEventListener('click', function () {
      var open = links.style.display === 'flex';
      links.style.display = open ? 'none' : 'flex';
      links.style.flexDirection = 'column';
      links.style.position = 'absolute';
      links.style.top = '64px';
      links.style.left = '0';
      links.style.right = '0';
      links.style.background = '#F5F6F3';
      links.style.padding = '20px 32px';
      links.style.borderBottom = '1px solid #D7DBD4';
      links.style.gap = '18px';
      toggle.textContent = open ? 'MENU' : 'CLOSE';
    });
  }

  // scroll reveal
  var revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && revealEls.length) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
      });
    }, { threshold: .12 });
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add('in'); });
  }
  // safety net: never leave content permanently invisible
  setTimeout(function () {
    revealEls.forEach(function (el) { el.classList.add('in'); });
  }, 1200);

  // inquiry form (contact page) - no backend, shows confirmation state
  var form = document.querySelector('form.inquiry');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var btn = form.querySelector('button[type=submit]');
      var name = form.querySelector('#name');
      var subject = encodeURIComponent('Portfolio inquiry from ' + (name ? name.value : ''));
      var body = [];
      form.querySelectorAll('input,select,textarea').forEach(function (f) {
        if (f.name) body.push(f.previousElementSibling ? f.previousElementSibling.textContent + ': ' + f.value : f.value);
      });
      window.location.href = 'mailto:mushabbarhn@gmail.com?subject=' + subject + '&body=' + encodeURIComponent(body.join('\n'));
      if (btn) { btn.textContent = 'Opening mail client…'; }
    });
  }
});
