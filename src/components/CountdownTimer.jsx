/**
 * Match countdown from one hour, displayed as HH:MM:SS at top HUD.
 */

import { useEffect, useState } from "react";

const ONE_HOUR_MS = 60 * 60 * 1000;

function format(ms) {
  if (ms <= 0) return "00:00:00";
  const totalSec = Math.floor(ms / 1000);
  const h = Math.floor(totalSec / 3600);
  const m = Math.floor((totalSec % 3600) / 60);
  const s = totalSec % 60;
  const pad = (n) => String(n).padStart(2, "0");
  return `${pad(h)}:${pad(m)}:${pad(s)}`;
}

export function CountdownTimer({ durationMs = ONE_HOUR_MS }) {
  const [left, setLeft] = useState(durationMs);

  useEffect(() => {
    const start = Date.now();
    const end = start + durationMs;
    const id = setInterval(() => {
      setLeft(Math.max(0, end - Date.now()));
    }, 250);
    return () => clearInterval(id);
  }, [durationMs]);

  return (
    <div className="hud-timer" role="timer" aria-live="polite">
      {format(left)}
    </div>
  );
}
