import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { isAdminRequest, unauthorizedResponse } from "@/server/adminSession";
import { mutatePool } from "@/server/poolStore";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  if (!isAdminRequest(request)) {
    return unauthorizedResponse();
  }

  const body = await request.json().catch(() => null);
  const outcome = await mutatePool({
    type: "PUBLISH_RESULT",
    actor: "Administrador",
    payload: {
      homeScore: Number(body?.homeScore),
      awayScore: Number(body?.awayScore)
    }
  });

  return NextResponse.json(outcome, {
    status: outcome.accepted ? 200 : 400,
    headers: {
      "Cache-Control": "no-store"
    }
  });
}
