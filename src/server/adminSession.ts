import "server-only";

import { createHmac, timingSafeEqual } from "node:crypto";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export const adminCookieName = "bolao_admin_session";

function getSessionSecret() {
  return process.env.SESSION_SECRET ?? "bolao-copa-local-session-secret";
}

export function getAdminPin() {
  return process.env.ADMIN_PIN ?? "2026";
}

function sign(value: string) {
  return createHmac("sha256", getSessionSecret()).update(value).digest("base64url");
}

export function createAdminSessionValue() {
  const payload = `admin:${Date.now()}`;
  return `${payload}.${sign(payload)}`;
}

export function isValidAdminSession(value?: string) {
  if (!value) {
    return false;
  }

  const separator = value.lastIndexOf(".");

  if (separator <= 0) {
    return false;
  }

  const payload = value.slice(0, separator);
  const signature = value.slice(separator + 1);
  const expected = sign(payload);

  try {
    return timingSafeEqual(Buffer.from(signature), Buffer.from(expected));
  } catch {
    return false;
  }
}

export function isAdminRequest(request: NextRequest) {
  return isValidAdminSession(request.cookies.get(adminCookieName)?.value);
}

export function unauthorizedResponse() {
  return NextResponse.json(
    { accepted: false, message: "Sessao de administrador invalida." },
    { status: 401 }
  );
}

export function attachAdminCookie(response: NextResponse, sessionValue: string) {
  response.cookies.set(adminCookieName, sessionValue, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 12
  });
  return response;
}
