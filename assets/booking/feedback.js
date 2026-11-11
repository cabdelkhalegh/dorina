/* Dorina Launch Pack · book/feedback/: two-minute feedback at the close of a circle (opened by QR, ?s=<session>).
   Anonymous by default. Talks only to window.LaunchBooking. Launch Pack · Al Kentawi */
(function () {
  'use strict';
  var L = window.LAUNCH, B = window.LaunchBooking, C = window.BookingCore;
  var f = document.getElementById('fb-form');
  if (!L || !B || !f) return;
  var lang = L.applyLang(L.lang(), true);
  var sid = new URLSearchParams(location.search).get('s');
  if (sid && !/^[a-z0-9-]{3,80}$/.test(sid)) sid = null;
  function tt(en, ar) { return lang === 'ar' ? ar : en; } // AR: for native review
  /* Without live data, a public visitor's feedback would stay in her own browser. Then the form sends it to Dorina on
     WhatsApp instead (nothing stored); the demo store runs only on a local preview. */
  var viaWa = !(L.liveData && L.liveData()) && !(L.isLocalHost && L.isLocalHost());
  var fw = document.getElementById('bk-footer-wa'); if (fw) fw.href = L.waLink(lang === 'ar' ? 'مرحباً دورينا' : 'Hello Dorina');
  var ft = document.querySelector('.bk-footer');
  if (ft && 'IntersectionObserver' in window) new IntersectionObserver(function (en) { ft.classList.toggle('is-on', en[0].isIntersecting); }).observe(ft);
  function waText() {
    var lines = [tt('Feedback for Dorina', 'رأيي لدورينا') + (sid ? ' (' + sid + ')' : ''), tt('Rating', 'التقييم') + ': ' + f.rating.value + '/5'];
    if (f.helped.value.trim()) lines.push(tt('What helped', 'شو ساعدني') + ': ' + f.helped.value.trim());
    if (f.change.value.trim()) lines.push(tt('What I would change', 'شو بغيّر') + ': ' + f.change.value.trim());
    lines.push(tt('Quote', 'الاقتباس') + ': ' + (f.quote.value === 'first_name' ? tt('yes, with my first name', 'إيه، مع اسمي الأول') + (f.name.value.trim() ? ' (' + f.name.value.trim() + ')' : '') : f.quote.value === 'anonymous' ? tt('yes, anonymously', 'إيه، بلا اسم') : tt('no', 'لأ')));
    if (f.team.checked) lines.push(tt('I would like this for my team', 'بحبّ هالشي لفريق شغلي') + (f.workEmail.value.trim() ? ': ' + f.workEmail.value.trim() : ''));
    if (f.next.checked) lines.push(tt('Tell me the next date', 'خبّريني بالموعد الجاي'));
    return lines.join('\n');
  }
  (viaWa ? Promise.resolve('whatsapp') : B.ready).then(function (mode) {
    if (mode === 'demo') document.getElementById('bk-ribbon').hidden = false;
    if (viaWa) { var g = document.querySelector('#fb-go > span'); if (g) g.innerHTML = '<span data-en>Send to Dorina on WhatsApp</span><span data-ar data-ar-new>ابعتيه لدورينا على واتساب</span>'; }
    var s = sid ? (L.session(sid) || null) : null;
    if (sid && !s) return B.getSession(sid).then(function (x) { s = x; return s; });
    return s;
  }).then(function (s) {
    var k = document.getElementById('fb-session');
    if (s) k.textContent = L.offerName(s.offerId, lang) + ' · ' + L.formatDate(s.startsAt, lang);
  }, function () {});
  function toggle() {
    document.getElementById('fb-namewrap').hidden = !(f.quote.value === 'first_name');
    document.getElementById('fb-emailwrap').hidden = !f.team.checked;
  }
  f.addEventListener('change', toggle);
  document.addEventListener('click', function (e) {
    if (e.target.closest && e.target.closest('[data-lang]')) lang = L.applyLang(lang === 'ar' ? 'en' : 'ar');
  });
  document.addEventListener('dorina:lang', function (e) { lang = e.detail.lang; });
  var busy = false;
  f.addEventListener('submit', function (e) {
    e.preventDefault();
    if (busy) return;
    var err = document.getElementById('fb-err');
    var r = f.rating.value;
    if (!r) { err.textContent = tt('Choose a rating from 1 to 5.', 'اختاري تقييم من 1 لـ 5.'); return; }
    if (viaWa) { window.open(L.waLink(waText()), '_blank', 'noopener'); return; }
    busy = true; var btn = document.getElementById('fb-go'); btn.setAttribute('aria-busy', 'true');
    B.submitFeedback({ sessionId: sid, rating: Number(r), helped: f.helped.value.trim(), change: f.change.value.trim(), quotePermission: f.quote.value,
      name: f.quote.value === 'first_name' ? f.name.value.trim() : null, teamInterest: f.team.checked, workEmail: f.team.checked ? f.workEmail.value.trim() : null,
      nextDateInterest: f.next.checked })
      .then(function () {
        var v = document.getElementById('fb-view');
        v.innerHTML = '<div class="bk-step bk-done is-in-fwd"><div class="bk-mark" aria-hidden="true"><svg viewBox="0 0 100 100"><path class="bk-mark__ring" pathLength="100" d="M 79.14 32.49 A 34 34 0 1 1 62.18 18.25"/><circle class="bk-mark__rip" cx="71.86" cy="23.96" r="6"/><circle class="bk-mark__dot" cx="71.86" cy="23.96" r="6"/></svg></div>' +
          '<h2 class="bk-step__h" tabindex="-1">' + tt('Thank you', 'شكراً') + '</h2><p class="bk-step__sub">' +
          tt('Dorina reads every one.', 'دورينا بتقرا كل رأي.') + (f.next.checked ? ' ' + tt('Join the list below and the next date reaches you first.', 'انضمّي للقائمة تحت وبيوصلك الموعد الجاي أوّل.') : '') + '</p>' +
          '<div class="bk-done__cta"><a class="bk-btn bk-btn--primary bk-btn--block" href="../?offer=next-circle-list&src=closing">' + tt('Join the Next Circle list', 'انضمّي لقائمة الدائرة الجاية') + '</a></div></div>';
        var d = v.querySelector('.bk-done'); requestAnimationFrame(function () { d.classList.add('is-playing'); });
        v.querySelector('h2').focus();
      }, function (er) {
        err.textContent = er && er.code === 'rate_limited' ? tt('Too many tries. Wait a few minutes.', 'محاولات كتير. استنّي شوي.') : tt('The connection dropped and nothing was saved. Try again.', 'انقطع الاتصال وما انحفظ شي. جرّبي مرّة تانية.');
      })
      .then(function () { busy = false; btn.removeAttribute('aria-busy'); });
  });
})();
