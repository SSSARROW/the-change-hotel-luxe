/* Scroll-reveal for The Change Hotel sites. No effect when the visitor prefers reduced motion. */
(function () {
  'use strict';
  if (!('IntersectionObserver' in window)) { return; }
  if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) { return; }

  var SEL = [
    'main section h1', 'main section h2', 'main section h3',
    'main section .body', 'main section .pbody', 'main section .lede', 'main section .intro-line', 'main section .big',
    'main section .script-h', 'main section .eyebrow', 'main section .kicker', 'main section .rule',
    'main section .checks', 'main section .perks', 'main section .chips', 'main section .know', 'main section .themes',
    'main section .list-rows', 'main section .rows', 'main section .facts', 'main section .facts-dl', 'main section .stats',
    'main section figure', 'main section .stack', 'main section .duo', 'main section .two-img', 'main section .pair-arch',
    'main section .arch', 'main section .moment', 'main section .room-media', 'main section .card', 'main section .price', 'main section .pprice',
    'main section .gp-grid > a', 'main section .gal > a', 'main section .gal-f > a', 'main section .ggrid > a',
    'main section .map-frame', 'main section .map-note', 'main section .cform', 'main section .bar-card', 'main section .booking.stacked',
    'main section .ctas', 'main section .more', 'main section .photo-band img', 'main section .rv-foot', 'main section blockquote',
    'main section .intro ul', 'main section .intro p', 'main section address', 'main section .btn', 'main section .b'
  ].join(',');

  var skip = '.hero, .reviews, header, footer, .rv-marquee';
  var all = Array.prototype.slice.call(document.querySelectorAll(SEL)).filter(function (el) {
    return !el.closest(skip);
  });
  var set = new Set(all);
  // keep only top-most targets so a block and its children don't animate twice
  var targets = all.filter(function (el) {
    var p = el.parentElement;
    while (p) { if (set.has(p)) { return false; } p = p.parentElement; }
    return true;
  });
  if (!targets.length) { return; }

  document.documentElement.classList.add('motion');
  var counters = new Map();
  targets.forEach(function (el) {
    var parent = el.parentElement;
    var i = counters.get(parent) || 0;
    counters.set(parent, i + 1);
    el.style.setProperty('--rd', Math.min(i, 4) * 110 + 'ms');
    el.classList.add('rv-el');
  });

  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('in');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });
  targets.forEach(function (el) { io.observe(el); });
})();
