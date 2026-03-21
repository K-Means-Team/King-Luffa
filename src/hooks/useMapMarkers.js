/**
 * Throttles raw GPS for map follow-updates to avoid excessive React/map work (not full map remount).
 */

import { useEffect, useRef, useState } from "react";

const MAP_THROTTLE_MS = 500;

export function useMapMarkers(position) {
  const [smoothed, setSmoothed] = useState(null);
  const lastEmit = useRef(0);
  const pending = useRef(null);
  const timer = useRef(null);

  useEffect(() => {
    if (position == null || position.lng == null || position.lat == null) return;

    const apply = () => {
      timer.current = null;
      const p = pending.current;
      if (p) setSmoothed({ ...p });
    };

    const now = Date.now();
    pending.current = position;
    if (now - lastEmit.current >= MAP_THROTTLE_MS) {
      lastEmit.current = now;
      setSmoothed({ ...position });
      pending.current = null;
      return;
    }
    if (!timer.current) {
      timer.current = setTimeout(() => {
        lastEmit.current = Date.now();
        apply();
      }, MAP_THROTTLE_MS - (now - lastEmit.current));
    }
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, [position]);

  return smoothed;
}
