/**
 * REST calls for King Luffa session against LuffaKing_Backend.
 * Initializes session with userToken; aligns with POST /api/session.
 */

import { apiUrl } from "../config";

const base = () => apiUrl;

export async function initSession(userToken) {
  const res = await fetch(`${base()}/api/session`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userToken }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const msg = data?.message || data?.error || res.statusText;
    throw new Error(msg || "Session failed");
  }
  return data.data ?? data;
}

export async function logoutSession(accessToken) {
  if (!accessToken) return;
  await fetch(`${base()}/api/session/logout`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
  }).catch(() => {});
}
