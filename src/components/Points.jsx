/**
 * Bottom-right score readout for King Luffa points.
 */

export function Points({ value = 0 }) {
  return (
    <div className="hud-points" aria-live="polite">
      <span className="hud-points__label">Points</span>
      <span className="hud-points__value">{value}</span>
    </div>
  );
}
