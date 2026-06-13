import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { isAdminRequest, unauthorizedResponse } from "@/server/adminSession";
import { mutatePool } from "@/server/poolStore";
import type { PaymentStatus } from "@/features/bolao/domain/types";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  if (!isAdminRequest(request)) {
    return unauthorizedResponse();
  }

  const body = await request.json().catch(() => null);
  const paymentStatus = String(body?.paymentStatus ?? "") as PaymentStatus;

  if (paymentStatus !== "paid" && paymentStatus !== "pending") {
    return NextResponse.json({ accepted: false, message: "Status de pagamento invalido." }, { status: 400 });
  }

  const outcome = await mutatePool({
    type: "SET_PAYMENT",
    actor: "Administrador",
    payload: {
      guessId: String(body?.guessId ?? ""),
      paymentStatus
    }
  });

  return NextResponse.json(outcome, {
    status: outcome.accepted ? 200 : 400,
    headers: {
      "Cache-Control": "no-store"
    }
  });
}
