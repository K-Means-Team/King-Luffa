/**
 * Bottom-left avatar control that toggles the account sidebar.
 */

export function ProfileButton({ onClick, label = "Account" }) {
  return (
    <button
      type="button"
      className="hud-profile"
      onClick={onClick}
      aria-label={label}
    >
      <span className="hud-profile__avatar" />
    </button>
  );
}
