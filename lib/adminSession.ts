import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

export const ADMIN_COOKIE = "sc_board_admin";
export const ADMIN_SESSION_MAX_AGE = 60 * 60 * 8;
const SESSION_VERSION = "sc-board-admin-v1";

function signingSecret() {
  const secret = process.env.ADMIN_SESSION_SECRET;
  if (!secret || secret.length < 32) {
    throw new Error("ADMIN_SESSION_SECRET은 32자 이상으로 설정해야 합니다.");
  }
  return secret;
}

function signature(value: string) {
  return createHmac("sha256", signingSecret())
    .update(value)
    .digest("hex");
}

export function createAdminSessionToken() {
  const expiresAt = Math.floor(Date.now() / 1000) + ADMIN_SESSION_MAX_AGE;
  const payload = `${SESSION_VERSION}.${expiresAt}`;
  return `${payload}.${signature(payload)}`;
}

export async function isAdminRequest() {
  const token = (await cookies()).get(ADMIN_COOKIE)?.value;
  if (!token) return false;

  const [version, rawExpiresAt, suppliedSignature] = token.split(".");
  const expiresAt = Number(rawExpiresAt);
  if (
    version !== SESSION_VERSION ||
    !Number.isSafeInteger(expiresAt) ||
    expiresAt <= Math.floor(Date.now() / 1000) ||
    !/^[a-f0-9]{64}$/.test(suppliedSignature ?? "")
  ) {
    return false;
  }

  const expectedSignature = signature(`${version}.${rawExpiresAt}`);
  const left = Buffer.from(suppliedSignature, "hex");
  const right = Buffer.from(expectedSignature, "hex");

  return left.length === right.length && timingSafeEqual(left, right);
}
