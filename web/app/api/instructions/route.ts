import { NextResponse } from "next/server";
import fs from "node:fs/promises";
import { paths } from "@/lib/config-paths";

const FILES: Record<string, string> = {
  "global-claude": paths.globalClaude,
  "global-codex": paths.globalCodex,
  "project-claude": paths.projectClaude,
  "project-codex": paths.projectCodex,
};

export async function GET() {
  try {
    const entries: Record<string, string> = {};
    for (const [key, filePath] of Object.entries(FILES)) {
      try {
        entries[key] = await fs.readFile(filePath, "utf-8");
      } catch {
        entries[key] = "";
      }
    }
    return NextResponse.json({ success: true, data: entries });
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Failed to read instructions";
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const body: Record<string, string> = await request.json();

    for (const [key, content] of Object.entries(body)) {
      const filePath = FILES[key];
      if (!filePath) {
        return NextResponse.json(
          { success: false, error: `Unknown instruction file: ${key}` },
          { status: 400 }
        );
      }
      await fs.writeFile(filePath, content, "utf-8");
    }

    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    const message =
      error instanceof Error
        ? error.message
        : "Failed to update instructions";
    return NextResponse.json(
      { success: false, error: message },
      { status: 400 }
    );
  }
}
