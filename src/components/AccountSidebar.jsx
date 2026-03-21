/**
 * Slide-in account panel: session summary and logout; closes on overlay click.
 */

export function AccountSidebar({ open, onClose, session, onLogout }) {
  if (!open) return null;
  return (
    <>
      <div className="sidebar-backdrop" role="button" tabIndex={0} onClick={onClose} onKeyDown={(e) => e.key === 'Escape' && onClose()} aria-label="Close" />
      <aside className="sidebar-panel" role="dialog" aria-label="Account">
        <h2 className="sidebar-panel__title">
          <span>Account</span>
          <button className="sidebar-panel__close" onClick={onClose}>×</button>
        </h2>
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
