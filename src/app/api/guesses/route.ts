import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { mutatePool } from "@/server/poolStore";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);

  const outcome = await mutatePool({
    type: "REGISTER_GUESS",
    actor: "Apostador",
    payload: {
      participantName: String(body?.participantName ?? ""),
      homeScore: Number(body?.homeScore),
      awayScore: Number(body?.awayScore)
    }
  });

  return NextResponse.json(outcome, {
    status: outcome.accepted ? 201 : 400,
    headers: {
      "Cache-Control": "no-store"
    }
  });
}
