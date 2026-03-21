/**
 * Top-right strip of active buff/debuff labels for the local player.
 */

export function BuffsDebuffs({ items = [] }) {
  if (!items.length) {
    return (
      <div className="hud-buffs hud-buffs--empty" aria-label="No active buffs">
        —
      </div>
    );
  }
  return (
    <ul className="hud-buffs" aria-label="Active buffs and debuffs">
      {items.map((b) => (
        <li key={b.id} className={`hud-buffs__pill hud-buffs__pill--${b.kind || "buff"}`}>
          {b.label}
        </li>
      ))}
    </ul>
  );
}
