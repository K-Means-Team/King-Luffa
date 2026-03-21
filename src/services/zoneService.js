/**
 * Turf-based hill zones: circle as polygon buffer for booleanPointInPolygon checks.
 */

import * as turf from "@turf/turf";

export function hillPolygonFromCenter(lng, lat, radiusMeters) {
  const pt = turf.point([lng, lat]);
  return turf.buffer(pt, radiusMeters / 1000, { units: "kilometers" });
}

export function isUserInsideHill(lng, lat, hillPolygon) {
  if (!hillPolygon) return false;
  const pt = turf.point([lng, lat]);
  return turf.booleanPointInPolygon(pt, hillPolygon);
}

export function hillToFeatureCollection(polygon) {
  if (!polygon) {
    return { type: "FeatureCollection", features: [] };
  }
  const f = polygon.type === "Feature" ? polygon : turf.feature(polygon);
  return { type: "FeatureCollection", features: [f] };
}
