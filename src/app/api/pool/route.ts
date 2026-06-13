import { NextResponse } from "next/server";
import { getServerNow, readPool } from "@/server/poolStore";

export const runtime = "nodejs";

export async function GET() {
  const pool = await readPool();

  return NextResponse.json(
    {
      pool,
      serverNow: getServerNow().toISOString()
    },
    {
      headers: {
        "Cache-Control": "no-store"
      }
    }
  );
}
