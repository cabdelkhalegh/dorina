/* Dorina Studio — backend sync. No dependencies, no build step.
 *
 * Three modes, chosen automatically:
 *
 *   link   — the page was opened with ?k=<token>. All reads and writes go
 *            through security-definer RPCs that validate the token in the
 *            database. This is Dorina's path: no sign-in, no email, no code.
 *   email  — a magic-link session exists (kept for AK; needs the redirect URL
 *            allow-listed in the Supabase dashboard).
 *   local  — no backend configured or no token. The Studio still works fully;
 *            decisions save on the device and reach AK over WhatsApp.
 *
 * Security notes:
 *  - only the SHA-256 hash of the token is stored server-side
 *  - the token is stripped from the URL on first load and kept in localStorage,
 *    so it does not sit in history, referrers or screenshots
 *  - the anon key alone grants nothing: RLS denies direct table access, and the
 *    RPCs refuse any call without a valid token
 */
window.DorinaSync = (function () {
  var CFG = window.DORINA_SUPABASE || {};
  var TOKKEY = 'dorina-studio-session';
  var LINKKEY = 'dorina-studio-link';
  var session = null;
  var linkToken = null;

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
  }
  function email() { return session && session.user && session.user.email; }

  /* ---- private link ---------------------------------------------------- */
  function captureLink() {
    var m = /[?&]k=([A-Za-z0-9_-]{16,128})/.exec(location.search);
    if (m) {
      linkToken = m[1];
      try { localStorage.setItem(LINKKEY, linkToken); } catch (e) {}
      // Keep the token out of history, referrers and screenshots.
      var clean = location.pathname + location.search.replace(/([?&])k=[^&]*/, '$1').replace(/[?&]$/, '');
      history.replaceState(null, '', clean);
      return;
    }
    try { linkToken = localStorage.getItem(LINKKEY) || null; } catch (e) { linkToken = null; }
  }

  /* ---- magic-link session (AK) ----------------------------------------- */
  function captureRedirect() {
    if (!location.hash || location.hash.indexOf('access_token') < 0) return false;
    var p = {};
    location.hash.replace(/^#/, '').split('&').forEach(function (kv) {
      var i = kv.indexOf('='); p[kv.slice(0, i)] = decodeURIComponent(kv.slice(i + 1));
    });
    if (!p.access_token) return false;
    history.replaceState(null, '', location.pathname + location.search);
    return fetch(CFG.url + '/auth/v1/user', {
      headers: { apikey: CFG.key, Authorization: 'Bearer ' + p.access_token }
    }).then(function (r) { return r.ok ? r.json() : null; })
      .then(function (user) {
        if (!user) return false;
        saveSession({ access_token: p.access_token, refresh_token: p.refresh_token, user: user });
        return true;
      });
  }

  function headers(extra) {
    var h = { apikey: CFG.key, 'Content-Type': 'application/json' };
    if (session && session.access_token) h.Authorization = 'Bearer ' + session.access_token;
    Object.keys(extra || {}).forEach(function (k) { h[k] = extra[k]; });
    return h;
  }

  function rpc(fn, args) {
    return fetch(CFG.url + '/rest/v1/rpc/' + fn, {
      method: 'POST', headers: headers(), body: JSON.stringify(args)
    }).then(function (r) {
      if (r.status === 401 || r.status === 403) {
        // A revoked or wrong link should stop pretending to be connected.
        try { localStorage.removeItem(LINKKEY); } catch (e) {}
        linkToken = null;
        throw new Error('link-rejected');
      }
      if (!r.ok) return r.text().then(function (t) { throw new Error(t.slice(0, 200)); });
      return r.status === 204 ? null : r.json();
    });
  }

  function rest(path, opts) {
    opts = opts || {};
    return fetch(CFG.url + '/rest/v1/' + path, {
      method: opts.method || 'GET',
      headers: headers(opts.headers),
      body: opts.body ? JSON.stringify(opts.body) : undefined
    }).then(function (r) {
      if (r.status === 401 || r.status === 403) { saveSession(null); throw new Error('not-authorised'); }
      if (!r.ok) return r.text().then(function (t) { throw new Error(t.slice(0, 200)); });
      return r.status === 204 ? null : r.json();
    });
  }

  function mode() {
    if (!configured()) return 'local';
    if (linkToken) return 'link';
    if (session) return 'email';
    return 'local';
  }

  return {
    configured: configured,
    mode: mode,
    email: email,
    hasLink: function () { return !!linkToken; },

    init: function () {
      if (!configured()) return Promise.resolve('local');
      captureLink();
      loadSession();
      var maybe = captureRedirect();
      var p = (maybe && maybe.then) ? maybe : Promise.resolve(true);
      return p.then(function () {
        // Prove the link still works before claiming to be connected.
        if (linkToken) {
          return rpc('dorina_get_approvals', { p_token: linkToken })
            .then(function () { return 'link'; })
            .catch(function () { return mode(); });
        }
        return mode();
      });
    },

    signIn: function (addr) {
      if (!configured()) return Promise.resolve(false);
      return fetch(CFG.url + '/auth/v1/otp', {
        method: 'POST',
        headers: { apikey: CFG.key, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: addr,
          create_user: false,
          options: { email_redirect_to: location.origin + location.pathname }
        })
      }).then(function (r) { return r.ok; });
    },

    signOut: function () {
      saveSession(null);
      try { localStorage.removeItem(LINKKEY); } catch (e) {}
      linkToken = null;
    },

    /* {post_id: {status, note}} */
    pull: function () {
      var m = mode();
      if (m === 'local') return Promise.resolve(null);
      var p = (m === 'link')
        ? rpc('dorina_get_approvals', { p_token: linkToken })
        : rest('dorina_post_approvals?select=post_id,status,note');
      return p.then(function (rows) {
        var out = {};
        (rows || []).forEach(function (r) { out[r.post_id] = { status: r.status, note: r.note || '' }; });
        return out;
      });
    },

    push: function (postId, state, meta) {
      var m = mode();
      if (m === 'local') return Promise.resolve(false);
      if (m === 'link') {
        return rpc('dorina_set_approval', {
          p_token: linkToken,
          p_post_id: postId,
          p_status: state.status || 'waiting',
          p_note: state.note || '',
          p_title: (meta && meta.title) || null,
          p_lang: (meta && meta.lang) || null
        }).then(function () { return true; });
      }
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

    log: function () {
      var m = mode();
      if (m === 'local') return Promise.resolve([]);
      var p = (m === 'link')
        ? rpc('dorina_get_log', { p_token: linkToken })
        : rest('dorina_publish_log?select=post_id,platform,status,published_at&order=published_at.desc&limit=50');
      return p.catch(function () { return []; });
    }
  };
})();
