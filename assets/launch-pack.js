/* Dorina Launch Pack · site behaviour (public pages).
   Replaces dorina-platform.js on the launch pages. No library. Every storage access is guarded.
   Reads window.LAUNCH (assets/launch-config.js) and window.LaunchBooking (assets/booking/booking-api.js)
   when they exist; the static markup holds a fallback for everything it fills in.
   Conventions: launch-pack/_work/CONVENTIONS.md sections 3, 4, 5 and 9. */
(function () {
  'use strict';
  var d = document, html = d.documentElement, body = d.body;
  var me = d.currentScript || d.querySelector('script[src*="launch-pack.js"]');
  var ROOT;
  try { ROOT = new URL('../', me && me.src ? me.src : location.href).href; } catch (e) { ROOT = './'; }
  var L = window.LAUNCH || null;
  var C = (L && L.config) || window.LAUNCH_CONFIG || {};
  var RM = false;
  try { RM = window.matchMedia('(prefers-reduced-motion: reduce)').matches; } catch (e) {}
  var hasIO = 'IntersectionObserver' in window;

  function $(s, el) { return (el || d).querySelector(s); }
  function $$(s, el) { return Array.prototype.slice.call((el || d).querySelectorAll(s)); }
  function isTodo(v) { return L ? L.isTodo(v) : (typeof v === 'string' && v.charAt(0) === '['); }
  function ls(k, v) {
    try { if (v === undefined) return localStorage.getItem(k); localStorage.setItem(k, v); } catch (e) {}
    return null;
  }
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function todo(text) { return '<mark class="lp-todo">' + esc(text) + '</mark>'; }
  function bidi(s) { return '<bdi dir="ltr">' + esc(s) + '</bdi>'; }
  function q(name) { try { return new URLSearchParams(location.search).get(name); } catch (e) { return null; } }

  /* ---------- language ---------- */
  var lang = 'en';
  function readLang() {
    var v = q('lang');
    if (v === 'ar' || v === 'en') { ls('dorinaLang', v); return v; }
    v = ls('dorinaLang');
    if (v !== 'ar' && v !== 'en') {
      v = ls('dorinaLandingLanguage'); /* the old circle-page key, read once */
      if (v === 'ar' || v === 'en') ls('dorinaLang', v);
    }
    return v === 'ar' ? 'ar' : 'en';
  }
  function setLang(l, save) {
    lang = l === 'ar' ? 'ar' : 'en';
    body.classList.toggle('ar', lang === 'ar');
    html.classList.remove('lp-ar-pending');
    html.lang = lang; html.dir = lang === 'ar' ? 'rtl' : 'ltr';
    if (save) ls('dorinaLang', lang);
    $$('[data-placeholder-en]').forEach(function (el) { el.placeholder = el.getAttribute('data-placeholder-' + lang) || el.getAttribute('data-placeholder-en'); });
    $$('option[data-en]').forEach(function (o) { o.textContent = o.getAttribute('data-' + lang) || o.getAttribute('data-en'); });
    $$('img[data-alt-ar]').forEach(function (im) { if (!im.hasAttribute('data-alt-en')) im.setAttribute('data-alt-en', im.alt); im.alt = im.getAttribute('data-alt-' + lang); });
    $$('[data-aria-en]').forEach(function (el) { el.setAttribute('aria-label', el.getAttribute('data-aria-' + lang) || el.getAttribute('data-aria-en')); });
    var t = html.getAttribute('data-title-' + lang); if (t) d.title = t;
    var md = $('meta[name="description"]'), dv = html.getAttribute('data-desc-' + lang); if (md && dv) md.content = dv;
    $$('[data-lang]').forEach(function (b) { b.setAttribute('aria-label', lang === 'ar' ? 'Switch to English' : 'التبديل إلى العربية'); });
    render();
  }
  $$('[data-lang]').forEach(function (b) {
    b.addEventListener('click', function () {
      setLang(lang === 'ar' ? 'en' : 'ar', true);
      try { d.dispatchEvent(new CustomEvent('dorina:lang', { detail: { lang: lang } })); } catch (e) {}
    });
  });
  d.addEventListener('dorina:lang', function (e) {
    var l = e && e.detail && e.detail.lang;
    if (l && l !== lang) setLang(l, false);
  });

  /* ---------- source tag and links ---------- */
  function src() {
    if (L) return L.src();
    var v = q('src');
    if (v && /^[a-z0-9_-]{1,24}$/i.test(v)) { try { sessionStorage.setItem('dorinaSrc', v); } catch (e) {} return v; }
    try { v = sessionStorage.getItem('dorinaSrc'); } catch (e) { v = null; }
    return v || 'web';
  }
  function bookUrl(o) {
    if (L) return L.bookUrl(o);
    var u = new URL('book/', ROOT);
    ['offer', 'session', 'seats', 'src', 'lang', 'interest'].forEach(function (k) { if (o[k] != null && o[k] !== '') u.searchParams.set(k, o[k]); });
    return u.href;
  }
  function waLink(text) {
    if (L) return L.waLink(text);
    return 'https://wa.me/?text=' + encodeURIComponent(text || '');
  }
  /* True while waNumber is still the [DORINA: ...] placeholder (or empty). A wa.me link without a number
     opens the visitor's contact picker, not Dorina, so no WhatsApp button is shown as a live link then. */
  function noWaNumber() { var n = C.waNumber; return !n || isTodo(n) || String(n).replace(/\D/g, '').length < 8; }
  var WA_PH = '[DORINA: WhatsApp Business number]';
  function waPlaceholder(a, on) {
    a.hidden = on;
    var ph = a.nextElementSibling;
    if (!(ph && ph.hasAttribute('data-lp-wa-ph'))) {
      if (!on || a.hasAttribute('data-lp-wa-noph')) return;
      ph = d.createElement('mark');
      ph.className = 'lp-todo lp-wa-ph'; ph.setAttribute('data-lp-wa-ph', ''); ph.textContent = WA_PH;
      a.parentNode.insertBefore(ph, a.nextSibling);
    }
    ph.hidden = !on;
  }
  function isWa(href) { return /^https:\/\/wa\.me\//.test(href); }
  function setHref(a, href) {
    a.href = href;
    if (isWa(href)) { a.target = '_blank'; a.rel = 'noopener'; } else { a.removeAttribute('target'); }
  }

  /* ---------- session data ---------- */
  var FALLBACK = { id: 'wpc-founding-20261205', offerId: 'wpc-founding', startsAt: '2026-12-05T08:00:00Z', endsAt: '2026-12-05T11:00:00Z', timeConfirmed: true, areaEn: 'Beirut', areaAr: 'بيروت', capacity: 15, priceUsd: 40, pairPriceUsd: 75, currency: 'USD', status: 'open' };
  function nextFor(offerId) {
    if (!L) return offerId === 'wpc-founding' || !offerId ? FALLBACK : null;
    return L.nextSession(offerId) || null;
  }
  function fmtDate(iso) {
    if (L) return L.formatDate(iso, lang);
    try { return new Intl.DateTimeFormat(lang === 'ar' ? 'ar-LB-u-nu-latn' : 'en-GB', { timeZone: 'Asia/Beirut', weekday: 'long', day: 'numeric', month: 'long' }).format(new Date(iso)); } catch (e) { return iso.slice(0, 10); }
  }
  function fmtShort(iso) {
    try { return new Intl.DateTimeFormat(lang === 'ar' ? 'ar-LB-u-nu-latn' : 'en-GB', { timeZone: C.tzPrimary || 'Asia/Beirut', weekday: 'short', day: 'numeric', month: 'short' }).format(new Date(iso)); } catch (e) { return iso.slice(0, 10); }
  }
  function fmtTime(iso) {
    if (L && L.formatTime) return L.formatTime(iso, lang);
    try { return new Intl.DateTimeFormat(lang === 'ar' ? 'ar-LB-u-nu-latn' : 'en-GB', { timeZone: 'Asia/Beirut', hour: 'numeric', minute: '2-digit', hour12: true }).format(new Date(iso)); } catch (e) { return ''; }
  }
  function money(n, cur) { return L ? L.money(n, cur, lang) : '$' + n; }
  var seatsLeft = {};

  function fill(box) {
    var offerId = box.getAttribute('data-lp-session') || 'wpc-founding';
    var s = nextFor(offerId);
    var o = L ? L.offer(offerId) : null;
    var f = function (name) { return $$('[data-f="' + name + '"]', box); };
    if (!s) {
      /* nothing open: say so honestly and turn the reserve button into the list */
      f('date').concat(f('dateshort')).forEach(function (el) { el.innerHTML = lang === 'ar' ? 'الموعد القادم قريباً' : 'Next date soon'; });
      $$('[data-lp-reserve]', box).forEach(function (a) { a.setAttribute('data-lp-list', 'circle'); a.removeAttribute('data-lp-reserve'); });
      return;
    }
    var ar = lang === 'ar';
    f('date').forEach(function (el) { el.textContent = fmtDate(s.startsAt); });
    f('dateshort').forEach(function (el) { el.textContent = fmtShort(s.startsAt); });
    f('time').forEach(function (el) {
      var t = bidi(fmtTime(s.startsAt)) + ' – ' + bidi(fmtTime(s.endsAt));
      el.innerHTML = t + (s.timeConfirmed ? '' : ' ' + todo(ar ? '[DORINA: صباحاً أو بعد الظهر]' : '[DORINA: confirm morning or afternoon]'));
    });
    f('area').forEach(function (el) {
      var a = ar ? s.areaAr : s.areaEn;
      if (s.online) { el.textContent = ar ? 'أونلاين' : 'Online'; return; }
      el.innerHTML = isTodo(a) ? todo(ar ? '[DORINA: المنطقة]' : '[DORINA: area]') : esc(a);
    });
    f('price').forEach(function (el) { el.innerHTML = bidi(money(s.priceUsd, s.currency)); });
    f('pair').forEach(function (el) { el.innerHTML = s.pairPriceUsd ? bidi(money(s.pairPriceUsd, s.currency)) : ''; });
    f('cap').forEach(function (el) { el.innerHTML = bidi(String(s.capacity)); });
    f('confirm').forEach(function (el) { el.hidden = !!(o && o.priceConfirmed); });
    var left = seatsLeft[s.id];
    f('seats').forEach(function (el) {
      if (C.showSeatsLeft && typeof left === 'number') {
        el.innerHTML = left > 0
          ? (ar ? 'تبقّى ' + bidi(left) + ' ' + (left === 1 ? 'مقعد' : 'مقاعد') : bidi(left) + (left === 1 ? ' seat left' : ' seats left'))
          : (ar ? 'اكتملت المقاعد: انضمّي إلى قائمة الانتظار' : 'Full: join the waitlist');
        el.classList.add('is-shown');
      } else { el.classList.remove('is-shown'); }
    });
    $$('[data-lp-reserve]', box).forEach(function (a) { a.setAttribute('data-session', s.id); if (!a.getAttribute('data-offer')) a.setAttribute('data-offer', s.offerId); });
    if (typeof left === 'number' && left <= 0) {
      $$('[data-lp-reserve] [data-en]', box).forEach(function (sp) { sp.textContent = 'Join the waitlist'; });
      $$('[data-lp-reserve] [data-ar]', box).forEach(function (sp) { sp.textContent = 'انضمّي إلى قائمة الانتظار'; });
    }
  }
  function loadSeats() {
    var LB = window.LaunchBooking;
    if (!C.showSeatsLeft || !LB || typeof LB.getSession !== 'function') return;
    var ids = {};
    $$('[data-lp-session]').forEach(function (b) { var s = nextFor(b.getAttribute('data-lp-session') || 'wpc-founding'); if (s) ids[s.id] = 1; });
    Object.keys(ids).forEach(function (id) {
      Promise.resolve(typeof LB.ready === 'function' ? LB.ready() : LB.ready).then(function () { return LB.getSession(id); }).then(function (s) {
        if (!s) return;
        var n = s.seatsLeft != null ? s.seatsLeft : s.seats_left != null ? s.seats_left : (s.capacity != null && s.seatsTaken != null ? s.capacity - s.seatsTaken : null);
        if (typeof n === 'number') { seatsLeft[id] = Math.max(0, n); render(); }
      }).catch(function () {});
    });
  }

  /* ---------- render everything that depends on language or config ---------- */
  var WA_DEFAULT = { en: 'Hello Dorina', ar: 'مرحباً دورينا' };
  function render() {
    body.classList.toggle('lp-todo-quiet', C.showTodoMarkers === false);
    var noNumber = noWaNumber();
    /* WhatsApp booking mode needs a real number; without one, Reserve keeps going to book/ */
    var viaBook = !L || (C.bookingMode === 'whatsapp' && noNumber);
    $$('[data-lp-session]').forEach(fill);
    $$('[data-lp-reserve]').forEach(function (a) {
      var o = { offer: a.getAttribute('data-offer') || 'wpc-founding', session: a.getAttribute('data-session') || null, src: src() };
      if (a.getAttribute('data-seats')) o.seats = a.getAttribute('data-seats');
      setHref(a, !viaBook ? L.reserveHref(o) : bookUrl({ offer: o.offer, session: o.session || FALLBACK.id, seats: o.seats, src: o.src, lang: lang }));
    });
    $$('[data-lp-list]').forEach(function (a) {
      var interest = a.getAttribute('data-lp-list') || '';
      var o = { offer: 'next-circle-list', interest: interest === 'circle' ? '' : interest, src: src() };
      setHref(a, !viaBook ? L.reserveHref(o) : bookUrl({ offer: o.offer, interest: o.interest, src: o.src, lang: lang }));
    });
    $$('[data-lp-wa]').forEach(function (a) {
      var t = a.getAttribute('data-wa-' + lang) || WA_DEFAULT[lang];
      setHref(a, waLink(t));
      waPlaceholder(a, noNumber);
    });
    $$('[data-lp-wa-again]').forEach(function (a) { waPlaceholder(a, noNumber); });
    $$('[data-lp-wa-todo]').forEach(function (el) { el.hidden = !noNumber; });
    $$('[data-lp-wa-sent]').forEach(function (el) { el.hidden = noNumber; });
    var pay = C.payment || {};
    $$('[data-cfg="pay"]').forEach(function (el) { if (lang === 'en' && pay.lineEn && !isTodo(pay.lineEn)) el.textContent = pay.lineEn; else if (lang === 'ar' && pay.lineAr && !isTodo(pay.lineAr)) el.textContent = pay.lineAr; });
    /* payment.approved false: the routes and the hold are not stated as fact; a [DORINA: ...] marker stands in their place */
    $$('[data-cfg="pay-line"]').forEach(function (el) { el.hidden = pay.approved !== true; });
    $$('[data-cfg="pay-todo"]').forEach(function (el) { el.hidden = pay.approved === true; });
    var pol = C.policy || {};
    $$('[data-cfg="cancel"]').forEach(function (el) { if (lang === 'en' && pol.cancelEn && !isTodo(pol.cancelEn)) el.textContent = pol.cancelEn; });
    $$('[data-cfg="move"]').forEach(function (el) { if (lang === 'en' && pol.moveEn && !isTodo(pol.moveEn)) el.textContent = pol.moveEn; });
    $$('[data-cfg="policy-todo"]').forEach(function (el) { el.hidden = pol.approved === true; });
    $$('[data-cfg="privacy"]').forEach(function (el) { if (lang === 'en' && C.privacyLineEn) el.textContent = C.privacyLineEn; });
    $$('[data-cfg="linkedin"]').forEach(function (a) { if (C.linkedinUrl && !isTodo(C.linkedinUrl)) a.href = C.linkedinUrl; });
    $$('[data-cfg="hold"]').forEach(function (el) { var h = C.holds && C.holds.holdHours; if (h) el.textContent = h; });
    var ofr = L ? L.offer.bind(L) : function () { return null; };
    $$('[data-price-confirm]').forEach(function (el) { var o = ofr(el.getAttribute('data-price-confirm')); el.hidden = !!(o && o.priceConfirmed); });
    $$('[data-gate]').forEach(function (el) { var o = ofr(el.getAttribute('data-gate')); if (o && o.status === 'open' && o.bookable) el.hidden = true; });
    publicNoNumber(noNumber);
  }

  /* Live site without a WhatsApp number (2026-11-11): no button opens an empty chat or a page with example data.
     Reserve, list and WhatsApp buttons go to Dorina's LinkedIn profile, the enquiry forms are replaced by the same
     link, and no [DORINA: ...] gap mark is left on the page. On localhost nothing changes, for review. */
  var LI_LABEL = { en: 'Message Dorina on LinkedIn', ar: 'راسلي دورينا على LinkedIn' }; // AR: for native review
  function publicNoNumber(noNumber) {
    var local = L ? L.isLocalHost() : false;
    if (local) return;
    $$('mark.lp-todo,mark.bk-todo').forEach(function (m) { if (m.parentNode) m.parentNode.removeChild(m); });
    if (!noNumber) return;
    var li = C.linkedinUrl && !isTodo(C.linkedinUrl) ? C.linkedinUrl : '';
    function toLi(a) { if (li) { a.href = li; a.target = '_blank'; a.rel = 'noopener'; a.hidden = false; } else { a.hidden = true; } }
    $$('[data-lp-reserve],[data-lp-list]').forEach(toLi);
    $$('[data-lp-wa]').forEach(function (a) {
      toLi(a);
      if (!li) return;
      $$('svg', a).forEach(function (s) { if (s.parentNode) s.parentNode.removeChild(s); });
      var en = a.querySelector('[data-en]'), ar = a.querySelector('[data-ar]');
      if (en || ar) { if (en) en.textContent = LI_LABEL.en; if (ar) ar.textContent = LI_LABEL.ar; }
      else a.textContent = LI_LABEL[lang] || LI_LABEL.en;
    });
    $$('form[data-lp-lead]').forEach(function (form) {
      if (form.hasAttribute('data-lp-li')) return;
      form.setAttribute('data-lp-li', '');
      form.style.display = 'none';
      if (!li) return;
      var p = d.createElement('p'); p.className = 'lp-li-alt';
      var a = d.createElement('a'); a.className = 'lp-btn'; a.href = li; a.target = '_blank'; a.rel = 'noopener';
      a.innerHTML = '<span data-en>' + LI_LABEL.en + '</span><span data-ar>' + LI_LABEL.ar + '</span>';
      p.appendChild(a); form.parentNode.insertBefore(p, form.nextSibling);
    });
  }

  /* ---------- nav: scrolled state, past-the-hero call to action, phone menu ---------- */
  var nav = $('.lp-nav'), hero = $('.lp-hero');
  function onScroll() {
    if (!nav) return;
    var y = window.scrollY || html.scrollTop || 0;
    nav.classList.toggle('is-scrolled', y > 24);
    if (hero) nav.classList.toggle('is-past', y > hero.offsetHeight * 0.72);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
  var menuBtn = $('[data-lp-menu]'), sheet = $('.lp-sheetmenu');
  function menu(open) {
    html.classList.toggle('lp-menu-open', open);
    if (menuBtn) menuBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
    if (sheet) { sheet.setAttribute('aria-hidden', open ? 'false' : 'true'); if (open) { var f = $('a', sheet); if (f) f.focus({ preventScroll: true }); } }
  }
  if (menuBtn && sheet) {
    menuBtn.addEventListener('click', function () { menu(!html.classList.contains('lp-menu-open')); });
    sheet.addEventListener('click', function (e) { if (e.target.closest('a')) menu(false); });
    d.addEventListener('keydown', function (e) { if (e.key === 'Escape' && html.classList.contains('lp-menu-open')) { menu(false); menuBtn.focus(); } });
    window.addEventListener('resize', function () { if (window.innerWidth >= 900) menu(false); }, { passive: true });
  }

  /* ---------- motion: reveals, lazy backgrounds, ambient loops ---------- */
  var vh = window.innerHeight || 800;
  $$('[data-reveal-group]').forEach(function (g) {
    $$('[data-reveal]', g).forEach(function (el, i) { if (!el.style.getPropertyValue('--i')) el.style.setProperty('--i', Math.min(i, 6)); });
  });
  var revealEls = $$('[data-reveal], .lp-run, .lp-word');
  if (hasIO && !RM) {
    html.classList.add('lp-motion');
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); } });
    }, { threshold: 0.15, rootMargin: '0px 0px -8% 0px' });
    revealEls.forEach(function (el) {
      var r = el.getBoundingClientRect();
      if (r.top < vh * 0.92 && r.bottom > 0) requestAnimationFrame(function () { el.classList.add('is-in'); });
      else io.observe(el);
    });
  } else {
    revealEls.forEach(function (el) { el.classList.add('is-in'); });
  }
  var bgEls = $$('[data-bg]');
  if (hasIO) {
    var bio = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('is-near'); bio.unobserve(e.target); } });
    }, { rootMargin: '600px 0px' });
    bgEls.forEach(function (el) { bio.observe(el); });
  } else { bgEls.forEach(function (el) { el.classList.add('is-near'); }); }
  var loops = $$('[data-loop]');
  if (!RM) {
    if (hasIO) {
      var lio = new IntersectionObserver(function (es) { es.forEach(function (e) { e.target.classList.toggle('is-on', e.isIntersecting); }); });
      loops.forEach(function (el) { lio.observe(el); });
    } else { loops.forEach(function (el) { el.classList.add('is-on'); }); }
  }
  d.addEventListener('visibilitychange', function () { html.classList.toggle('lp-hidden', d.hidden); });

  /* ---------- sticky reserve bar (phone): after the hero ticket leaves, until the closing ticket arrives ---------- */
  var bar = $('[data-lp-stickybar]');
  if (bar && hasIO) {
    var startEl = $(bar.getAttribute('data-after') || '.lp-hero .lp-ticket'), endEl = $(bar.getAttribute('data-until') || '');
    var past = false, reached = false;
    var syncBar = function () {
      var on = past && !reached && !html.classList.contains('lp-menu-open');
      bar.classList.toggle('is-shown', on);
      bar.setAttribute('aria-hidden', on ? 'false' : 'true');
      if ('inert' in bar) bar.inert = !on;
      html.classList.toggle('lp-bar-on', on);
    };
    var bio2 = new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        if (e.target === startEl) past = !e.isIntersecting && e.boundingClientRect.bottom < 0;
        if (e.target === endEl) reached = e.isIntersecting || e.boundingClientRect.top < 0;
      });
      syncBar();
    });
    if (startEl) bio2.observe(startEl);
    if (endEl) bio2.observe(endEl);
    if (menuBtn) menuBtn.addEventListener('click', function () { setTimeout(syncBar, 0); });
    syncBar();
  }

  /* ---------- contact topics (WhatsApp text follows the chosen topic) ---------- */
  $$('[data-lp-topics]').forEach(function (fs) {
    var target = $(fs.getAttribute('data-lp-topics'));
    function upd() {
      var c = $('input:checked', fs); if (!c || !target) return;
      target.setAttribute('data-wa-en', c.getAttribute('data-wa-en'));
      target.setAttribute('data-wa-ar', c.getAttribute('data-wa-ar'));
      render();
    }
    fs.addEventListener('change', upd); upd();
  });

  /* ---------- enquiry forms (hosted, team): record a lead when the booking API exists, always open a WhatsApp draft ---------- */
  var T = {
    req: { en: 'Please fill this in.', ar: 'يرجى تعبئة هذا الحقل.' },
    email: { en: 'Please check the email address.', ar: 'يرجى التأكد من البريد الإلكتروني.' },
    phone: { en: 'Please check the number (with the country code if outside Lebanon).', ar: 'يرجى التأكد من الرقم (مع رمز البلد إن كان خارج لبنان).' }
  };
  function fieldErr(input, key) {
    var box = input.closest('.lp-field'), out = box && $('.lp-field__err', box);
    input.setAttribute('aria-invalid', key ? 'true' : 'false');
    if (out) out.textContent = key ? T[key][lang] : '';
  }
  function label(form, name) {
    var el = form.elements[name]; if (!el) return '';
    if (el.tagName === 'SELECT') { var o = el.options[el.selectedIndex]; return o && el.value ? o.textContent.trim() : ''; }
    return (el.value || '').trim();
  }
  $$('form[data-lp-lead]').forEach(function (form) {
    var kind = form.getAttribute('data-lp-lead');
    form.setAttribute('novalidate', '');
    $$('input,select,textarea', form).forEach(function (el) { el.addEventListener('input', function () { if (el.getAttribute('aria-invalid') === 'true') fieldErr(el, null); }); });
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var bad = null;
      $$('[required]', form).forEach(function (el) {
        var v = (el.value || '').trim(), k = null;
        if (!v) k = 'req';
        else if (el.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) k = 'email';
        else if (el.type === 'tel' && v.replace(/\D/g, '').length < 7) k = 'phone';
        fieldErr(el, k); if (k && !bad) bad = el;
      });
      if (bad) { bad.focus(); return; }
      var ar = lang === 'ar', lines;
      if (kind === 'team') {
        lines = ar
          ? ['مرحباً دورينا، أودّ الاستفسار عن جلسة رفاه في العمل لفريقنا.', 'الاسم: ' + label(form, 'name'), 'الدور: ' + label(form, 'role'), 'الشركة: ' + label(form, 'org'), 'البريد: ' + label(form, 'email'), 'حجم الفريق: ' + label(form, 'size'), 'الشهر المفضّل: ' + label(form, 'month'), 'الجلسة: ' + label(form, 'session')] // AR: for native review
          : ['Hello Dorina, I would like to ask about a workplace wellbeing session for our team.', 'Name: ' + label(form, 'name'), 'Role: ' + label(form, 'role'), 'Company: ' + label(form, 'org'), 'Work email: ' + label(form, 'email'), 'Team size: ' + label(form, 'size'), 'Preferred month: ' + label(form, 'month'), 'Session: ' + label(form, 'session')];
      } else {
        lines = ar
          ? ['مرحباً دورينا، أودّ استضافة دائرة.', 'الاسم: ' + label(form, 'name'), 'الجهة: ' + label(form, 'org'), 'الهاتف: ' + label(form, 'phone'), 'الشهر المفضّل: ' + label(form, 'month'), 'عدد النساء: ' + label(form, 'size')] // AR: for native review
          : ['Hello Dorina, I would like to host a circle.', 'Name: ' + label(form, 'name'), 'Organisation: ' + label(form, 'org'), 'Phone: ' + label(form, 'phone'), 'Preferred month: ' + label(form, 'month'), 'Group size: ' + label(form, 'size')];
      }
      var href = waLink(lines.filter(function (l) { return !/:\s*$/.test(l); }).join('\n'));
      var w = null, noNumber = noWaNumber();
      /* no number yet: never open a recipient-less chat; the done state shows the placeholder instead */
      if (!noNumber) { try { w = window.open(href, '_blank', 'noopener'); } catch (err) {} }
      var again = $('[data-lp-wa-again]', form); if (again) { setHref(again, href); waPlaceholder(again, noNumber); }
      form.classList.add('is-done');
      var done = $('.lp-done', form); if (done) { done.setAttribute('tabindex', '-1'); done.focus({ preventScroll: true }); }
      var LB = window.LaunchBooking;
      if (LB && typeof LB.createLead === 'function') {
        try {
          Promise.resolve(LB.createLead({
            kind: kind, name: label(form, 'name'), org: label(form, 'org'), role: label(form, 'role'),
            phone: label(form, 'phone'), email: label(form, 'email'), size: form.elements.size ? form.elements.size.value : '',
            month: form.elements.month ? form.elements.month.value : '', offerId: form.elements.session ? form.elements.session.value : (kind === 'hosted' ? 'hosted-circle' : ''),
            source: src(), lang: lang
          })).catch(function () {});
        } catch (err) {}
      }
      void w;
    });
  });

  /* ---------- start ---------- */
  setLang(readLang(), false);
  if (window.LaunchBooking) loadSeats();
  else window.addEventListener('load', function () { if (window.LaunchBooking) loadSeats(); });
})();
