import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { attachAdminCookie, createAdminSessionValue, getAdminPin } from "@/server/adminSession";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);
  const pin = String(body?.pin ?? "");

  if (pin !== getAdminPin()) {
    return NextResponse.json({ accepted: false, message: "PIN invalido." }, { status: 401 });
  }

  const response = NextResponse.json({ accepted: true, message: "Administrador autenticado." });
  return attachAdminCookie(response, createAdminSessionValue());
}
