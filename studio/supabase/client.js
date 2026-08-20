/* Dorina Studio — Supabase sync (no dependencies, no build step).
 *
 * Why sign-in at all: the Studio page is public (unlisted), and approvals here
 * cause posts to publish automatically. So writes require a signed-in, allow-listed
 * email — enforced by RLS in the database, not by this file.
 *
 * If config.js is absent or blank, everything below no-ops and the Studio keeps
 * working exactly as before: local storage + the WhatsApp handoff.
 */
window.DorinaSync = (function () {
  var CFG = window.DORINA_SUPABASE || {};
  var TOKKEY = 'dorina-studio-session';
  var session = null;
  var listeners = [];

  function configured() { return !!(CFG.url && CFG.key); }

  function loadSession() {
    try { session = JSON.parse(localStorage.getItem(TOKKEY)); } catch (e) { session = null; }
    return session;
  }
  function saveSession(s) {
    session = s;
    try {
      if (s) localStorage.setItem(TOKKEY, JSON.stringify(s));
      else localStorage.removeItem(TOKKEY);
    } catch (e) {}
    listeners.forEach(function (f) { try { f(email()); } catch (e) {} });
  }
  function email() { return session && session.user && session.user.email; }

  /* The magic-link redirect comes back as #access_token=...&refresh_token=... */
  function captureRedirect() {
    if (!location.hash || location.hash.indexOf('access_token') < 0) return false;
    var p = {};
    location.hash.replace(/^#/, '').split('&').forEach(function (kv) {
      var i = kv.indexOf('='); p[kv.slice(0, i)] = decodeURIComponent(kv.slice(i + 1));
    });
    if (!p.access_token) return false;
    history.replaceState(null, '', location.pathname + location.search);
    return fetchUser(p.access_token, p.refresh_token);
  }

  function fetchUser(access, refresh) {
    return fetch(CFG.url + '/auth/v1/user', {
      headers: { apikey: CFG.key, Authorization: 'Bearer ' + access }
    }).then(function (r) { return r.ok ? r.json() : null; })
      .then(function (user) {
        if (!user) return false;
        saveSession({ access_token: access, refresh_token: refresh, user: user });
        return true;
      });
  }

  function rest(path, opts) {
    opts = opts || {};
    var h = { apikey: CFG.key, 'Content-Type': 'application/json' };
    if (session && session.access_token) h.Authorization = 'Bearer ' + session.access_token;
    Object.keys(opts.headers || {}).forEach(function (k) { h[k] = opts.headers[k]; });
    return fetch(CFG.url + '/rest/v1/' + path, {
      method: opts.method || 'GET', headers: h,
      body: opts.body ? JSON.stringify(opts.body) : undefined
    }).then(function (r) {
      if (r.status === 401 || r.status === 403) { saveSession(null); throw new Error('not-authorised'); }
      if (!r.ok) return r.text().then(function (t) { throw new Error(t.slice(0, 200)); });
      return r.status === 204 ? null : r.json();
    });
  }

  return {
    configured: configured,
    email: email,
    onAuthChange: function (f) { listeners.push(f); },

    /* Resolve to the signed-in email, or null. */
    init: function () {
      if (!configured()) return Promise.resolve(null);
      loadSession();
      var maybe = captureRedirect();
      var p = (maybe && maybe.then) ? maybe : Promise.resolve(!!session);
      return p.then(function () { return email() || null; });
    },

    /* Sends the magic link. Resolves true if Supabase accepted the request. */
    signIn: function (addr) {
      if (!configured()) return Promise.resolve(false);
      return fetch(CFG.url + '/auth/v1/otp', {
        method: 'POST',
        headers: { apikey: CFG.key, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: addr,
          create_user: false,           // only pre-registered, allow-listed people
          options: { email_redirect_to: location.origin + location.pathname }
        })
      }).then(function (r) { return r.ok; });
    },

    signOut: function () { saveSession(null); },

    /* {post_id: {status, note}} for everything on the server. */
    pull: function () {
      if (!configured() || !session) return Promise.resolve(null);
      return rest('dorina_post_approvals?select=post_id,status,note').then(function (rows) {
        var out = {};
        (rows || []).forEach(function (r) { out[r.post_id] = { status: r.status, note: r.note || '' }; });
        return out;
      });
    },

    /* Upsert one decision. */
    push: function (postId, state, meta) {
      if (!configured() || !session) return Promise.resolve(false);
      return rest('dorina_post_approvals?on_conflict=post_id', {
        method: 'POST',
        headers: { Prefer: 'resolution=merge-duplicates,return=minimal' },
        body: [{
          post_id: postId,
          status: state.status || 'waiting',
          note: state.note || '',
          title: (meta && meta.title) || null,
          lang: (meta && meta.lang) || null
        }]
      }).then(function () { return true; });
    },

    /* What actually went out, so the Studio can show it. */
    log: function () {
      if (!configured() || !session) return Promise.resolve([]);
      return rest('dorina_publish_log?select=post_id,platform,status,published_at&order=published_at.desc&limit=50')
        .catch(function () { return []; });
    }
  };
})();
