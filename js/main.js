/* Daivane Kuhn — interações da landing page */
(function () {
  'use strict';

  var header = document.querySelector('.header');
  var toggle = document.querySelector('.menu-toggle');
  var nav = document.getElementById('menu');
  var desktop = window.matchMedia('(min-width: 960px)');

  /* Cabeçalho com fundo ao rolar */
  function onScroll() {
    header.classList.toggle('is-scrolled', window.scrollY > 12);
  }
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  /* Menu mobile */
  function setMenu(open) {
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
    nav.classList.toggle('is-open', open);
    header.classList.toggle('menu-open', open);
    document.body.classList.toggle('no-scroll', open);
  }

  toggle.addEventListener('click', function () {
    setMenu(toggle.getAttribute('aria-expanded') !== 'true');
  });

  nav.addEventListener('click', function (e) {
    if (e.target.closest('a')) setMenu(false);
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && nav.classList.contains('is-open')) {
      setMenu(false);
      toggle.focus();
    }
  });

  desktop.addEventListener('change', function (e) {
    if (e.matches) setMenu(false);
  });

  /* FAQ em acordeão (um aberto por vez) */
  var triggers = document.querySelectorAll('.accordion__trigger');
  triggers.forEach(function (btn) {
    btn.addEventListener('click', function () {
      var item = btn.closest('.accordion__item');
      var willOpen = btn.getAttribute('aria-expanded') !== 'true';

      triggers.forEach(function (other) {
        other.setAttribute('aria-expanded', 'false');
        other.closest('.accordion__item').classList.remove('is-open');
      });

      btn.setAttribute('aria-expanded', String(willOpen));
      item.classList.toggle('is-open', willOpen);
    });
  });

  /* Animações de entrada */
  var reveals = document.querySelectorAll('.reveal');
  var calendar = document.querySelector('.calendar');
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function fillCalendar() {
    if (!calendar || calendar.classList.contains('is-filled')) return;
    var days = calendar.querySelectorAll('.calendar__days i');
    days.forEach(function (d, i) {
      d.style.transitionDelay = reduceMotion ? '0ms' : (i * 70) + 'ms';
    });
    calendar.classList.add('is-filled');
  }

  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var el = entry.target;
        var siblings = el.parentElement ? el.parentElement.querySelectorAll(':scope > .reveal') : [];
        var index = Array.prototype.indexOf.call(siblings, el);
        el.style.transitionDelay = (index > 0 ? Math.min(index, 5) * 80 : 0) + 'ms';
        el.classList.add('is-visible');
        if (el === calendar) setTimeout(fillCalendar, 400);
        io.unobserve(el);
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

    reveals.forEach(function (el) { io.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add('is-visible'); });
    fillCalendar();
  }

  /* Ano atual no rodapé */
  var year = document.querySelector('[data-year]');
  if (year) year.textContent = new Date().getFullYear();
})();
