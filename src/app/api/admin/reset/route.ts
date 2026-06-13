import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { isAdminRequest, unauthorizedResponse } from "@/server/adminSession";
import { mutatePool } from "@/server/poolStore";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  if (!isAdminRequest(request)) {
    return unauthorizedResponse();
  }

  const outcome = await mutatePool({
    type: "RESET_POOL",
    actor: "Administrador"
  });

  return NextResponse.json(outcome, {
    status: outcome.accepted ? 200 : 400,
    headers: {
      "Cache-Control": "no-store"
    }
  });
}
