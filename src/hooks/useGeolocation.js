/**
 * Subscribes to geolocationService stream; exposes latest position and error.
 */

import { useEffect, useState } from "react";
import { startGeolocation } from "../services/geolocationService";

export function useGeolocation() {
  const [position, setPosition] = useState(null);
  const [geoError, setGeoError] = useState(null);

  useEffect(() => {
    const stop = startGeolocation(
      (pos) => {
        setPosition(pos);
        setGeoError(null);
      },
      (err) => setGeoError(err?.message || String(err))
    );
    return stop;
  }, []);

  return { position, geoError };
}
