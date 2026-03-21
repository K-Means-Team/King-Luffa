/**
 * Hill capture grace period: user must stay inside Turf polygon ~2.5s before captured=true.
 */

import { useEffect, useRef, useState } from "react";
import { isUserInsideHill } from "../services/zoneService";

const GRACE_MS = 2500;
const TICK_MS = 200;

export function useZoneCapture(position, hillPolygon) {
  const [captured, setCaptured] = useState(false);
  const insideSince = useRef(null);
  const posRef = useRef(position);
  posRef.current = position;

  useEffect(() => {
    const id = setInterval(() => {
      const p = posRef.current;
      if (p == null || p.lng == null || p.lat == null || !hillPolygon) {
        insideSince.current = null;
        setCaptured(false);
        return;
      }
      const inside = isUserInsideHill(p.lng, p.lat, hillPolygon);
      const now = Date.now();
      if (inside) {
        if (insideSince.current == null) insideSince.current = now;
        if (now - insideSince.current >= GRACE_MS) setCaptured(true);
      } else {
        insideSince.current = null;
        setCaptured(false);
      }
    }, TICK_MS);
    return () => clearInterval(id);
  }, [hillPolygon]);

  return captured;
}
