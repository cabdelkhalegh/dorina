/* Dorina Studio — backend configuration.
 *
 * Live. Tables are namespaced public.dorina_* inside the shared project;
 * moving them to a dedicated project later means re-running the migration and
 * changing these two values plus the two GitHub secrets.
 * Both values are SAFE to commit: the publishable/anon key grants nothing on its
 * own — every table is protected by row-level security that requires a signed-in,
 * allow-listed email. The SERVICE key is the dangerous one and never appears here;
 * it lives only in GitHub Actions secrets.
 *
 * While these stay blank the Studio runs in local mode: decisions save on her
 * device and reach AK over WhatsApp, and nothing publishes automatically.
 */
window.DORINA_SUPABASE = {
  url: "https://trxifnxyrncsoxgklwcq.supabase.co",
  key: "sb_publishable_pEhvgX6wRgykl9jMnoALXg_J6susi9F"
};
