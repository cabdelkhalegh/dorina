/* Dorina Launch Pack · demo store.
   Everything lives in this browser only (localStorage key dorinaBooking.v1; in memory if storage is blocked).
   Seeded with the config sessions plus example sessions and bookings, every example flagged example:true.
   Same rules as the database: booking-core.js decides capacity, waitlist, holds and slots.
   Launch Pack · Al Kentawi */
(function () {
  'use strict';
  var KEY = 'dorinaBooking.v1';
  var Core = window.BookingCore;
  var CFG = window.LAUNCH_CONFIG || {};
  var H = 3600000;
  var mem = null;

  function now() { return Date.now(); }
  function iso(t) { return new Date(t).toISOString(); }
  function uid(p) { return (p || 'x') + '-' + Math.random().toString(36).slice(2, 9); }
  function clone(o) { return JSON.parse(JSON.stringify(o)); }
  function wait(msDelay) { return new Promise(function (r) { setTimeout(r, msDelay); }); }
  function err(code, extra) { var e = new Error(code); e.code = code; if (extra) for (var k in extra) e[k] = extra[k]; return e; }

  function read() {
    if (mem) return mem;
    try { var raw = localStorage.getItem(KEY); if (raw) { mem = JSON.parse(raw); if (mem && mem.v === 1) return mem; } } catch (e) {}
    mem = seed();
    write();
    return mem;
  }
  function write() { try { localStorage.setItem(KEY, JSON.stringify(mem)); } catch (e) { /* memory only */ } }

  function settingsFromConfig() {
    var h = CFG.holds || {};
    return { holdHours: h.holdHours || 48, reminderAtHours: h.reminderAtHours || 40, waitlistOfferHours: h.waitlistOfferHours || 24,
      publicSeatsLeft: !!CFG.showSeatsLeft, bookingsOpen: true, adminLang: 'en' };
  }

  function seed() {
    var t = now();
    var s = { v: 1, seededAt: iso(t), sessions: [], people: [], bookings: [], listMembers: [], leads: [], feedback: [],
      settings: settingsFromConfig(), timeOff: [], ticks: {}, manual: {}, log: [] };
    (CFG.sessions || []).forEach(function (cs) {
      var x = clone(cs);
      if (x.status === 'open' && x.opensAt && Date.parse(x.opensAt) > t) {
        x.previewNote = 'Opens to the public ' + x.opensAt + '; opened now in the preview so the flow can be tried.';
        x.opensAt = iso(t - 60000);
      }
      s.sessions.push(x);
    });
    function day(offset, hourUtc, mins) {
      var d = new Date(t + offset * 24 * H); d.setUTCHours(hourUtc, mins || 0, 0, 0); return d.getTime();
    }
    var full = { id: 'example-small-circle', offerId: 'wpc-founding', example: true, startsAt: iso(day(12, 15)), endsAt: iso(day(12, 18)),
      timeConfirmed: true, areaEn: 'Example area', areaAr: 'منطقة للمثال', online: false, capacity: 4, minToRun: 3, priceUsd: 40, pairPriceUsd: 75,
      currency: 'USD', status: 'open', opensAt: iso(t - 5 * 24 * H), priorityUntil: null, decisionAt: iso(day(9, 16)), closesAt: iso(day(10, 10)), fallbackDate: null };
    var online = { id: 'example-online-evening', offerId: 'wpc-online', example: true, startsAt: iso(day(19, 16, 30)), endsAt: iso(day(19, 18)),
      timeConfirmed: true, areaEn: 'Online', areaAr: 'أونلاين', online: true, capacity: 16, minToRun: 6, priceUsd: 30, pairPriceUsd: null,
      currency: 'USD', status: 'open', opensAt: iso(t - 2 * 24 * H), priorityUntil: null, decisionAt: iso(day(17, 10)), closesAt: iso(day(18, 10)), fallbackDate: null };
    var past = { id: 'example-past-circle', offerId: 'wpc-founding', example: true, startsAt: iso(day(-20, 8)), endsAt: iso(day(-20, 11)),
      timeConfirmed: true, areaEn: 'Example area', areaAr: 'منطقة للمثال', online: false, capacity: 15, minToRun: 8, priceUsd: 40, pairPriceUsd: 75,
      currency: 'USD', status: 'done', opensAt: iso(day(-40, 7)), priorityUntil: null, decisionAt: iso(day(-26, 16)), closesAt: iso(day(-22, 10)), fallbackDate: null };
    s.sessions.push(full, online, past);

    var founding = 'wpc-founding-20261205';
    var ex = [
      // name, phone, session, status, seats, hoursAgo, extra
      ['Rima (example)', '+96199000101', founding, 'pending', 1, 3, { source: 'poster', whoTold: 'poster' }],
      ['Maya (example)', '+96199000102', founding, 'pending', 1, 41, { source: 'wa', whoTold: 'whatsapp' }],
      ['Nour (example)', '+96199000103', founding, 'pending', 1, 50, { source: 'web' }],
      ['Lara (example)', '+96199000104', founding, 'paid', 2, 30, { guestName: 'Joelle', source: 'referral', whoTold: 'friend', paymentMethod: 'whish', amount: 75, paidAt: 20 }],
      ['Sana (example)', '+96199000105', founding, 'paid', 1, 70, { source: 'ig', whoTold: 'instagram', paymentMethod: 'cash', amount: 40, paidAt: 60 }],
      ['Hala (example)', '+96199000106', founding, 'released', 1, 90, { source: 'story' }],
      ['Dana (example)', '+96199000107', full.id, 'paid', 2, 60, { guestName: 'Tala', paymentMethod: 'omt', amount: 75, paidAt: 50, source: 'connector' }],
      ['Yara (example)', '+96199000108', full.id, 'pending', 2, 10, { guestName: 'Ghada', source: 'post' }],
      ['Carla (example)', '+96199000109', full.id, 'waitlist', 1, 6, { source: 'status' }],
      ['Mira (example)', '+96199000110', past.id, 'attended', 1, 600, { paymentMethod: 'whish', amount: 40, paidAt: 590, source: 'web' }],
      ['Zeina (example)', '+96199000111', past.id, 'no_show', 1, 610, { paymentMethod: 'cash', amount: 40, paidAt: 580, source: 'poster' }]
    ];
    var refs = [];
    ex.forEach(function (r) {
      var person = upsertPerson(s, { name: r[0], phone: r[1], lang: 'en', source: r[5].source || 'web', example: true });
      var sess = s.sessions.filter(function (x) { return x.id === r[2]; })[0];
      var offer = offerOf(sess);
      var created = t - r[5] * H;
      var e = r[6];
      var price = Core.priceFor(sess, offer, r[4]);
      var b = { id: uid('b'), ref: Core.makeRef(offer ? offer.refPrefix : 'WPC', refs), sessionId: sess.id, personId: person.id, phone: person.phone,
        name: person.name, email: null, seats: r[4], guestName: e.guestName || null, status: r[3], createdAt: iso(created),
        statusChangedAt: iso(created), holdStartedAt: iso(created), heldUntil: r[3] === 'waitlist' ? null : iso(created + s.settings.holdHours * H),
        paymentMethod: e.paymentMethod || null, amount: e.amount != null ? e.amount : price.amount, currency: price.currency,
        paidAt: e.paidAt != null ? iso(t - e.paidAt * H) : null, source: e.source || 'web', via: null, whoTold: e.whoTold || null, lang: 'en', example: true };
      refs.push(b.ref);
      if (r[3] === 'attended') person.flags.alumni = true;
      if (r[3] === 'waitlist') person.flags.waitlist = true;
      s.bookings.push(b);
    });
    [['Aya (example)', '+96199000121', 'closing', null], ['Rana (example)', '+96199000122', 'card', 'consultation'], ['Leila (example)', '+96199000123', 'ig', 'online']]
      .forEach(function (l, i) {
        var p = upsertPerson(s, { name: l[0], phone: l[1], lang: 'en', source: l[2], example: true });
        p.flags.list = true;
        s.listMembers.push({ id: uid('l'), personId: p.id, name: p.name, phone: p.phone, joinedAt: iso(t - (5 + i * 3) * 24 * H), source: l[2], interest: l[3], leftAt: null, example: true });
      });
    s.leads.push({ id: uid('ld'), kind: 'hosted', name: 'Example host', org: 'Example studio', role: 'Owner', phone: '+96199000131', email: null, size: '12', month: 'February',
      offerId: 'hosted-circle', stage: 'talking', nextAction: 'Send the one-pager', nextDate: iso(t + 2 * 24 * H).slice(0, 10), source: 'connector', createdAt: iso(t - 3 * 24 * H), example: true });
    s.leads.push({ id: uid('ld'), kind: 'team', name: 'Example manager', org: 'Example company', role: 'People lead', phone: null, email: 'team@example.invalid', size: '20', month: 'March',
      offerId: 'desk-team-session', stage: 'new', nextAction: 'Reply with S28 (before G10)', nextDate: null, source: 'feedback', createdAt: iso(t - 24 * H), example: true });
    s.feedback.push({ id: uid('f'), sessionId: past.id, rating: 5, helped: 'Naming the feeling before replying.', change: 'A longer break.', quotePermission: 'first_name',
      quoteText: 'Example quote text: shown only after a written yes.', name: 'Mira (example)', teamInterest: true, workEmail: 'team@example.invalid', nextDateInterest: true, createdAt: iso(t - 19 * 24 * H), example: true });
    s.feedback.push({ id: uid('f'), sessionId: past.id, rating: 4, helped: 'The Bad-Day Card.', change: '', quotePermission: 'no', quoteText: null, name: null,
      teamInterest: false, workEmail: null, nextDateInterest: true, createdAt: iso(t - 19 * 24 * H), example: true });
    s.timeOff.push({ id: uid('t'), startsAt: iso(day(3, 6)), endsAt: iso(day(3, 15)), reason: 'Example: day job', example: true });
    return s;
  }

  function offerOf(sess) {
    var id = sess && sess.offerId;
    var o = CFG.offers || [];
    for (var i = 0; i < o.length; i++) if (o[i].id === id) return o[i];
    return null;
  }
  function upsertPerson(s, d) {
    var p = Core.findPerson(s.people, d.phone);
    if (p) {
      if (!p.email && d.email) p.email = d.email;
      return p;
    }
    p = { id: uid('p'), phone: d.phone, name: d.name, email: d.email || null, lang: d.lang || 'en', firstSource: d.source || 'web',
      flags: { alumni: false, list: false, waitlist: false, teamInterest: false }, notes: '', createdAt: iso(now()) };
    if (d.example) p.example = true;
    s.people.push(p);
    return p;
  }
  function sessionById(s, id) { return s.sessions.filter(function (x) { return x.id === id; })[0] || null; }
  function publicSession(s, x) {
    var left = Core.seatsLeft(x, s.bookings);
    return { id: x.id, offerId: x.offerId, startsAt: x.startsAt, endsAt: x.endsAt, timeConfirmed: x.timeConfirmed, areaEn: x.areaEn, areaAr: x.areaAr,
      online: x.online, capacity: x.capacity, priceUsd: x.priceUsd, pairPriceUsd: x.pairPriceUsd, currency: x.currency, status: x.status,
      opensAt: x.opensAt, priorityUntil: x.priorityUntil, closesAt: x.closesAt, example: !!x.example,
      state: s.settings.bookingsOpen === false && Core.sessionState(x, s.bookings) === 'open' ? 'closed' : Core.sessionState(x, s.bookings),
      seatsLeft: s.settings.publicSeatsLeft ? left : null };
  }
  function rateLimited(s, phone) {
    var since = now() - 10 * 60000;
    var n = s.log.filter(function (l) { return l.phone === phone && Date.parse(l.at) > since; }).length;
    s.log.push({ phone: phone, at: iso(now()) });
    if (s.log.length > 200) s.log = s.log.slice(-200);
    return n >= 6;
  }

  /* ---------- public interface ---------- */
  var api = {
    mode: 'demo',
    listSessions: function (q) {
      q = q || {};
      var s = read();
      return wait(120).then(function () {
        return s.sessions.filter(function (x) { return !q.offerId || x.offerId === q.offerId; })
          .filter(function (x) { return x.status !== 'draft' || x.opensAt; })
          .sort(function (a, b) { return Date.parse(a.startsAt) - Date.parse(b.startsAt); })
          .map(function (x) { return publicSession(s, x); });
      });
    },
    getSession: function (id) {
      var s = read(); var x = sessionById(s, id);
      return wait(80).then(function () { return x ? publicSession(s, x) : null; });
    },
    settings: function () { return Promise.resolve(clone(read().settings)); },
    createBooking: function (d) {
      var s = read();
      return wait(450).then(function () {
        var phone = Core.normalisePhone(d.phone);
        if (!phone.ok) throw err('bad_phone');
        var name = Core.cleanName(d.name);
        if (!name) throw err('bad_name');
        var sess = sessionById(s, d.sessionId);
        if (!sess) throw err('session_closed');
        if (rateLimited(s, phone.e164)) { write(); throw err('rate_limited'); }
        var c = Core.canBook(sess, { phone: phone.e164, people: s.people, bookings: s.bookings, settings: s.settings });
        if (!c.ok) throw err(c.code, { until: c.until, ref: c.ref, status: c.status });
        var seats = Number(d.seats) === 2 ? 2 : 1;
        var outcome = Core.decideBookingOutcome(sess, s.bookings, seats);
        var person = upsertPerson(s, { name: name, phone: phone.e164, email: d.email, lang: d.lang, source: d.source });
        if (outcome === 'waitlist') person.flags.waitlist = true;
        var offer = offerOf(sess);
        var price = Core.priceFor(sess, offer, seats);
        var t = now();
        var b = { id: uid('b'), ref: Core.makeRef(offer ? offer.refPrefix : 'WPC', s.bookings), sessionId: sess.id, personId: person.id,
          phone: person.phone, name: name, email: d.email || null, seats: seats, guestName: seats === 2 ? (Core.cleanName(d.guestName) || null) : null,
          status: outcome, createdAt: iso(t), statusChangedAt: iso(t), holdStartedAt: outcome === 'pending' ? iso(t) : null,
          heldUntil: outcome === 'pending' ? Core.heldUntil(t, s.settings) : null, paymentMethod: null, amount: price.amount, currency: price.currency,
          paidAt: null, source: d.source || 'web', via: d.via || null, whoTold: d.whoTold || null, lang: d.lang || 'en' };
        s.bookings.push(b);
        write();
        return { ref: b.ref, status: b.status, heldUntil: b.heldUntil, amount: b.amount, currency: b.currency,
          position: outcome === 'waitlist' ? Core.waitlistPosition(s.bookings, b) : null };
      });
    },
    joinList: function (d) {
      var s = read();
      return wait(350).then(function () {
        var phone = Core.normalisePhone(d.phone);
        if (!phone.ok) throw err('bad_phone');
        var name = Core.cleanName(d.name);
        if (!name) throw err('bad_name');
        if (rateLimited(s, phone.e164)) { write(); throw err('rate_limited'); }
        var p = upsertPerson(s, { name: name, phone: phone.e164, lang: d.lang, source: d.source });
        var existing = s.listMembers.filter(function (l) { return l.personId === p.id && !l.leftAt; })[0];
        if (existing) {
          if (d.interest && !existing.interest) existing.interest = d.interest;
          write();
          return { ok: true, already: true };
        }
        p.flags.list = true;
        s.listMembers.push({ id: uid('l'), personId: p.id, name: p.name, phone: p.phone, joinedAt: iso(now()), source: d.source || 'web', interest: d.interest || null, leftAt: null });
        write();
        return { ok: true, already: false };
      });
    },
    createLead: function (d) {
      var s = read();
      return wait(350).then(function () {
        if (!Core.cleanName(d.name)) throw err('bad_name');
        var phone = d.phone ? Core.normalisePhone(d.phone) : null;
        if (d.phone && !phone.ok) throw err('bad_phone');
        if (!phone && !d.email) throw err('bad_phone');
        s.leads.push({ id: uid('ld'), kind: d.kind === 'team' ? 'team' : 'hosted', name: Core.cleanName(d.name), org: d.org || null, role: d.role || null,
          phone: phone ? phone.e164 : null, email: d.email || null, size: d.size || null, month: d.month || null, offerId: d.offerId || null,
          stage: 'new', nextAction: null, nextDate: null, source: d.source || 'web', lang: d.lang || 'en', createdAt: iso(now()) });
        write();
        return { ok: true };
      });
    },
    submitFeedback: function (d) {
      var s = read();
      return wait(350).then(function () {
        var r = Number(d.rating);
        if (!(r >= 1 && r <= 5)) throw err('bad_rating');
        var perm = { first_name: 1, anonymous: 1, no: 1 }[d.quotePermission] ? d.quotePermission : 'no';
        s.feedback.push({ id: uid('f'), sessionId: d.sessionId || null, rating: r, helped: (d.helped || '').slice(0, 1000), change: (d.change || '').slice(0, 1000),
          quotePermission: perm, quoteText: perm === 'no' ? null : (d.helped || '').slice(0, 600) || null, name: perm === 'first_name' ? (Core.cleanName(d.name) || null) : null,
          teamInterest: !!d.teamInterest, workEmail: d.teamInterest ? (d.workEmail || null) : null, nextDateInterest: !!d.nextDateInterest, createdAt: iso(now()) });
        if (d.teamInterest && d.workEmail) {
          s.leads.push({ id: uid('ld'), kind: 'team', name: 'From feedback', org: null, role: null, phone: null, email: d.workEmail, size: null, month: null,
            offerId: null, stage: 'new', nextAction: 'Reply with S28', nextDate: null, source: 'feedback', createdAt: iso(now()) });
        }
        write();
        return { ok: true };
      });
    }
  };

  /* ---------- owner interface (admin.js) ---------- */
  function findB(s, id) { var b = s.bookings.filter(function (x) { return x.id === id; })[0]; if (!b) throw err('not_found'); return b; }
  function touch(b, status) { b.status = status; b.statusChangedAt = iso(now()); }
  var admin = {
    needsLogin: false,
    signIn: function () { return Promise.resolve({ ok: true }); },
    signOut: function () { return Promise.resolve(); },
    load: function () { return wait(60).then(function () { return clone(read()); }); },
    markPaid: function (id, d) {
      var s = read(); var b = findB(s, id);
      touch(b, 'paid'); b.paymentMethod = d.method || 'cash'; b.amount = d.amount != null && d.amount !== '' ? Number(d.amount) : b.amount; b.paidAt = iso(now());
      write(); return Promise.resolve(clone(b));
    },
    setStatus: function (id, status) {
      var s = read(); var b = findB(s, id);
      if (!{ pending: 1, released: 1, cancelled: 1, attended: 1, no_show: 1, waitlist: 1 }[status]) return Promise.reject(err('bad_status'));
      touch(b, status);
      if (status === 'attended') { var p = s.people.filter(function (x) { return x.id === b.personId; })[0]; if (p) p.flags.alumni = true; }
      write(); return Promise.resolve(clone(b));
    },
    setHeldUntil: function (id, isoStr) { var s = read(); var b = findB(s, id); b.heldUntil = isoStr; write(); return Promise.resolve(clone(b)); },
    offerSeat: function (id) {
      var s = read(); var b = findB(s, id);
      var sess = sessionById(s, b.sessionId);
      if (b.status !== 'waitlist') return Promise.reject(err('bad_status'));
      if (Core.seatsLeft(sess, s.bookings) < (b.seats || 1)) return Promise.reject(err('no_seat_free'));
      var t = now();
      touch(b, 'pending'); b.holdStartedAt = iso(t); b.heldUntil = iso(t + s.settings.waitlistOfferHours * H); b.offered = true;
      write(); return Promise.resolve(clone(b));
    },
    addBooking: function (d) {
      var s = read();
      var phone = Core.normalisePhone(d.phone);
      if (!phone.ok) return Promise.reject(err('bad_phone'));
      var name = Core.cleanName(d.name);
      if (!name) return Promise.reject(err('bad_name'));
      var sess = sessionById(s, d.sessionId);
      if (!sess) return Promise.reject(err('session_closed'));
      if (Core.findBooking(s.bookings, sess.id, phone.e164, s.people)) return Promise.reject(err('already_booked'));
      var seats = Number(d.seats) === 2 ? 2 : 1;
      var outcome = Core.decideBookingOutcome(sess, s.bookings, seats);
      var person = upsertPerson(s, { name: name, phone: phone.e164, email: d.email, lang: d.lang, source: d.source || 'admin' });
      var price = Core.priceFor(sess, offerOf(sess), seats);
      var t = now(); var paid = d.paid && outcome === 'pending';
      var b = { id: uid('b'), ref: Core.makeRef((offerOf(sess) || {}).refPrefix || 'WPC', s.bookings), sessionId: sess.id, personId: person.id, phone: person.phone,
        name: name, email: d.email || null, seats: seats, guestName: seats === 2 ? (Core.cleanName(d.guestName) || null) : null,
        status: paid ? 'paid' : outcome, createdAt: iso(t), statusChangedAt: iso(t), holdStartedAt: iso(t),
        heldUntil: outcome === 'pending' ? Core.heldUntil(t, s.settings) : null, paymentMethod: paid ? (d.method || 'cash') : null,
        amount: d.amount != null && d.amount !== '' ? Number(d.amount) : price.amount, currency: price.currency, paidAt: paid ? iso(t) : null,
        source: d.source || 'admin', via: null, whoTold: d.whoTold || null, lang: d.lang || 'en' };
      s.bookings.push(b); write();
      return Promise.resolve(clone(b));
    },
    saveSession: function (d) {
      var s = read();
      var x = d.id ? sessionById(s, d.id) : null;
      var cand = Object.assign({}, x || {}, d);
      if (!cand.id) cand.id = cand.offerId + '-' + cand.startsAt.slice(0, 10).replace(/-/g, '');
      if (!x && sessionById(s, cand.id)) cand.id += '-' + Math.random().toString(36).slice(2, 5);
      var offer = (CFG.offers || []).filter(function (o) { return o.id === cand.offerId; })[0];
      if (offer && offer.kind === 'slot') cand.capacity = 1;
      var clash = Core.conflicts(cand, s.sessions, s.timeOff);
      if (clash.length && !d.allowOverlap) return Promise.reject(err('overlap', { with: clash.map(function (c) { return c.kind === 'session' ? c.item.id : 'time off: ' + (c.item.reason || ''); }) }));
      if (x) Object.assign(x, cand); else s.sessions.push(cand);
      write(); return Promise.resolve(clone(cand));
    },
    moveSession: function (oldId, newData) {
      var s = read(); var old = sessionById(s, oldId);
      if (!old) return Promise.reject(err('not_found'));
      var nx = Object.assign({}, old, newData, { status: 'open' });
      delete nx.movedTo; delete nx.previewNote;
      nx.id = old.offerId + '-' + nx.startsAt.slice(0, 10).replace(/-/g, '');
      if (sessionById(s, nx.id)) nx.id += '-m';
      var clash = Core.conflicts(nx, s.sessions.filter(function (x) { return x.id !== old.id; }), s.timeOff);
      if (clash.length) return Promise.reject(err('overlap', { with: clash.map(function (c) { return c.kind === 'session' ? c.item.id : 'time off'; }) }));
      var r = Core.moveSession(old, nx, s.bookings);
      s.sessions.push(nx);
      Object.assign(old, r.session);
      r.moved.forEach(function (m) { var b = findB(s, m.id); Object.assign(b, m); });
      r.created.forEach(function (c) { s.bookings.push(c); });
      write(); return Promise.resolve({ session: clone(nx), moved: r.created.length });
    },
    blockTime: function (d) {
      var s = read();
      var clash = Core.conflicts({ id: '_', startsAt: d.startsAt, endsAt: d.endsAt }, s.sessions, []);
      if (clash.length && !d.allowOverlap) return Promise.reject(err('overlap', { with: clash.map(function (c) { return c.item.id; }) }));
      s.timeOff.push({ id: uid('t'), startsAt: d.startsAt, endsAt: d.endsAt, reason: d.reason || '' });
      write(); return Promise.resolve();
    },
    removeTimeOff: function (id) { var s = read(); s.timeOff = s.timeOff.filter(function (t) { return t.id !== id; }); write(); return Promise.resolve(); },
    setSetting: function (k, v) { var s = read(); s.settings[k] = v; write(); return Promise.resolve(clone(s.settings)); },
    tick: function (itemId, done) { var s = read(); if (done) s.ticks[itemId] = iso(now()); else delete s.ticks[itemId]; write(); return Promise.resolve(); },
    setManual: function (k, v) { var s = read(); s.manual[k] = v === '' ? null : Number(v); write(); return Promise.resolve(); },
    updatePerson: function (id, patch) {
      var s = read(); var p = s.people.filter(function (x) { return x.id === id; })[0];
      if (!p) return Promise.reject(err('not_found'));
      if (patch.flags) Object.assign(p.flags, patch.flags);
      if (patch.notes != null) p.notes = String(patch.notes).slice(0, 2000);
      write(); return Promise.resolve(clone(p));
    },
    updateLead: function (id, patch) {
      var s = read(); var l = s.leads.filter(function (x) { return x.id === id; })[0];
      if (!l) return Promise.reject(err('not_found'));
      ['stage', 'nextAction', 'nextDate'].forEach(function (k) { if (k in patch) l[k] = patch[k]; });
      write(); return Promise.resolve(clone(l));
    },
    leaveList: function (id) { var s = read(); var l = s.listMembers.filter(function (x) { return x.id === id; })[0]; if (l) l.leftAt = iso(now()); write(); return Promise.resolve(); },
    reset: function () { mem = seed(); write(); return Promise.resolve(); },
    clearExamples: function () {
      var s = read();
      var exS = {}; s.sessions.forEach(function (x) { if (x.example) exS[x.id] = 1; });
      ['sessions', 'people', 'bookings', 'listMembers', 'leads', 'feedback', 'timeOff'].forEach(function (k) {
        s[k] = s[k].filter(function (r) { return !r.example && !exS[r.sessionId]; });
      });
      write(); return Promise.resolve();
    }
  };

  window.LaunchStores = window.LaunchStores || {};
  window.LaunchStores.demo = { api: api, admin: admin, storageKey: KEY };
})();
