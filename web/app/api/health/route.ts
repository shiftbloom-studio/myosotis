import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    ok: true,
    service: "shiftbloom-archon-team-setup",
    timestamp: new Date().toISOString(),
  });
}
