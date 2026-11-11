/* Dorina Launch Pack · pictures and motion (public pages and book/). No library.
   Everything here is an enhancement: without this file the pictures, the CSS entrances, the hours grid and the
   kit fan are all still there. Reads window.LAUNCH_CONFIG.pictures (assets/launch-config.js).
   The likeness gate: a generated picture of Dorina is shown only when pictures.dorinaAiApproved is true, and only
   for the names listed in pictures.dorinaAiShow. The gate fails closed: no list, or an empty list, shows nothing.
   On a local preview, ?preview=pictures shows them all for this tab (?preview=off puts the public state back).
   The public copy is built without those files. */
(function () {
  'use strict';
  var d = document, w = window, html = d.documentElement;
  var me = d.currentScript || d.querySelector('script[src*="launch-motion.js"]');
  var ROOT;
  try { ROOT = new URL('../', me && me.src ? me.src : location.href).href; } catch (e) { ROOT = './'; }
  var C = w.LAUNCH_CONFIG || {}, L = w.LAUNCH || null;
  function mq(s) { try { return w.matchMedia(s).matches; } catch (e) { return false; } }
  var RM = mq('(prefers-reduced-motion: reduce)');
  var FINE = mq('(hover: hover) and (pointer: fine)');
  var conn = navigator.connection || {};
  var LITE = !!conn.saveData || /(^|-)[23]g$/.test(conn.effectiveType || '');
  var hasIO = 'IntersectionObserver' in w;
  function wide() { return w.innerWidth >= 900; }
  function $(s, el) { return (el || d).querySelector(s); }
  function $$(s, el) { return Array.prototype.slice.call((el || d).querySelectorAll(s)); }
  function clamp(v) { return v < 0 ? 0 : v > 1 ? 1 : v; }
  function isAr() { return !!d.body && d.body.classList.contains('ar'); }
  function q(n) { try { return new URLSearchParams(location.search).get(n); } catch (e) { return null; } }
  function watch(el, fn) {
    if (!hasIO) { fn(true); return; }
    new IntersectionObserver(function (es) { fn(es[es.length - 1].isIntersecting); }).observe(el);
  }
  if (!RM) html.classList.add('lm-on');

  /* ---------- her likeness: proposals stay hidden until she says yes ---------- */
  var ALL = ['host', 'door', 'kit', 'portrait', 'hosted'];
  var P = C.pictures || {};
  function isLocal() {
    if (L && L.isLocalHost) return L.isLocalHost();
    try { return location.protocol === 'file:' || /^(localhost|127\.0\.0\.1|\[::1\])$/.test(location.hostname); } catch (e) { return false; }
  }
  var previewOn = false;
  if (isLocal()) {
    try {
      var pv = q('preview');
      if (pv === 'pictures') sessionStorage.setItem('dorinaPicPreview', '1');
      else if (pv === 'off') sessionStorage.setItem('dorinaPicPreview', '0');
      previewOn = sessionStorage.getItem('dorinaPicPreview') === '1';
    } catch (e) { previewOn = q('preview') === 'pictures'; }
  }
  var show = P.dorinaAiApproved === true ? (Array.isArray(P.dorinaAiShow) ? P.dorinaAiShow : []) : (previewOn ? ALL : []);
  function willSwap(el) {
    var s = el && el.closest ? el.closest('[data-dorina-slot]') : null;
    return !!s && show.indexOf(s.getAttribute('data-dorina-slot')) >= 0;
  }
  /* object-position that keeps her face inside the frame, whatever the shape of the slot */
  function facePos(box, sc) {
    var bw = box.clientWidth || 1, bh = box.clientHeight || 1, ia = sc.w / sc.h, ba = bw / bh, x = .5, y = .5, v;
    if (ia > ba) { v = ba / ia; x = clamp((sc.face[0] - v / 2) / (1 - v)); }
    else if (ia < ba) { v = ia / ba; y = clamp((sc.face[1] - v * .36) / (1 - v)); }
    return (x * 100).toFixed(1) + '% ' + (y * 100).toFixed(1) + '%';
  }
  function sceneSources(sc, sizes) {
    var s = d.createElement('source');
    s.type = 'image/webp'; s.sizes = sizes;
    s.srcset = sc.webp.map(function (f, i) { return ROOT + f + ' ' + sc.ws[i] + 'w'; }).join(', ');
    return s;
  }
  function swap(slot, sc) {
    var img = $('img', slot), pic = img && img.parentNode;
    if (!img && !slot.firstElementChild) { /* an empty placeholder: the picture is built only now, so the page carries no unfinished img tag */
      pic = d.createElement('picture'); img = d.createElement('img');
      img.className = 'lm-cover'; img.loading = 'lazy'; img.decoding = 'async';
      pic.appendChild(img); slot.appendChild(pic);
    }
    if (!img || !pic || pic.tagName !== 'PICTURE') return;
    var first = $('source', pic), sizes = (first && first.getAttribute('sizes')) || '100vw';
    var cur = $('.lm-curtain', slot);
    if (!RM) {
      if (!cur) { cur = d.createElement('span'); cur.className = 'lm-curtain'; cur.setAttribute('aria-hidden', 'true'); cur.innerHTML = '<i></i><i></i>'; slot.appendChild(cur); }
      cur.classList.add('lm-curtain--hold');
    }
    $$('source', pic).forEach(function (s) { pic.removeChild(s); });
    pic.insertBefore(sceneSources(sc, sizes), img);
    img.width = sc.w; img.height = sc.h;
    img.setAttribute('data-alt-en', sc.altEn); img.setAttribute('data-alt-ar', sc.altAr);
    img.alt = isAr() ? sc.altAr : sc.altEn;
    var fit = function () { img.style.setProperty('--pos', facePos(slot, sc)); };
    slot.hidden = false; if (slot.parentNode && slot.parentNode.hasAttribute('data-dorina-wrap')) slot.parentNode.hidden = false;
    fit(); w.addEventListener('resize', fit, { passive: true });
    slot.classList.add('is-dorina');
    var done = false, open = function () { if (done) return; done = true; if (cur) cur.classList.remove('lm-curtain--hold'); };
    img.addEventListener('load', open); img.addEventListener('error', open); setTimeout(open, 2600);
    img.src = ROOT + sc.jpg;
  }
  function sceneTile(sc) {
    var b = d.createElement('button');
    b.type = 'button'; b.className = 'lm-tile is-dorina'; b.style.setProperty('--ar', sc.w + '/' + sc.h);
    var pic = d.createElement('picture'), img = d.createElement('img'), chip = d.createElement('span');
    pic.appendChild(sceneSources(sc, '(min-width:900px) 380px, 66vw'));
    img.className = 'lm-cover'; img.width = sc.w; img.height = sc.h; img.loading = 'lazy'; img.decoding = 'async';
    img.setAttribute('data-alt-en', sc.altEn); img.setAttribute('data-alt-ar', sc.altAr); img.alt = isAr() ? sc.altAr : sc.altEn;
    img.src = ROOT + sc.jpg; pic.appendChild(img); b.appendChild(pic);
    chip.className = 'lm-tile__chip';
    chip.innerHTML = '<span data-en></span><span data-ar data-ar-new></span>';
    chip.firstChild.textContent = sc.chipEn; chip.lastChild.textContent = sc.chipAr;
    b.appendChild(chip);
    w.setTimeout(function () { img.style.setProperty('--pos', facePos(b, sc)); }, 60);
    return b;
  }
  function applyScenes() {
    var S = w.DORINA_SCENES || {};
    $$('[data-dorina-slot]').forEach(function (slot) {
      var k = slot.getAttribute('data-dorina-slot');
      if (show.indexOf(k) >= 0 && S[k]) swap(slot, S[k]);
    });
    $$('[data-dorina-add]').forEach(function (gal) {
      var cols = $$('.lm-gal__col', gal);
      gal.getAttribute('data-dorina-add').split(/\s+/).forEach(function (k, i) {
        if (show.indexOf(k) < 0 || !S[k] || !cols.length) return;
        cols[i % cols.length].appendChild(sceneTile(S[k]));
      });
    });
    if (previewOn && P.dorinaAiApproved !== true) {
      var r = d.createElement('p');
      r.className = 'lm-ribbon'; r.setAttribute('role', 'note');
      r.textContent = 'Preview on this computer: pictures of Dorina that wait for her approval. Not public. Add ?preview=off to see the public state.';
      d.body.appendChild(r);
    }
  }
  if (show.length && $('[data-dorina-slot],[data-dorina-add]')) {
    var sj = d.createElement('script');
    sj.src = ROOT + 'assets/pictures/dorina-scenes.js'; sj.onload = applyScenes;
    d.head.appendChild(sj);
  }

  /* ---------- one scroll reader: writes --p (0 to 1) on [data-progress] ---------- */
  var prog = $$('[data-progress]').map(function (el) { return { el: el, mode: el.getAttribute('data-progress'), fn: null, last: -1 }; });
  function onProgress(el, fn) { prog.forEach(function (o) { if (o.el === el) o.fn = fn; }); }
  var ticking = false;
  function readScroll() {
    ticking = false;
    var vh = w.innerHeight || 800;
    prog.forEach(function (o) {
      var r = o.el.getBoundingClientRect();
      if (r.bottom < -300 || r.top > vh + 300) return;
      var p = o.mode === 'exit' ? clamp(-r.top / (r.height || 1))
        : o.mode === 'pin' ? clamp(-r.top / Math.max(1, r.height - vh))
        : clamp((vh - r.top) / (vh + r.height));
      if (Math.abs(p - o.last) < .0005) return;
      o.last = p; o.el.style.setProperty('--p', p.toFixed(4));
      if (o.fn) o.fn(p);
    });
  }
  function askScroll() { if (!ticking) { ticking = true; requestAnimationFrame(readScroll); } }
  if (!RM && prog.length) {
    w.addEventListener('scroll', askScroll, { passive: true });
    w.addEventListener('resize', askScroll, { passive: true });
  }

  /* ---------- steam: a few soft particles over the teapot ---------- */
  var sprite = null;
  function steamSprite() {
    if (sprite) return sprite;
    var c = d.createElement('canvas'); c.width = c.height = 64;
    var g = c.getContext('2d'), gr = g.createRadialGradient(32, 32, 0, 32, 32, 32);
    gr.addColorStop(0, 'rgba(255,246,230,1)'); gr.addColorStop(.5, 'rgba(255,246,230,.36)'); gr.addColorStop(1, 'rgba(255,246,230,0)');
    g.fillStyle = gr; g.fillRect(0, 0, 64, 64);
    return (sprite = c);
  }
  function steam(cv, host) {
    var ctx = cv.getContext('2d'), W = cv.width = 120, H = cv.height = 190, ps = [], t = 0, raf = 0, sp = steamSprite();
    function tick() {
      raf = requestAnimationFrame(tick);
      if ((++t & 1) || d.hidden) return;
      ctx.clearRect(0, 0, W, H);
      if (ps.length < 22 && Math.random() < .3) ps.push({ x: W / 2 + (Math.random() - .5) * 10, y: H - 10, r: 7 + Math.random() * 5, vy: .5 + Math.random() * .5, s: Math.random() * 6.28, a: 0, m: 150 + Math.random() * 90 });
      for (var i = ps.length; i--;) {
        var p = ps[i]; p.a++; p.y -= p.vy; p.x += Math.sin(p.s + p.a / 22) * .45; p.r += .11;
        if (p.a > p.m) { ps.splice(i, 1); continue; }
        ctx.globalAlpha = Math.sin(Math.PI * p.a / p.m) * .22;
        ctx.drawImage(sp, p.x - p.r, p.y - p.r, p.r * 2, p.r * 2);
      }
    }
    watch(host, function (on) {
      if (on && !raf) raf = requestAnimationFrame(tick);
      else if (!on && raf) { cancelAnimationFrame(raf); raf = 0; }
    });
  }
  /* where a point of the picture lands inside its object-fit: cover box */
  function coverPoint(box, img, pt) {
    var bw = box.clientWidth, bh = box.clientHeight, nw = img.naturalWidth, nh = img.naturalHeight;
    if (!nw || !bw) return null;
    var s = Math.max(bw / nw, bh / nh), dw = nw * s, dh = nh * s, op = (getComputedStyle(img).objectPosition || '50% 50%').split(' ');
    var px = parseFloat(op[0]) / 100, py = parseFloat(op[1]) / 100;
    if (isNaN(px)) px = .5; if (isNaN(py)) py = .5;
    return [(bw - dw) * px + pt[0] * dw, (bh - dh) * py + pt[1] * dh];
  }
  function placeSteam(cv, box, img) {
    var tall = img.naturalHeight > img.naturalWidth;
    var raw = (tall && cv.getAttribute('data-at-sm')) || cv.getAttribute('data-at');
    if (!raw) return false;
    var pt = coverPoint(box, img, raw.split(',').map(Number));
    if (!pt) return false;
    cv.style.left = (pt[0] - 60) + 'px'; cv.style.top = (pt[1] - 182) + 'px';
    cv.classList.add('is-set');
    return true;
  }

  /* ---------- hero pictures: the picture opens as soon as it is decoded, then depth and the one clip.
     Phones get the clip too (a tall cut of the same room). Reduced motion and data saver get the still picture.
     The steam canvas is only the fallback, for a browser that will not play the clip. ---------- */
  $$('.lm-hero-pic').forEach(function (hp) {
    var img = $('img', hp), push = $('.lm-push', hp), sec = hp.closest('section') || hp, once = false, woke = false;
    if (!img) return;
    function steamOn() {
      var cv = $('.lm-steam', hp);
      if (!cv || cv.classList.contains('is-set')) return;
      var fit = function () { return placeSteam(cv, hp, img); };
      if (fit()) { steam(cv, sec); w.addEventListener('resize', fit, { passive: true }); }
    }
    function wake() { /* runs once the picture itself is on screen */
      if (woke) return; woke = true;
      if (RM || LITE || willSwap(hp)) return;
      var near = $('.lm-near', hp), big = wide(), clip = null;
      if (near && FINE && big) { near.style.backgroundImage = 'url("' + (img.currentSrc || img.src) + '")'; near.classList.add('is-set'); }
      $$('video', hp).forEach(function (v) { var m = v.getAttribute('data-lm-when'); if (!clip && (!m || (m === 'sm') === !big)) clip = v; });
      if (!clip) { steamOn(); return; }
      var settled = false, asked = false, t0 = Date.now();
      var fail = function () { if (settled) return; settled = true; steamOn(); };
      var start = function () {
        if (settled || asked) return;
        var early = 1300 - (Date.now() - t0); /* let the picture finish opening first */
        if (early > 0) { setTimeout(start, early); return; }
        asked = true;
        try { var pr = clip.play(); if (pr && pr.catch) pr.catch(fail); } catch (e) { fail(); }
      };
      clip.addEventListener('playing', function () {
        settled = true; clip.classList.add('is-on');
        var cv = $('.lm-steam', hp); if (cv) cv.classList.remove('is-set'); /* a late clip replaces the steam fallback */
      }, { once: true });
      clip.addEventListener('error', fail);
      var srcs = $$('source', clip); if (srcs.length) srcs[srcs.length - 1].addEventListener('error', fail);
      clip.addEventListener('canplaythrough', start, { once: true });
      setTimeout(start, 2600);  /* some phones only report "can play" after play() is asked for */
      setTimeout(function () { if (!settled) fail(); }, 12000);
      try { clip.preload = 'auto'; clip.load(); } catch (e) { fail(); }
    }
    function ready() {
      if (!once) { once = true; if (push) push.classList.remove('lm-wait'); }
      if (img.complete && img.naturalWidth) wake();
    }
    if (img.complete && img.naturalWidth) ready();
    else {
      if (push && !RM) push.classList.add('lm-wait');
      img.addEventListener('load', ready); img.addEventListener('error', ready);
      if (img.decode) { try { img.decode().then(ready, function () {}); } catch (e) {} }
      setTimeout(ready, 1200);
    }
  });
  if (FINE && !RM) {
    $$('.lm-hero').forEach(function (hs) {
      var tx = 0, ty = 0, cx = 0, cy = 0, run = 0;
      function ease() {
        cx += (tx - cx) * .06; cy += (ty - cy) * .06;
        hs.style.setProperty('--mx', cx.toFixed(3)); hs.style.setProperty('--my', cy.toFixed(3));
        run = Math.abs(tx - cx) + Math.abs(ty - cy) > .003 ? requestAnimationFrame(ease) : 0;
      }
      hs.addEventListener('pointermove', function (e) {
        var r = hs.getBoundingClientRect();
        tx = (e.clientX - r.left) / r.width * 2 - 1; ty = (e.clientY - r.top) / r.height * 2 - 1;
        if (!run) run = requestAnimationFrame(ease);
      });
    });
  }

  /* ---------- three doors: a room behind a doorway ---------- */
  if (FINE && !RM) {
    $$('[data-lm-door]').forEach(function (a) {
      a.addEventListener('pointerenter', function () { a.classList.add('lm-tilted'); });
      a.addEventListener('pointermove', function (e) {
        if ($('.is-dorina', a)) return; /* her picture is never tilted */
        var r = a.getBoundingClientRect(), x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height;
        a.style.setProperty('--tx', (x * 2 - 1).toFixed(3)); a.style.setProperty('--ty', (y * 2 - 1).toFixed(3));
        a.style.setProperty('--lx', (x * 100).toFixed(1) + '%'); a.style.setProperty('--ly', (y * 100).toFixed(1) + '%');
        a.classList.add('is-tilt');
      });
      a.addEventListener('pointerleave', function () {
        a.classList.remove('is-tilt'); a.style.setProperty('--tx', 0); a.style.setProperty('--ty', 0);
      });
    });
  }

  /* ---------- three hours on the ring ---------- */
  $$('[data-lm-hours]').forEach(function (hs) {
    var list = $('.lm-hours__list', hs), items = $$('.lm-hour', hs), n = items.length;
    var track = $('.h-track', hs), fill = $('.h-fill', hs), dot = $('.h-dot', hs), time = $('[data-lm-time]', hs), dots = $$('.lm-hours__dots i', hs);
    var cur = 0, len = 0, steps = hs.getAttribute('data-lm-hours') === 'steps';
    if (RM || !n) return;
    try { len = track.getTotalLength(); } catch (e) {}
    /* i: the step shown; f: how far through it (the clock counts while a step is pinned); a: place of the dot on the ring */
    function set(i, f, a) {
      a = .03 + .94 * a;
      if (fill) fill.style.strokeDashoffset = (100 - a * 100).toFixed(2);
      if (dot && len) { var pt = track.getPointAtLength(len * a); dot.setAttribute('cx', pt.x.toFixed(2)); dot.setAttribute('cy', pt.y.toFixed(2)); }
      if (time && steps) time.innerHTML = '<bdi dir="ltr">0' + (i + 1) + '</bdi>';
      else if (time) {
        var m = i === 0 ? f * 15 : i === 1 ? 15 + f * 135 : i === 2 ? 150 + f * 30 : -1;
        time.innerHTML = m < 0
          ? '<bdi dir="ltr">+7</bdi> <small>' + (isAr() ? 'أيام' : 'days') + '</small>' // AR: for native review
          : '<bdi dir="ltr">' + Math.floor(m / 60) + ':' + ('0' + Math.floor(m % 60)).slice(-2) + '</bdi>';
      }
      if (i !== cur) {
        items.forEach(function (it, k) { it.classList.toggle('is-prev', k === cur); it.classList.toggle('is-active', k === i); });
        cur = i;
      }
      dots.forEach(function (x, k) { x.classList.toggle('is-on', k === i); });
    }
    onProgress(hs, function (p) {
      if (!wide()) return;
      var i = Math.min(n - 1, Math.floor(p * n + .0001));
      set(i, p * n - i, p);
    });
    if (list) {
      list.addEventListener('scroll', function () {
        if (wide()) return;
        var max = list.scrollWidth - list.clientWidth;
        if (max <= 0) return;
        var x = clamp(Math.abs(list.scrollLeft) / max);
        set(Math.round(x * (n - 1)), 0, x);
      }, { passive: true });
      if (hasIO) {
        var hio = new IntersectionObserver(function (es) {
          if (es[0].isIntersecting && !wide()) { list.classList.add('is-hint'); hio.disconnect(); }
        }, { threshold: .6 });
        hio.observe(list);
      }
    }
    set(0, 0, 0);
  });

  /* ---------- the kit: dealt, then picked up ---------- */
  $$('[data-lm-kit]').forEach(function (kit) {
    var lis = $$('.lm-kit__cards li', kit), btns = lis.map(function (li) { return $('.lm-sheet', li); });
    function cur() { for (var k = 0; k < lis.length; k++) if (lis[k].classList.contains('is-up')) return k; return -1; }
    function up(i) {
      lis.forEach(function (li, k) { li.classList.toggle('is-up', k === i); btns[k].setAttribute('aria-expanded', k === i ? 'true' : 'false'); });
      kit.classList.toggle('has-up', i >= 0);
    }
    btns.forEach(function (b, i) {
      b.setAttribute('aria-expanded', 'false');
      b.addEventListener('click', function (e) { e.stopPropagation(); up(cur() === i ? -1 : i); });
    });
    kit.addEventListener('click', function () { if (cur() >= 0) up(-1); });
    d.addEventListener('click', function (e) { if (cur() >= 0 && !kit.contains(e.target)) up(-1); });
    kit.addEventListener('keydown', function (e) {
      var c = cur(), f = btns.indexOf(d.activeElement);
      if (e.key === 'Escape' && c >= 0) { up(-1); btns[c].focus(); }
      else if ((e.key === 'ArrowRight' || e.key === 'ArrowLeft') && f >= 0) {
        var to = (f + (e.key === 'ArrowRight' ? 1 : -1) + btns.length) % btns.length;
        btns[to].focus(); if (c >= 0) up(to); e.preventDefault();
      }
    });
    if (RM || !hasIO) { kit.classList.add('is-dealt'); return; }
    var kio = new IntersectionObserver(function (es) {
      if (es[0].isIntersecting) { kit.classList.add('is-dealt'); kio.disconnect(); }
    }, { threshold: .4 });
    kio.observe(kit);
    setTimeout(function () { var r = kit.getBoundingClientRect(); if (r.top < (w.innerHeight || 800) && r.bottom > 0) kit.classList.add('is-dealt'); }, 1200);
  });

  /* ---------- gallery: a tile opens large ---------- */
  var box = null, boxImg, boxCap, tiles = [], at = -1, lastTile = null;
  function largest(tile) {
    var s = $('source', tile), set = s && s.getAttribute('srcset'), im = $('img', tile);
    if (!set) return im.getAttribute('src');
    var parts = set.split(',');
    return parts[parts.length - 1].trim().split(/\s+/)[0];
  }
  function showAt(i) {
    if (!tiles.length) return;
    at = (i + tiles.length) % tiles.length;
    var im = $('img', tiles[at]);
    boxImg.onerror = function () { boxImg.onerror = null; boxImg.src = im.src; };
    boxImg.src = largest(tiles[at]); boxImg.alt = im.alt; boxCap.textContent = im.alt;
  }
  function buildBox() {
    box = d.createElement('dialog'); box.className = 'lm-box';
    box.innerHTML = '<div class="lm-box__in"><img alt=""><p class="lm-box__cap"></p></div>' +
      '<button type="button" class="lm-box__b lm-box__x" data-x>&#215;</button>' +
      '<button type="button" class="lm-box__b lm-box__p" data-p>&#8249;</button>' +
      '<button type="button" class="lm-box__b lm-box__n" data-n>&#8250;</button>';
    d.body.appendChild(box);
    boxImg = $('img', box); boxCap = $('.lm-box__cap', box);
    var x0 = null;
    box.addEventListener('click', function (e) {
      var t = e.target;
      if (t.hasAttribute('data-p')) showAt(at - 1); else if (t.hasAttribute('data-n')) showAt(at + 1); else if (t !== boxImg) box.close();
    });
    box.addEventListener('keydown', function (e) {
      var s = isAr() ? -1 : 1;
      if (e.key === 'ArrowRight') showAt(at + s); else if (e.key === 'ArrowLeft') showAt(at - s);
    });
    box.addEventListener('pointerdown', function (e) { x0 = e.clientX; });
    box.addEventListener('pointerup', function (e) {
      if (x0 == null) return;
      var dx = e.clientX - x0; x0 = null;
      if (Math.abs(dx) > 44) showAt(at + (dx < 0 ? 1 : -1) * (isAr() ? -1 : 1));
    });
    box.addEventListener('close', function () { if (lastTile) lastTile.focus(); });
  }
  function openTile(tile) {
    if (!box) buildBox();
    var ar = isAr(); // AR: for native review
    $('[data-x]', box).setAttribute('aria-label', ar ? 'إغلاق' : 'Close');
    $('[data-p]', box).setAttribute('aria-label', ar ? 'الصورة السابقة' : 'Previous picture');
    $('[data-n]', box).setAttribute('aria-label', ar ? 'الصورة التالية' : 'Next picture');
    tiles = $$('.lm-tile', tile.closest('[data-lm-gal]')); lastTile = tile;
    var im = $('img', tile), go = function () { im.style.viewTransitionName = ''; showAt(tiles.indexOf(tile)); if (!box.open) box.showModal(); };
    if (d.startViewTransition && !RM) { im.style.viewTransitionName = 'lm-zoom'; d.startViewTransition(go); } else go();
  }
  if (w.HTMLDialogElement) {
    $$('[data-lm-gal]').forEach(function (g) {
      g.addEventListener('click', function (e) { var t = e.target.closest('.lm-tile'); if (t && g.contains(t)) openTile(t); });
    });
  }

  /* ---------- the short clips: play once, rest on the last frame ---------- */
  if (!RM && !LITE && hasIO) {
    var vio = new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        if (!e.isIntersecting) return;
        var v = e.target; vio.unobserve(v);
        v.addEventListener('playing', function () { v.classList.add('is-on'); }, { once: true });
        try { var pr = v.play(); if (pr && pr.catch) pr.catch(function () {}); } catch (err) {}
      });
    }, { threshold: .55 });
    $$('video[data-lm-clip]').forEach(function (v) { if (!willSwap(v)) vio.observe(v); });
  }

  /* ---------- booking: the ticket on the table carries her first name (read from the field, stored nowhere) ---------- */
  var seat = $('[data-lm-seat]');
  if (seat) {
    var sd = $('[data-lm-seat-date]', seat), sn = $('[data-lm-seat-name]', seat);
    var seatDate = function (lang) {
      if (!sd || !L) return;
      var offer = q('offer'), id = q('session'), s = null;
      if (offer !== 'next-circle-list') s = (id && L.session(id)) || L.nextSession(offer || 'wpc-founding') || L.nextSession('wpc-founding');
      sd.textContent = s ? L.formatDate(s.startsAt, lang || (isAr() ? 'ar' : 'en'), { short: true }) : '';
    };
    seatDate();
    d.addEventListener('dorina:lang', function (e) { seatDate(e && e.detail && e.detail.lang); });
    d.addEventListener('input', function (e) {
      var t = e.target;
      if (!t || t.name !== 'name' || !sn) return;
      var first = (t.value || '').trim().split(/\s+/)[0].slice(0, 16);
      sn.textContent = first; seat.classList.toggle('has-name', !!first);
    });
    d.addEventListener('change', function (e) {
      var t = e.target;
      if (t && t.name === 'seats') seat.classList.toggle('is-two', String(t.value) === '2');
    });
  }

  if (!RM) askScroll();
})();
