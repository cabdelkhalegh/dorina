/* Dorina Launch Pack · booking core.
   Pure functions, no DOM, no storage, no network. UMD: browser (window.BookingCore) and Node (require).
   The database enforces the same rules (launch-pack/05-booking-backend/migrations/002_functions.sql);
   this file lets the page and the admin show the right state, and lets the demo store behave the same way.
   Launch Pack · Al Kentawi */
(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.BookingCore = factory();
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  var REF_ALPHABET = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ';
  var HOLDING = { pending: 1, paid: 1 };             // statuses that take a seat
  var LIVE_BOOKING = { pending: 1, paid: 1, waitlist: 1 };
  var HOUR = 3600000;

  function ms(v) { return v == null ? NaN : (typeof v === 'number' ? v : Date.parse(v)); }
  function iso(t) { return new Date(t).toISOString(); }

  /* ---------- phone ---------- */
  // Country codes we split for display. Unknown codes still work (E.164 length check only).
  var CC = ['961', '971', '966', '965', '974', '973', '968', '962', '963', '964', '357', '90', '20', '33', '49', '44', '39', '34', '61', '1'];

  function toLatinDigits(s) {
    return String(s == null ? '' : s).replace(/[٠-٩]/g, function (c) { return String(c.charCodeAt(0) - 0x0660); })
      .replace(/[۰-۹]/g, function (c) { return String(c.charCodeAt(0) - 0x06F0); });
  }
  function splitCc(digits) {
    for (var i = 0; i < CC.length; i++) if (digits.indexOf(CC[i]) === 0) return CC[i];
    return '';
  }
  function group(n) {
    if (n.length <= 4) return n;
    if (n.length === 7) return n.slice(0, 1) + ' ' + n.slice(1, 4) + ' ' + n.slice(4);
    if (n.length === 8) return n.slice(0, 2) + ' ' + n.slice(2, 5) + ' ' + n.slice(5);
    if (n.length === 9) return n.slice(0, 2) + ' ' + n.slice(2, 5) + ' ' + n.slice(5);
    if (n.length === 10) return n.slice(0, 3) + ' ' + n.slice(3, 6) + ' ' + n.slice(6);
    return n.replace(/(\d{3})(?=\d)/g, '$1 ');
  }
  // Lebanese numbers: the prefixes and lengths below are [verify] (CONVENTIONS 7). They only raise a soft warning.
  function lebaneseLooksUsual(nsn) {
    if (/^(70|71|76|78|79|81)\d{6}$/.test(nsn)) return true;   // mobile, 8 digits
    if (/^3\d{6}$/.test(nsn)) return true;                     // mobile 03, 7 digits
    if (/^[14-9]\d{6}$/.test(nsn)) return true;                // landline, 7 digits
    return false;
  }
  /**
   * normalisePhone('03 123 456') -> { ok, e164, display, cc, warn, error }
   * Default country +961; accepts any country; Arabic-Indic and Persian digits; 00; a leading 0.
   * Never blocks an unusual Lebanese number: it sets warn:'verify' instead.
   */
  function normalisePhone(input, defaultCc) {
    defaultCc = String(defaultCc || '961');
    var raw = toLatinDigits(input).trim();
    if (!raw) return { ok: false, error: 'bad_phone', reason: 'empty' };
    var plus = /^\s*\+/.test(raw);
    var d = raw.replace(/\D/g, '');
    if (!d) return { ok: false, error: 'bad_phone', reason: 'empty' };
    var full;
    if (plus) full = d;
    else if (d.indexOf('00') === 0) full = d.slice(2);
    else if (d.charAt(0) === '0') full = defaultCc + d.replace(/^0+/, '');
    else if (d.length >= 10 && splitCc(d)) full = d;          // typed with the country code but no +
    else full = defaultCc + d;
    var cc = splitCc(full);
    var nsn = cc ? full.slice(cc.length) : full;
    if (cc && nsn.charAt(0) === '0') { nsn = nsn.replace(/^0+/, ''); full = cc + nsn; }   // +961 03 ... -> +961 3 ...
    if (full.length < 8 || full.length > 15 || full.charAt(0) === '0') return { ok: false, error: 'bad_phone', reason: 'length' };
    if (cc === '961' && (nsn.length < 6 || nsn.length > 9)) return { ok: false, error: 'bad_phone', reason: 'length' };
    var warn = null;
    if (cc === '961' && !lebaneseLooksUsual(nsn)) warn = 'verify';
    return { ok: true, e164: '+' + full, cc: cc, display: '+' + (cc ? cc + ' ' + group(nsn) : full), warn: warn };
  }
  function samePhone(a, b) {
    var x = normalisePhone(a), y = normalisePhone(b);
    return !!(x.ok && y.ok && x.e164 === y.e164);
  }
  function cleanName(s) {
    var n = String(s == null ? '' : s).replace(/\s+/g, ' ').trim();
    if (n.length < 2 || n.length > 80) return null;
    if (/[<>{}\\]/.test(n) || /https?:/i.test(n)) return null;
    return n;
  }

  /* ---------- seats ---------- */
  function seatsTaken(bookings, sessionId) {
    var t = 0;
    (bookings || []).forEach(function (b) {
      if ((!sessionId || b.sessionId === sessionId) && HOLDING[b.status]) t += Number(b.seats) || 1;
    });
    return t;
  }
  function seatsLeft(session, bookings) {
    if (!session) return 0;
    return Math.max(0, (Number(session.capacity) || 0) - seatsTaken(bookings, session.id));
  }
  function sessionState(session, bookings, now) {
    now = now == null ? Date.now() : ms(now);
    if (!session) return 'missing';
    if (session.status === 'moved' || session.status === 'done' || session.status === 'closed') return session.status;
    if (ms(session.endsAt) <= now) return 'done';
    if (session.status === 'draft') return 'soon';
    if (session.opensAt && ms(session.opensAt) > now) return 'soon';
    if (session.closesAt && ms(session.closesAt) <= now) return 'closed';
    if (session.status === 'full' || seatsLeft(session, bookings) <= 0) return 'full';
    return 'open';
  }

  /**
   * canBook(session, {now, phone, people, settings, bookings}) -> { ok, code, until }
   * code: null | session_closed | not_open_yet | priority_window | already_booked
   * Full is NOT an error: it books onto the waitlist (see decideBookingOutcome).
   */
  function canBook(session, ctx) {
    ctx = ctx || {};
    var now = ctx.now == null ? Date.now() : ms(ctx.now);
    var settings = ctx.settings || {};
    if (!session) return { ok: false, code: 'session_closed' };
    if (settings.bookingsOpen === false) return { ok: false, code: 'session_closed' };
    var st = session.status;
    if (st === 'closed' || st === 'moved' || st === 'done') return { ok: false, code: 'session_closed' };
    if (ms(session.endsAt) <= now) return { ok: false, code: 'session_closed' };
    if (st === 'draft') return { ok: false, code: 'not_open_yet', until: session.opensAt || null };
    if (session.opensAt && ms(session.opensAt) > now) return { ok: false, code: 'not_open_yet', until: session.opensAt };
    if (session.closesAt && ms(session.closesAt) <= now) return { ok: false, code: 'session_closed' };
    var p = ctx.phone ? normalisePhone(ctx.phone) : null;
    if (p && p.ok && ctx.bookings) {
      var dup = findBooking(ctx.bookings, session.id, p.e164, ctx.people);
      if (dup) return { ok: false, code: 'already_booked', ref: dup.ref, status: dup.status };
    }
    if (session.priorityUntil && ms(session.priorityUntil) > now) {
      var person = p && p.ok ? findPerson(ctx.people, p.e164) : null;
      var f = person && person.flags ? person.flags : {};
      if (!(f.alumni || f.waitlist)) return { ok: false, code: 'priority_window', until: session.priorityUntil };
    }
    return { ok: true, code: null };
  }
  function findPerson(people, e164) {
    for (var i = 0; people && i < people.length; i++) if (people[i].phone === e164) return people[i];
    return null;
  }
  function findBooking(bookings, sessionId, e164, people) {
    var person = findPerson(people, e164);
    for (var i = 0; i < bookings.length; i++) {
      var b = bookings[i];
      if (b.sessionId !== sessionId || !LIVE_BOOKING[b.status]) continue;
      if ((person && b.personId === person.id) || b.phone === e164) return b;
    }
    return null;
  }
  /** decideBookingOutcome(session, bookings, seats) -> 'pending' | 'waitlist' */
  function decideBookingOutcome(session, bookings, seats) {
    seats = Number(seats) === 2 ? 2 : 1;
    if (session && session.status === 'full') return 'waitlist';
    return seatsTaken(bookings, session.id) + seats <= (Number(session.capacity) || 0) ? 'pending' : 'waitlist';
  }
  function priceFor(session, offer, seats) {
    var s = session || {}, o = offer || {};
    var local = s.currency && s.currency !== 'USD' && s.priceLocal != null;   // branch D: AED prices on the session
    var single = local ? s.priceLocal : (s.priceUsd != null ? s.priceUsd : o.priceUsd);
    var pair = local ? s.pairPriceLocal : (s.pairPriceUsd != null ? s.pairPriceUsd : o.pairPriceUsd);
    var amount = Number(seats) === 2 ? (pair != null ? pair : (single != null ? single * 2 : null)) : single;
    return { amount: amount == null ? null : Number(amount), currency: s.currency || 'USD' };
  }
  function heldUntil(now, settings) {
    var h = (settings && settings.holdHours) || 48;
    return iso((now == null ? Date.now() : ms(now)) + h * HOUR);
  }

  /* ---------- holds ---------- */
  /**
   * holdAge(booking, now, settings) -> { level: normal|amber|red, hoursHeld, hoursLeft, heldUntil }
   * For a 48 h hold with the reminder at 40 h: amber from 40 h, red from 48 h. A 24 h waitlist offer
   * goes amber in its last (holdHours - reminderAtHours) hours, red when it runs out. Never auto-released.
   */
  function holdAge(booking, now, settings) {
    settings = settings || {};
    var holdH = settings.holdHours || 48, remH = settings.reminderAtHours || 40;
    now = now == null ? Date.now() : ms(now);
    var start = ms(booking.holdStartedAt || booking.statusChangedAt || booking.createdAt);
    var end = booking.heldUntil ? ms(booking.heldUntil) : start + holdH * HOUR;
    if (isNaN(start)) start = end - holdH * HOUR;
    var warnBefore = (holdH - remH) * HOUR;
    var level = now >= end ? 'red' : (now >= end - warnBefore ? 'amber' : 'normal');
    return {
      level: level,
      hoursHeld: Math.max(0, Math.floor((now - start) / HOUR)),
      hoursLeft: Math.max(0, Math.ceil((end - now) / HOUR)),
      heldUntil: iso(end)
    };
  }
  /** nextWaitlist(bookings, sessionId, seatsFree?) -> the oldest waitlist booking that fits, or null */
  function nextWaitlist(bookings, sessionId, seatsFree) {
    var w = (bookings || []).filter(function (b) { return b.sessionId === sessionId && b.status === 'waitlist'; })
      .sort(function (a, b) { return ms(a.createdAt) - ms(b.createdAt) || (a.ref < b.ref ? -1 : 1); });
    if (seatsFree == null) return w[0] || null;
    for (var i = 0; i < w.length; i++) if ((Number(w[i].seats) || 1) <= seatsFree) return w[i];
    return null;
  }
  function waitlistPosition(bookings, booking) {
    var w = (bookings || []).filter(function (b) { return b.sessionId === booking.sessionId && b.status === 'waitlist'; })
      .sort(function (a, b) { return ms(a.createdAt) - ms(b.createdAt); });
    for (var i = 0; i < w.length; i++) if (w[i].ref === booking.ref) return i + 1;
    return null;
  }

  /* ---------- time slots (private consultation capacity 1; sessions vs time off) ---------- */
  function slotsOverlap(a, b) {
    return ms(a.startsAt) < ms(b.endsAt) && ms(b.startsAt) < ms(a.endsAt);
  }
  var LIVE_SESSION = { draft: 1, open: 1, full: 1, closed: 1 };
  /** conflicts(candidate, sessions, timeOff) -> list of { kind: 'session'|'time_off', item } */
  function conflicts(candidate, sessions, timeOff) {
    var out = [];
    (sessions || []).forEach(function (s) {
      if (s.id !== candidate.id && LIVE_SESSION[s.status] && slotsOverlap(candidate, s)) out.push({ kind: 'session', item: s });
    });
    (timeOff || []).forEach(function (t) { if (slotsOverlap(candidate, t)) out.push({ kind: 'time_off', item: t }); });
    return out;
  }

  /* ---------- references ---------- */
  function randomChars(n, rand) {
    rand = rand || Math.random;
    var s = '';
    for (var i = 0; i < n; i++) s += REF_ALPHABET.charAt(Math.floor(rand() * REF_ALPHABET.length));
    return s;
  }
  /** makeRef('WPC', existingRefs, rand?) -> 'WPC-7K3M'; retries on a collision. */
  function makeRef(prefix, existing, rand) {
    var taken = {};
    (existing || []).forEach(function (r) { taken[typeof r === 'string' ? r : r.ref] = 1; });
    for (var tries = 0; tries < 50; tries++) {
      var r = (prefix || 'BK') + '-' + randomChars(4, rand);
      if (!taken[r]) return r;
    }
    throw new Error('ref_exhausted');
  }
  function refSuffix(ref) { var i = String(ref).lastIndexOf('-'); return i < 0 ? String(ref) : String(ref).slice(i + 1); }

  /**
   * moveSession(oldSession, newSession, bookings, {now, refPrefix}) ->
   *   { session: old session with status 'moved' and movedTo, moved: [old rows now 'moved'], created: [new rows] }
   * Paid, pending and waitlist bookings move; each new row keeps the ref suffix (WPC-7K3M stays WPC-7K3M,
   * or WPO-7K3M if the new session sells under another prefix). Nothing is cancelled.
   */
  function moveSession(oldSession, newSession, bookings, opts) {
    opts = opts || {};
    var now = iso(opts.now == null ? Date.now() : ms(opts.now));
    var prefix = opts.refPrefix || null;
    var moved = [], created = [];
    (bookings || []).forEach(function (b) {
      if (b.sessionId !== oldSession.id || !LIVE_BOOKING[b.status]) return;
      var copy = {};
      for (var k in b) if (Object.prototype.hasOwnProperty.call(b, k)) copy[k] = b[k];
      copy.id = (b.id || b.ref) + '-m';
      copy.sessionId = newSession.id;
      copy.ref = prefix ? prefix + '-' + refSuffix(b.ref) : b.ref;
      copy.movedFrom = b.id || b.ref;
      copy.statusChangedAt = now;
      created.push(copy);
      var old = {};
      for (var j in b) if (Object.prototype.hasOwnProperty.call(b, j)) old[j] = b[j];
      old.status = 'moved'; old.statusChangedAt = now; old.movedTo = copy.id;
      moved.push(old);
    });
    var s = {};
    for (var m in oldSession) if (Object.prototype.hasOwnProperty.call(oldSession, m)) s[m] = oldSession[m];
    s.status = 'moved'; s.movedTo = newSession.id;
    return { session: s, moved: moved, created: created };
  }

  /* ---------- numbers (EXECUTION-PLAN section 7) ---------- */
  function numbers(rows, opts) {
    rows = rows || {}; opts = opts || {};
    var bookings = (rows.bookings || []).filter(function (b) { return !opts.sessionId || b.sessionId === opts.sessionId; });
    if (opts.excludeExamples) bookings = bookings.filter(function (b) { return !b.example; });
    var n = {
      paidSeats: 0, paidBookings: 0, pairs: 0, pendingSeats: 0, waitlist: 0, released: 0, cancelled: 0,
      attended: 0, noShow: 0, showRate: null, bySource: {}, byWhoTold: {}, cashIn: {}, cashByMethod: {},
      listSize: 0, feedback: 0, quotePermissions: 0, teamTicks: 0, nextDateTicks: 0,
      messagesSent: rows.manual && rows.manual.messagesSent != null ? rows.manual.messagesSent : null,
      costs: rows.manual && rows.manual.costs != null ? rows.manual.costs : null,
      hours: rows.manual && rows.manual.hours != null ? rows.manual.hours : null
    };
    bookings.forEach(function (b) {
      var seats = Number(b.seats) || 1;
      var paidLike = b.status === 'paid' || b.status === 'attended' || b.status === 'no_show';
      if (paidLike && b.paidAt) {
        n.paidSeats += seats; n.paidBookings += 1; if (seats === 2) n.pairs += 1;
        var cur = b.currency || 'USD';
        n.cashIn[cur] = (n.cashIn[cur] || 0) + (Number(b.amount) || 0);
        var m = b.paymentMethod || 'other';
        n.cashByMethod[m] = (n.cashByMethod[m] || 0) + (Number(b.amount) || 0);
      }
      if (b.status === 'pending') n.pendingSeats += seats;
      if (b.status === 'waitlist') n.waitlist += 1;
      if (b.status === 'released') n.released += 1;
      if (b.status === 'cancelled') n.cancelled += 1;
      if (b.status === 'attended') n.attended += seats;
      if (b.status === 'no_show') n.noShow += seats;
      if (b.status !== 'moved') {
        var s = b.source || 'web'; n.bySource[s] = (n.bySource[s] || 0) + 1;
        if (b.whoTold) n.byWhoTold[b.whoTold] = (n.byWhoTold[b.whoTold] || 0) + 1;
      }
    });
    if (n.attended + n.noShow > 0) n.showRate = Math.round(100 * n.attended / (n.attended + n.noShow));
    n.listSize = (rows.listMembers || []).filter(function (l) { return !l.leftAt && (!opts.excludeExamples || !l.example); }).length;
    (rows.feedback || []).forEach(function (f) {
      if (opts.excludeExamples && f.example) return;
      if (opts.sessionId && f.sessionId !== opts.sessionId) return;
      n.feedback += 1;
      if (f.quotePermission === 'first_name' || f.quotePermission === 'anonymous') n.quotePermissions += 1;
      if (f.teamInterest) n.teamTicks += 1;
      if (f.nextDateInterest) n.nextDateTicks += 1;
    });
    return n;
  }

  /* ---------- CSV ---------- */
  function csvCell(v) {
    if (v == null) return '';
    var s = typeof v === 'object' ? JSON.stringify(v) : String(v);
    // Spreadsheet formula guard; a phone like +96170123456 is left as it is.
    if (/^[=@\t\r]/.test(s) || (/^[+-]/.test(s) && !/^[+-]?[\d\s().]+$/.test(s))) s = "'" + s;
    if (/[",\n\r]/.test(s)) s = '"' + s.replace(/"/g, '""') + '"';
    return s;
  }
  /** toCsv(rows, columns?, {bom}) -> text. columns: ['ref', ...] or [{key, label}] */
  function toCsv(rows, columns, opts) {
    rows = rows || [];
    if (!columns) {
      var seen = {}; columns = [];
      rows.forEach(function (r) { for (var k in r) if (!seen[k]) { seen[k] = 1; columns.push(k); } });
    }
    var cols = columns.map(function (c) { return typeof c === 'string' ? { key: c, label: c } : c; });
    var lines = [cols.map(function (c) { return csvCell(c.label); }).join(',')];
    rows.forEach(function (r) { lines.push(cols.map(function (c) { return csvCell(r[c.key]); }).join(',')); });
    return (opts && opts.bom === false ? '' : '﻿') + lines.join('\r\n') + '\r\n';
  }

  /* ---------- drafts ---------- */
  /** fillDraft('Hello {name}', {name:'Rima'}) -> 'Hello Rima'. Unknown {vars} stay visible so nothing is sent half-filled unnoticed. */
  function fillDraft(template, vars) {
    vars = vars || {};
    return String(template || '').replace(/\{([a-z_]+)\}/g, function (m, k) {
      return vars[k] != null && vars[k] !== '' ? String(vars[k]) : m;
    });
  }
  function missingVars(text) { return (String(text).match(/\{[a-z_]+\}/g) || []); }

  /* ---------- time ---------- */
  function fmt(isoStr, lang, tz, o) {
    var loc = lang === 'ar' ? 'ar-LB-u-nu-latn' : 'en-GB';
    var f = { timeZone: tz || 'Asia/Beirut' };
    for (var k in o) f[k] = o[k];
    return new Intl.DateTimeFormat(loc, f).format(new Date(isoStr));
  }
  function localTime(isoStr, tz, lang) {
    return fmt(isoStr, lang || 'en', tz, { hour: 'numeric', minute: '2-digit', hour12: true })
      .replace(/\s?([ap])\.?m\.?$/i, function (m, p) { return ' ' + p.toLowerCase() + 'm'; });
  }
  function localHM(isoStr, tz) {
    return fmt(isoStr, 'en', tz, { hour: '2-digit', minute: '2-digit', hourCycle: 'h23' });
  }
  /** Beirut/Dubai pair, computed from the zone database (Lebanon changes clocks; never a fixed offset). */
  function dualTime(isoStr, lang, tzA, tzB) {
    var a = localTime(isoStr, tzA || 'Asia/Beirut', lang), b = localTime(isoStr, tzB || 'Asia/Dubai', lang);
    return lang === 'ar' ? a + ' بيروت · ' + b + ' دبي' : a + ' Beirut · ' + b + ' Dubai';
  }
  /** Local wall time in a zone -> UTC ISO. Used by the admin's "open a session" form. */
  function zonedToUtc(dateStr, timeStr, tz) {
    var guess = Date.parse(dateStr + 'T' + timeStr + ':00Z');
    for (var i = 0; i < 3; i++) {
      var parts = {};
      new Intl.DateTimeFormat('en-GB', { timeZone: tz, year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', hourCycle: 'h23' })
        .formatToParts(new Date(guess)).forEach(function (p) { parts[p.type] = p.value; });
      var shown = Date.parse(parts.year + '-' + parts.month + '-' + parts.day + 'T' + parts.hour + ':' + parts.minute + ':00Z');
      var want = Date.parse(dateStr + 'T' + timeStr + ':00Z');
      if (shown === want) break;
      guess += want - shown;
    }
    return iso(guess);
  }
  function gcalLink(o) {
    function z(t) { return iso(ms(t)).replace(/[-:]/g, '').replace(/\.\d{3}/, ''); }
    var q = 'action=TEMPLATE&text=' + encodeURIComponent(o.title || '') + '&dates=' + z(o.startsAt) + '/' + z(o.endsAt) +
      '&details=' + encodeURIComponent(o.details || '') + (o.location ? '&location=' + encodeURIComponent(o.location) : '');
    return 'https://calendar.google.com/calendar/render?' + q;
  }

  return {
    REF_ALPHABET: REF_ALPHABET,
    toLatinDigits: toLatinDigits, normalisePhone: normalisePhone, samePhone: samePhone, cleanName: cleanName,
    seatsTaken: seatsTaken, seatsLeft: seatsLeft, sessionState: sessionState, canBook: canBook,
    decideBookingOutcome: decideBookingOutcome, priceFor: priceFor, heldUntil: heldUntil,
    holdAge: holdAge, nextWaitlist: nextWaitlist, waitlistPosition: waitlistPosition,
    slotsOverlap: slotsOverlap, conflicts: conflicts,
    makeRef: makeRef, refSuffix: refSuffix, moveSession: moveSession,
    numbers: numbers, toCsv: toCsv, csvCell: csvCell, fillDraft: fillDraft, missingVars: missingVars,
    localTime: localTime, localHM: localHM, dualTime: dualTime, zonedToUtc: zonedToUtc, gcalLink: gcalLink,
    findPerson: findPerson, findBooking: findBooking
  };
});
