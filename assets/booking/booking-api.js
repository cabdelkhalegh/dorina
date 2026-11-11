/* Dorina Launch Pack · window.LaunchBooking: the one interface every page talks to.
   Identical methods in demo mode (this browser only) and Supabase mode. If the config asks for Supabase
   but the URL or key is still a placeholder, it falls back to demo with one console warning.
   Needs: assets/launch-config.js and assets/booking/booking-core.js loaded first.
   Launch Pack · Al Kentawi */
(function () {
  'use strict';
  var CFG = window.LAUNCH_CONFIG || {};
  var isTodo = function (v) { return !v || (typeof v === 'string' && v.charAt(0) === '['); };
  var sb = CFG.supabase || {};
  var mode = CFG.dataMode === 'supabase' && !isTodo(sb.url) && !isTodo(sb.anonKey) ? 'supabase' : 'demo';
  if (CFG.dataMode === 'supabase' && mode === 'demo') {
    try { console.warn('[booking] dataMode is "supabase" but supabase.url or anonKey is a placeholder: using demo mode (this browser only).'); } catch (e) {}
  }
  var me = document.currentScript || document.querySelector('script[src*="booking-api.js"]');
  var base = me && me.src ? me.src.replace(/booking-api\.js.*$/, '') : 'assets/booking/';

  var ready = new Promise(function (resolve, reject) {
    if (window.LaunchStores && window.LaunchStores[mode]) return resolve(window.LaunchStores[mode]);
    var s = document.createElement('script');
    s.src = base + (mode === 'supabase' ? 'store-supabase.js' : 'store-demo.js');
    s.onload = function () { window.LaunchStores && window.LaunchStores[mode] ? resolve(window.LaunchStores[mode]) : reject(code('network')); };
    s.onerror = function () { reject(code('network')); };
    document.head.appendChild(s);
  });
  function code(c) { var e = new Error(c); e.code = c; return e; }
  var KNOWN = { bad_phone: 1, bad_name: 1, session_closed: 1, not_open_yet: 1, priority_window: 1, already_booked: 1, rate_limited: 1, network: 1,
    bad_rating: 1, overlap: 1, not_signed_in: 1, not_owner: 1, auth_failed: 1, no_seat_free: 1, bad_status: 1, not_found: 1 };
  function call(name) {
    return function () {
      var args = arguments;
      return ready.then(function (st) { return st.api[name].apply(st.api, args); }).catch(function (e) {
        if (!e || !KNOWN[e.code]) { var n = code('network'); n.cause = e; throw n; }
        throw e;
      });
    };
  }
  function adminCall(name) {
    return function () {
      var args = arguments;
      return ready.then(function (st) {
        if (!st.admin[name]) throw code('not_available');
        return st.admin[name].apply(st.admin, args);
      });
    };
  }
  var adminNames = ['signIn', 'signOut', 'load', 'markPaid', 'setStatus', 'setHeldUntil', 'offerSeat', 'addBooking', 'saveSession', 'moveSession',
    'blockTime', 'removeTimeOff', 'setSetting', 'tick', 'setManual', 'updatePerson', 'updateLead', 'leaveList', 'reset', 'clearExamples'];
  var adminApi = {
    needsLogin: mode === 'supabase',
    isSignedIn: function () { return mode === 'demo' || !!(window.LaunchStores && window.LaunchStores.supabase && window.LaunchStores.supabase.admin.isSignedIn()); },
    has: function (name) { return ready.then(function (st) { return !!st.admin[name]; }); }
  };
  adminNames.forEach(function (n) { adminApi[n] = adminCall(n); });

  window.LaunchBooking = {
    mode: mode,
    ready: ready.then(function () { return mode; }),
    listSessions: call('listSessions'),
    getSession: call('getSession'),
    settings: call('settings'),
    createBooking: call('createBooking'),
    joinList: call('joinList'),
    createLead: call('createLead'),
    submitFeedback: call('submitFeedback'),
    admin: adminApi
  };
})();
