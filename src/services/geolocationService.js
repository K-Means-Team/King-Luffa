/**
 * Location stream for SuperBox/Luffa web-view: prefers Luffa.Geolocation.watchPosition,
 * else polls wx.getLocation. No navigator.geolocation in production builds.
 * Dev without wx uses a slow mock drift for map testing.
 */

import { isDev } from "../config";

const POLL_MS = 1500;
const DEV_MOCK_MS = 2000;

function hasWx() {
  return typeof window !== "undefined" && typeof window.wx?.getLocation === "function";
}

function hasLuffaWatch() {
  return (
    typeof window !== "undefined" &&
    typeof window.Luffa?.Geolocation?.watchPosition === "function"
  );
}

function wxGetLocation() {
  return new Promise((resolve, reject) => {
    window.wx.getLocation({
      type: "wgs84",
      altitude: true,
      success: (res) =>
        resolve({
          lng: res.longitude,
          lat: res.latitude,
          accuracy: res.accuracy ?? res.horizontalAccuracy,
        }),
      fail: reject,
    });
  });
}

export function startGeolocation(onPosition, onError) {
  let stopped = false;
  let timer = null;
  let watchId = null;

  const safeEmit = (pos) => {
    if (!stopped && pos?.lng != null && pos?.lat != null) onPosition(pos);
  };

  const fail = (err) => {
    if (!stopped) onError?.(err);
  };

  if (hasLuffaWatch()) {
    watchId = window.Luffa.Geolocation.watchPosition(
      (res) =>
        safeEmit({
          lng: res.longitude ?? res.lng,
          lat: res.latitude ?? res.lat,
          accuracy: res.accuracy,
        }),
      fail,
      { enableHighAccuracy: true }
    );
    return () => {
      stopped = true;
      if (typeof window.Luffa?.Geolocation?.clearWatch === "function" && watchId != null) {
        window.Luffa.Geolocation.clearWatch(watchId);
      }
    };
  }

  if (hasWx()) {
    const tick = () => {
      if (stopped) return;
      wxGetLocation().then(safeEmit).catch(fail);
    };
    tick();
    timer = setInterval(tick, POLL_MS);
    return () => {
      stopped = true;
      if (timer) clearInterval(timer);
    };
  }

  if (isDev) {
    let lng = -122.4194;
    let lat = 37.7749;
    const tick = () => {
      if (stopped) return;
      lat += (Math.random() - 0.5) * 0.00005;
      lng += (Math.random() - 0.5) * 0.00005;
      safeEmit({ lng, lat, accuracy: 12 });
    };
    tick();
    timer = setInterval(tick, DEV_MOCK_MS);
    return () => {
      stopped = true;
      if (timer) clearInterval(timer);
    };
  }

  fail(new Error("Luffa/wx geolocation not available"));
  return () => {
    stopped = true;
  };
}
