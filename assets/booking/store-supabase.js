/* Dorina Launch Pack · Supabase store. Plain fetch to the REST, RPC and auth endpoints; no library.
   Public calls use the publishable anon key and reach only the five public functions.
   The admin signs in with email and password; only the session token is kept, in sessionStorage.
   Launch Pack · Al Kentawi */
(function () {
  'use strict';
  var CFG = window.LAUNCH_CONFIG || {};
  var URL_ = String((CFG.supabase || {}).url || '').replace(/\/+$/, '');
  var KEY = (CFG.supabase || {}).anonKey || '';
  var TOKEN_KEY = 'dorinaAdminSession';
  var tokenMem = null;

  function err(code, extra) { var e = new Error(code); e.code = code; if (extra) for (var k in extra) e[k] = extra[k]; return e; }
  function getToken() {
    if (tokenMem) return tokenMem;
    try { var t = sessionStorage.getItem(TOKEN_KEY); if (t) tokenMem = JSON.parse(t); } catch (e) {}
    return tokenMem;
  }
  function setToken(t) {
    tokenMem = t;
    try { if (t) sessionStorage.setItem(TOKEN_KEY, JSON.stringify(t)); else sessionStorage.removeItem(TOKEN_KEY); } catch (e) {}
  }
  function req(path, opts, asUser) {
    opts = opts || {};
    var h = { apikey: KEY, 'Content-Type': 'application/json' };
    var tok = asUser ? getToken() : null;
    h.Authorization = 'Bearer ' + (tok ? tok.access_token : KEY);
    if (opts.prefer) h.Prefer = opts.prefer;
    var ctl = typeof AbortController !== 'undefined' ? new AbortController() : null;
    var timer = ctl ? setTimeout(function () { ctl.abort(); }, 20000) : null;
    return fetch(URL_ + path, { method: opts.method || 'GET', headers: h, body: opts.body != null ? JSON.stringify(opts.body) : undefined, signal: ctl ? ctl.signal : undefined })
      .then(function (r) {
        if (timer) clearTimeout(timer);
        return r.text().then(function (txt) {
          var data = null;
          try { data = txt ? JSON.parse(txt) : null; } catch (e) { data = txt; }
          if (!r.ok) {
            if (r.status === 401 || r.status === 403) throw err(asUser ? 'not_signed_in' : 'network', { status: r.status });
            if (data && data.code === '23P01') throw err('overlap', { detail: data.details || data.message });
            throw err((data && (data.error_description || data.msg)) ? 'auth_failed' : 'network', { status: r.status, detail: data });
          }
          return data;
        });
      }, function () { if (timer) clearTimeout(timer); throw err('network'); });
  }
  function rpc(name, args, asUser) {
    return req('/rest/v1/rpc/' + name, { method: 'POST', body: args || {} }, asUser).then(function (r) {
      if (r && r.ok === false) throw err(r.error || 'network', { until: r.until, ref: r.ref, status: r.status });
      return r;
    });
  }

  /* ---------- row mapping (snake_case in the database, camelCase in the pages) ---------- */
  function mapSession(r) {
    return { id: r.id, offerId: r.offering_id || r.offer_id, startsAt: r.starts_at, endsAt: r.ends_at, timeConfirmed: r.time_confirmed,
      areaEn: r.area_en, areaAr: r.area_ar, online: r.online, capacity: r.capacity, minToRun: r.min_to_run, priceUsd: r.price_usd != null ? Number(r.price_usd) : null,
      pairPriceUsd: r.pair_price_usd != null ? Number(r.pair_price_usd) : null, priceLocal: r.price_local != null ? Number(r.price_local) : null,
      pairPriceLocal: r.pair_price_local != null ? Number(r.pair_price_local) : null, currency: r.currency, status: r.status,
      opensAt: r.opens_at, priorityUntil: r.priority_until, decisionAt: r.decision_at, closesAt: r.closes_at, fallbackDate: r.fallback_date,
      movedTo: r.moved_to, state: r.state, seatsLeft: r.seats_left != null ? r.seats_left : null };
  }
  var SESSION_COLS = { offerId: 'offering_id', startsAt: 'starts_at', endsAt: 'ends_at', timeConfirmed: 'time_confirmed', areaEn: 'area_en', areaAr: 'area_ar',
    online: 'online', capacity: 'capacity', minToRun: 'min_to_run', priceUsd: 'price_usd', pairPriceUsd: 'pair_price_usd', priceLocal: 'price_local',
    pairPriceLocal: 'pair_price_local', currency: 'currency', status: 'status', opensAt: 'opens_at', priorityUntil: 'priority_until',
    decisionAt: 'decision_at', closesAt: 'closes_at', fallbackDate: 'fallback_date', id: 'id' };
  function toSessionRow(d) { var o = {}; for (var k in SESSION_COLS) if (k in d) o[SESSION_COLS[k]] = d[k]; return o; }
  function mapPerson(r) {
    return { id: r.id, phone: r.phone_e164, name: r.name, email: r.email, lang: r.lang, firstSource: r.first_source,
      flags: { alumni: r.alumni, list: r.on_list, waitlist: r.waitlisted, teamInterest: r.team_interest }, notes: r.notes || '', createdAt: r.created_at };
  }
  function mapBooking(r, people) {
    var p = people[r.person_id] || {};
    return { id: r.id, ref: r.ref, sessionId: r.session_id, personId: r.person_id, phone: p.phone || null, name: p.name || '', email: p.email || null,
      seats: r.seats, guestName: r.guest_name, status: r.status, holdStartedAt: r.hold_started_at, heldUntil: r.held_until, offered: r.offered,
      paymentMethod: r.payment_method, amount: r.amount != null ? Number(r.amount) : null, currency: r.currency, paidAt: r.paid_at, source: r.source,
      via: r.via, whoTold: r.who_told, lang: r.lang, movedFrom: r.moved_from, movedTo: r.moved_to, createdAt: r.created_at, statusChangedAt: r.status_changed_at };
  }

  /* ---------- public ---------- */
  var api = {
    mode: 'supabase',
    listSessions: function (q) {
      q = q || {};
      return rpc('lp_public_sessions', {}).then(function (rows) {
        return (rows || []).map(mapSession).filter(function (s) { return !q.offerId || s.offerId === q.offerId; });
      });
    },
    getSession: function (id) {
      return api.listSessions({}).then(function (all) { return all.filter(function (s) { return s.id === id; })[0] || null; });
    },
    settings: function () {
      var h = CFG.holds || {};
      return Promise.resolve({ holdHours: h.holdHours || 48, reminderAtHours: h.reminderAtHours || 40, waitlistOfferHours: h.waitlistOfferHours || 24 });
    },
    createBooking: function (d) {
      return rpc('lp_create_booking', { p_session_id: d.sessionId, p_name: d.name, p_phone: d.phone, p_email: d.email || null,
        p_seats: Number(d.seats) === 2 ? 2 : 1, p_guest_name: d.guestName || null, p_who_told: d.whoTold || null, p_via: d.via || null,
        p_source: d.source || 'web', p_lang: d.lang || 'en' }).then(function (r) {
        return { ref: r.ref, status: r.status, heldUntil: r.held_until, amount: r.amount != null ? Number(r.amount) : null, currency: r.currency, position: r.position };
      });
    },
    joinList: function (d) {
      return rpc('lp_join_list', { p_name: d.name, p_phone: d.phone, p_lang: d.lang || 'en', p_source: d.source || 'web', p_interest: d.interest || null })
        .then(function (r) { return { ok: true, already: !!r.already }; });
    },
    createLead: function (d) {
      return rpc('lp_create_lead', { p_kind: d.kind, p_name: d.name, p_org: d.org || null, p_role: d.role || null, p_phone: d.phone || null,
        p_email: d.email || null, p_size: d.size != null ? String(d.size) : null, p_month: d.month || null, p_offer_id: d.offerId || null,
        p_source: d.source || 'web', p_lang: d.lang || 'en' }).then(function () { return { ok: true }; });
    },
    submitFeedback: function (d) {
      return rpc('lp_submit_feedback', { p_session_id: d.sessionId || null, p_rating: Number(d.rating), p_helped: d.helped || null, p_change: d.change || null,
        p_quote_permission: d.quotePermission || 'no', p_first_name: d.name || null, p_team_interest: !!d.teamInterest,
        p_work_email: d.workEmail || null, p_next_date_interest: !!d.nextDateInterest }).then(function () { return { ok: true }; });
    }
  };

  /* ---------- owner ---------- */
  function ensureFresh() {
    var t = getToken();
    if (!t) return Promise.reject(err('not_signed_in'));
    if (t.expires_at && Date.now() < t.expires_at * 1000 - 60000) return Promise.resolve(t);
    return req('/auth/v1/token?grant_type=refresh_token', { method: 'POST', body: { refresh_token: t.refresh_token } })
      .then(function (r) { setToken({ access_token: r.access_token, refresh_token: r.refresh_token, expires_at: r.expires_at || Math.floor(Date.now() / 1000) + (r.expires_in || 3600) }); return getToken(); },
        function () { setToken(null); throw err('not_signed_in'); });
  }
  function u(path, opts) { return ensureFresh().then(function () { return req(path, opts, true); }); }
  function patch(table, id, body) { return u('/rest/v1/' + table + '?id=eq.' + encodeURIComponent(id), { method: 'PATCH', body: body, prefer: 'return=representation' }); }
  function urpc(name, args) { return ensureFresh().then(function () { return rpc(name, args, true); }); }
  var cachedSettings = null;

  var admin = {
    needsLogin: true,
    isSignedIn: function () { return !!getToken(); },
    signIn: function (email, password) {
      return req('/auth/v1/token?grant_type=password', { method: 'POST', body: { email: email, password: password } })
        .then(function (r) {
          setToken({ access_token: r.access_token, refresh_token: r.refresh_token, expires_at: r.expires_at || Math.floor(Date.now() / 1000) + (r.expires_in || 3600) });
          return req('/rest/v1/lp_owner?select=user_id', {}, true);
        }, function () { throw err('auth_failed'); })
        .then(function (rows) {
          if (!rows || !rows.length) { setToken(null); throw err('not_owner'); }
          return { ok: true };
        });
    },
    signOut: function () {
      var t = getToken();
      setToken(null);
      if (!t) return Promise.resolve();
      return fetch(URL_ + '/auth/v1/logout', { method: 'POST', headers: { apikey: KEY, Authorization: 'Bearer ' + t.access_token } }).then(function () {}, function () {});
    },
    load: function () {
      var t = ['lp_sessions?select=*&order=starts_at', 'lp_people?select=*', 'lp_bookings?select=*&order=created_at', 'lp_list_members?select=*',
        'lp_leads?select=*&order=created_at.desc', 'lp_feedback?select=*&order=created_at.desc', 'lp_settings?select=*', 'lp_time_off?select=*&order=starts_at',
        'lp_checklist_ticks?select=*'];
      return Promise.all(t.map(function (p) { return u('/rest/v1/' + p); })).then(function (r) {
        var peopleById = {};
        var people = r[1].map(function (p) { var m = mapPerson(p); peopleById[p.id] = m; return m; });
        var st = r[6][0] || {};
        cachedSettings = st;
        var ticks = {}; r[8].forEach(function (x) { ticks[x.item_id] = x.done_at; });
        return {
          sessions: r[0].map(mapSession),
          people: people,
          bookings: r[2].map(function (b) { return mapBooking(b, peopleById); }),
          listMembers: r[3].map(function (l) { var p = peopleById[l.person_id] || {}; return { id: l.id, personId: l.person_id, name: p.name, phone: p.phone, joinedAt: l.joined_at, source: l.source, interest: l.interest, leftAt: l.left_at }; }),
          leads: r[4].map(function (l) { return { id: l.id, kind: l.kind, name: l.name, org: l.org, role: l.role, phone: l.phone, email: l.email, size: l.size, month: l.month, offerId: l.offer_id, stage: l.stage, nextAction: l.next_action, nextDate: l.next_date, source: l.source, createdAt: l.created_at }; }),
          feedback: r[5].map(function (f) { return { id: f.id, sessionId: f.session_id, rating: f.rating, helped: f.helped, change: f.change, quotePermission: f.quote_permission, quoteText: f.quote_text, name: f.first_name, teamInterest: f.team_interest, workEmail: f.work_email, nextDateInterest: f.next_date_interest, createdAt: f.created_at }; }),
          settings: { holdHours: st.hold_hours, reminderAtHours: st.reminder_at_hours, waitlistOfferHours: st.waitlist_offer_hours, publicSeatsLeft: st.public_seats_left, bookingsOpen: st.bookings_open, adminLang: st.admin_lang },
          timeOff: r[7].map(function (x) { return { id: x.id, startsAt: x.starts_at, endsAt: x.ends_at, reason: x.reason }; }),
          ticks: ticks,
          manual: st.manual || {}
        };
      });
    },
    markPaid: function (id, d) { return patch('lp_bookings', id, { status: 'paid', payment_method: d.method || 'cash', amount: d.amount != null && d.amount !== '' ? Number(d.amount) : undefined, paid_at: new Date().toISOString() }); },
    setStatus: function (id, status) { return patch('lp_bookings', id, { status: status }); },
    setHeldUntil: function (id, isoStr) { return patch('lp_bookings', id, { held_until: isoStr }); },
    offerSeat: function (id) { return urpc('lp_offer_seat', { p_booking_id: id }); },
    addBooking: function (d) {
      return urpc('lp_admin_add_booking', { p_session_id: d.sessionId, p_name: d.name, p_phone: d.phone, p_seats: Number(d.seats) === 2 ? 2 : 1,
        p_guest_name: d.guestName || null, p_source: d.source || 'admin', p_paid: !!d.paid, p_method: d.method || null,
        p_amount: d.amount != null && d.amount !== '' ? Number(d.amount) : null, p_email: d.email || null, p_lang: d.lang || 'en' });
    },
    saveSession: function (d) {
      var row = toSessionRow(d);
      if (!row.id) row.id = d.offerId + '-' + String(d.startsAt).slice(0, 10).replace(/-/g, '');
      return u('/rest/v1/lp_sessions?on_conflict=id', { method: 'POST', body: row, prefer: 'resolution=merge-duplicates,return=representation' })
        .then(function (r) { return mapSession(r[0] || row); });
    },
    moveSession: function (oldId, d) {
      return urpc('lp_move_session', { p_old_id: oldId, p_starts_at: d.startsAt, p_ends_at: d.endsAt, p_area_en: d.areaEn || null, p_area_ar: d.areaAr || null })
        .then(function (r) { return { session: { id: r.session_id }, moved: r.moved }; });
    },
    blockTime: function (d) { return u('/rest/v1/lp_time_off', { method: 'POST', body: { starts_at: d.startsAt, ends_at: d.endsAt, reason: d.reason || null } }); },
    removeTimeOff: function (id) { return u('/rest/v1/lp_time_off?id=eq.' + encodeURIComponent(id), { method: 'DELETE' }); },
    setSetting: function (k, v) {
      var col = { holdHours: 'hold_hours', reminderAtHours: 'reminder_at_hours', waitlistOfferHours: 'waitlist_offer_hours', publicSeatsLeft: 'public_seats_left', bookingsOpen: 'bookings_open', adminLang: 'admin_lang' }[k];
      if (!col) return Promise.reject(err('bad_setting'));
      var b = {}; b[col] = v; b.updated_at = new Date().toISOString();
      return patch('lp_settings', 1, b);
    },
    tick: function (itemId, done) {
      if (!done) return u('/rest/v1/lp_checklist_ticks?item_id=eq.' + encodeURIComponent(itemId), { method: 'DELETE' });
      return u('/rest/v1/lp_checklist_ticks?on_conflict=item_id', { method: 'POST', body: { item_id: itemId, week: itemId.split('-')[0] }, prefer: 'resolution=merge-duplicates' });
    },
    setManual: function (k, v) {
      var m = (cachedSettings && cachedSettings.manual) || {};
      m[k] = v === '' ? null : Number(v);
      return patch('lp_settings', 1, { manual: m });
    },
    updatePerson: function (id, p) {
      var b = {};
      if (p.flags) { if ('alumni' in p.flags) b.alumni = !!p.flags.alumni; if ('teamInterest' in p.flags) b.team_interest = !!p.flags.teamInterest; if ('list' in p.flags) b.on_list = !!p.flags.list; }
      if (p.notes != null) b.notes = String(p.notes).slice(0, 2000);
      return patch('lp_people', id, b);
    },
    updateLead: function (id, p) {
      var b = {};
      if ('stage' in p) b.stage = p.stage; if ('nextAction' in p) b.next_action = p.nextAction; if ('nextDate' in p) b.next_date = p.nextDate || null;
      return patch('lp_leads', id, b);
    },
    leaveList: function (id) { return patch('lp_list_members', id, { left_at: new Date().toISOString() }); }
  };

  window.LaunchStores = window.LaunchStores || {};
  window.LaunchStores.supabase = { api: api, admin: admin };
})();
