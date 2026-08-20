/* Dorina Studio — backend configuration.
 *
 * Fill these in once the Supabase project exists (studio/RUNBOOK.md §6).
 * Both values are SAFE to commit: the publishable/anon key grants nothing on its
 * own — every table is protected by row-level security that requires a signed-in,
 * allow-listed email. The SERVICE key is the dangerous one and never appears here;
 * it lives only in GitHub Actions secrets.
 *
 * While these stay blank the Studio runs in local mode: decisions save on her
 * device and reach AK over WhatsApp, and nothing publishes automatically.
 */
window.DORINA_SUPABASE = {
  url: "",   // e.g. https://xxxxxxxxxxxx.supabase.co
  key: ""    // publishable / anon key
};
