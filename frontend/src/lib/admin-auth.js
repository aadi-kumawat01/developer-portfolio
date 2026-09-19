import { createHmac, randomBytes, scrypt as scryptCallback, timingSafeEqual } from "node:crypto";
import { promisify } from "node:util";

const scrypt = promisify(scryptCallback);
export const SESSION_COOKIE = "portfolio_admin_session";
export const SESSION_SECONDS = 60 * 60 * 8;

function secret() {
  const value = process.env.ADMIN_SESSION_SECRET;
  if (!value || value.length < 32) throw new Error("ADMIN_SESSION_SECRET must contain at least 32 characters.");
  return value;
}

function safeEqual(a, b) {
  const left = Buffer.from(a);
  const right = Buffer.from(b);
  return left.length === right.length && timingSafeEqual(left, right);
}

export async function validAdminCredentials(username, password) {
  const configuredName = process.env.ADMIN_USERNAME;
  const hash = process.env.ADMIN_PASSWORD_HASH;
  if (!configuredName || !hash) throw new Error("Admin credentials are not configured.");

  const [algorithm, salt, expectedHex] = hash.split(":");
  if (algorithm !== "scrypt" || !salt || !/^[a-f\d]{128}$/i.test(expectedHex || "")) {
    throw new Error("ADMIN_PASSWORD_HASH has an invalid format.");
  }

  const actual = await scrypt(String(password), salt, 64);
  return safeEqual(String(username), configuredName) && timingSafeEqual(actual, Buffer.from(expectedHex, "hex"));
}

export function createAdminSession() {
  const expires = Math.floor(Date.now() / 1000) + SESSION_SECONDS;
  const payload = `${expires}.${randomBytes(16).toString("hex")}`;
  const signature = createHmac("sha256", secret()).update(payload).digest("hex");
  return `${payload}.${signature}`;
}

export function validAdminSession(value) {
  if (!value) return false;
  const parts = value.split(".");
  if (parts.length !== 3 || !/^\d+$/.test(parts[0]) || !/^[a-f\d]{32}$/i.test(parts[1]) || !/^[a-f\d]{64}$/i.test(parts[2])) return false;
  const expires = Number(parts[0]);
  if (!Number.isSafeInteger(expires) || expires <= Date.now() / 1000) return false;
  try {
    const expected = createHmac("sha256", secret()).update(`${parts[0]}.${parts[1]}`).digest("hex");
    return safeEqual(parts[2], expected);
  } catch {
    return false;
  }
}

export function isSameOrigin(request) {
  const origin = request.headers.get("origin");
  return Boolean(origin) && origin === new URL(request.url).origin;
}

export function isAdminRequest(request) {
  return validAdminSession(request.cookies.get(SESSION_COOKIE)?.value);
}
