/* Shared behaviour for The Change Hotel sites: mobile nav + booking request widget. */
(function () {
  'use strict';

  var NIGHTLY_RATE = 17000; // approximate LKR per room per night, breakfast included

  function pad(n) { return n < 10 ? '0' + n : '' + n; }
  function toIso(d) { return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate()); }
  function fromIso(s) { return new Date(s + 'T00:00:00'); }
  function addDays(d, n) { var c = new Date(d.getTime()); c.setDate(c.getDate() + n); return c; }
  function nightsBetween(a, b) { return Math.round((fromIso(b) - fromIso(a)) / 86400000); }
  function shortDate(iso) { return fromIso(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }); }
  function plural(n, one, many) { return n + ' ' + (n === 1 ? one : many); }

  /* ---------- mobile nav ---------- */
  document.querySelectorAll('[data-nav-toggle]').forEach(function (btn) {
    var header = btn.closest('[data-nav]') || document.body;
    btn.addEventListener('click', function () {
      var open = header.classList.toggle('nav-open');
      btn.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    header.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () {
        header.classList.remove('nav-open');
        btn.setAttribute('aria-expanded', 'false');
      });
    });
  });

  /* ---------- contact form (opens WhatsApp with a prefilled message) ---------- */
  document.querySelectorAll('[data-contact-form]').forEach(function (form) {
    var fields = ['name', 'reach', 'message'].map(function (n) {
      var input = form.elements[n];
      return { input: input, err: document.getElementById(input.getAttribute('aria-describedby')) };
    });
    fields.forEach(function (f) {
      f.input.addEventListener('input', function () {
        f.err.hidden = true;
        f.input.removeAttribute('aria-invalid');
      });
    });
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var firstBad = null;
      fields.forEach(function (f) {
        var bad = !f.input.value.trim();
        f.err.hidden = !bad;
        if (bad) {
          f.input.setAttribute('aria-invalid', 'true');
          if (!firstBad) { firstBad = f.input; }
        }
      });
      if (firstBad) { firstBad.focus(); return; }
      var text = 'Hello The Change Hotel, my name is ' + form.elements.name.value.trim() +
        ' (' + form.elements.reach.value.trim() + ').\n\n' + form.elements.message.value.trim();
      var url = 'https://wa.me/' + form.getAttribute('data-whatsapp') + '?text=' + encodeURIComponent(text);
      window.open(url, '_blank', 'noopener');
    });
  });

  /* ---------- gallery lightbox ---------- */
  var lbLinks = document.querySelectorAll('a[data-lightbox]');
  if (lbLinks.length && typeof HTMLDialogElement === 'function') {
    var dlg = document.createElement('dialog');
    dlg.className = 'lightbox';
    dlg.setAttribute('aria-label', 'Photo viewer');
    dlg.innerHTML = '<button type="button" class="lb-close" aria-label="Close photo">&times;</button><img alt=""><p></p>';
    document.body.appendChild(dlg);
    var lbImg = dlg.querySelector('img');
    var lbCap = dlg.querySelector('p');
    lbLinks.forEach(function (a) {
      a.addEventListener('click', function (e) {
        e.preventDefault();
        var thumb = a.querySelector('img');
        lbImg.src = a.getAttribute('href');
        lbImg.alt = thumb ? thumb.alt : '';
        lbCap.textContent = a.getAttribute('data-caption') || '';
        dlg.showModal();
      });
    });
    dlg.querySelector('.lb-close').addEventListener('click', function () { dlg.close(); });
    dlg.addEventListener('click', function (e) { if (e.target === dlg) { dlg.close(); } });
  }

  /* ---------- booking widget ---------- */
  document.querySelectorAll('[data-booking]').forEach(function (form) {
    var inEl = form.querySelector('[name="checkin"]');
    var outEl = form.querySelector('[name="checkout"]');
    var toggle = form.querySelector('[data-guests-toggle]');
    var panel = form.querySelector('[data-guests-panel]');
    var result = form.querySelector('[data-booking-result]') ||
      (form.parentElement && form.parentElement.querySelector('[data-booking-result]'));
    var state = { adults: 2, children: 0 };
    var today = new Date();
    today.setHours(0, 0, 0, 0);

    inEl.min = toIso(today);
    inEl.value = toIso(addDays(today, 14));
    outEl.min = toIso(addDays(today, 15));
    outEl.value = toIso(addDays(today, 16));

    function hideResult() { if (result) { result.hidden = true; } }

    function renderGuests() {
      var total = state.adults + state.children;
      form.querySelectorAll('[data-guest-summary]').forEach(function (el) {
        el.textContent = plural(total, 'guest', 'guests');
      });
      ['adults', 'children'].forEach(function (key) {
        form.querySelectorAll('[data-count="' + key + '"]').forEach(function (el) { el.textContent = state[key]; });
      });
      form.querySelectorAll('[data-step]').forEach(function (b) {
        var key = b.getAttribute('data-step');
        var dir = Number(b.getAttribute('data-dir'));
        var min = key === 'adults' ? 1 : 0;
        var max = key === 'adults' ? 6 : 4;
        b.disabled = (dir < 0 && state[key] <= min) || (dir > 0 && state[key] >= max);
      });
    }

    function closePanel() {
      if (!panel || panel.hidden) { return; }
      panel.hidden = true;
      toggle.setAttribute('aria-expanded', 'false');
    }

    inEl.addEventListener('change', function () {
      var minOut = addDays(fromIso(inEl.value), 1);
      outEl.min = toIso(minOut);
      if (!outEl.value || fromIso(outEl.value) < minOut) { outEl.value = toIso(minOut); }
      hideResult();
    });
    outEl.addEventListener('change', hideResult);

    if (toggle && panel) {
      toggle.addEventListener('click', function () {
        var open = panel.hidden;
        panel.hidden = !open;
        toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      });
      document.addEventListener('click', function (e) {
        if (!form.contains(e.target)) { closePanel(); }
      });
      form.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') { closePanel(); toggle.focus(); }
      });
      form.querySelectorAll('[data-step]').forEach(function (b) {
        b.addEventListener('click', function () {
          var key = b.getAttribute('data-step');
          state[key] += Number(b.getAttribute('data-dir'));
          renderGuests();
          hideResult();
        });
      });
      var done = form.querySelector('[data-guests-done]');
      if (done) { done.addEventListener('click', function () { closePanel(); toggle.focus(); }); }
    }

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (!inEl.value || !outEl.value) { return; }
      var nights = Math.max(1, nightsBetween(inEl.value, outEl.value));
      var guests = state.adults + state.children;
      closePanel();
      if (!result) { return; }
      var summary = result.querySelector('[data-r-summary]');
      var estimate = result.querySelector('[data-r-estimate]');
      if (summary) {
        summary.textContent = shortDate(inEl.value) + ' → ' + shortDate(outEl.value) + ' · ' +
          plural(nights, 'night', 'nights') + ' · ' + plural(guests, 'guest', 'guests');
      }
      if (estimate) { estimate.textContent = 'LKR ' + (nights * NIGHTLY_RATE).toLocaleString('en-US'); }
      var wa = result.querySelector('[data-r-whatsapp]');
      if (wa) {
        var msg = 'Hello The Change Hotel, I would like to check availability from ' + shortDate(inEl.value) +
          ' to ' + shortDate(outEl.value) + ' (' + plural(nights, 'night', 'nights') + ') for ' +
          plural(guests, 'guest', 'guests') + '. Is a room available?';
        wa.href = 'https://wa.me/94777403921?text=' + encodeURIComponent(msg);
      }
      result.hidden = false;
      var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      result.scrollIntoView({ block: 'center', behavior: reduce ? 'auto' : 'smooth' });
    });

    renderGuests();
  });
})();
