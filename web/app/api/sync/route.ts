import { NextResponse } from "next/server";
import { commitAndPush, getStatus } from "@/lib/git";

export async function GET() {
  try {
    const status = await getStatus();
    return NextResponse.json({ success: true, data: status });
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Failed to get git status";
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const message =
      (body as { message?: string }).message ??
      "chore: update myosotis workspace";

    const result = await commitAndPush(message);
    return NextResponse.json({ success: true, data: result });
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Failed to sync";
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}
