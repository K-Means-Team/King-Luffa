/**
 * Slide-in account panel: session summary and logout; closes on overlay click.
 */

export function AccountSidebar({ open, onClose, session, onLogout }) {
  if (!open) return null;
  return (
    <>
      <button type="button" className="sidebar-backdrop" aria-label="Close" onClick={onClose} />
      <aside className="sidebar-panel" role="dialog" aria-label="Account">
        <h2 className="sidebar-panel__title">Account</h2>
        <dl className="sidebar-panel__dl">
          <dt>Session</dt>
          <dd>{session?.sessionId || "—"}</dd>
          <dt>User token</dt>
          <dd className="sidebar-panel__mono">{session?.userToken ? "••••" + String(session.userToken).slice(-6) : "—"}</dd>
        </dl>
        <button type="button" className="sidebar-panel__logout" onClick={onLogout}>
          Log out
        </button>
      </aside>
    </>
  );
}
