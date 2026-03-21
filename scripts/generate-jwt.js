#!/usr/bin/env node
/**
 * Generate a JWT for connecting to LuffaKing_Backend.
 * Matches backend config: JWT_ISSUER, JWT_AUDIENCE, JWT_ACCESS_SECRET / JWT_REFRESH_SECRET.
 *
 * Usage:
 *   node scripts/generate-jwt.js
 *   node scripts/generate-jwt.js --type=access
 *   node scripts/generate-jwt.js --type=refresh --sub=user-123
 *
 * Set env vars (or create .env in scripts/ with dotenv):
 *   JWT_REFRESH_SECRET  - backend refresh secret (default for userToken)
 *   JWT_ACCESS_SECRET   - backend access secret (use with --type=access)
 *   JWT_ISSUER          - defaults to LuffaDevApp
 *   JWT_AUDIENCE        - defaults to LuffaUsers
 */

import crypto from "crypto";

const base64url = (buf) =>
  Buffer.from(buf)
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");

function sign(secret, payload) {
  const header = { alg: "HS256", typ: "JWT" };
  const headerB64 = base64url(Buffer.from(JSON.stringify(header)));
  const payloadB64 = base64url(Buffer.from(JSON.stringify(payload)));
  const toSign = `${headerB64}.${payloadB64}`;
  const sig = crypto.createHmac("sha256", secret).update(toSign).digest();
  return `${toSign}.${base64url(sig)}`;
}

const args = process.argv.slice(2);
const typeArg = args.find((a) => a.startsWith("--type="));
const subArg = args.find((a) => a.startsWith("--sub="));

const tokenType = typeArg?.split("=")[1] || "refresh";
const sub = subArg?.split("=")[1] || `dev-user-${Date.now()}`;

const issuer = process.env.JWT_ISSUER || "LuffaDevApp";
const audience = process.env.JWT_AUDIENCE || "LuffaUsers";
const secret =
  tokenType === "access"
    ? process.env.JWT_ACCESS_SECRET || "your_access_token_secret_key_here_change_in_production"
    : process.env.JWT_REFRESH_SECRET || "your_refresh_token_secret_key_here_change_in_production";

const now = Math.floor(Date.now() / 1000);
const expHours = tokenType === "access" ? 6 : 24 * 7; // 6h access, 7d refresh
const payload = {
  sub,
  iss: issuer,
  aud: audience,
  iat: now,
  exp: now + expHours * 3600,
};

const token = sign(secret, payload);

console.log(`\nGenerated ${tokenType} JWT (sub=${sub}):\n`);
console.log(token);
console.log("\nPaste this as the user token in the King Luffa login screen.\n");
