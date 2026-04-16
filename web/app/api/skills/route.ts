import { NextResponse } from "next/server";
import fs from "node:fs/promises";
import path from "node:path";
import { paths } from "@/lib/config-paths";

interface SkillEntry {
  name: string;
  content: string;
}

async function readSkills(): Promise<SkillEntry[]> {
  const entries = await fs.readdir(paths.skillsDir, { withFileTypes: true });
  const skills: SkillEntry[] = [];

  for (const entry of entries) {
    if (!entry.isDirectory()) continue;
    const skillPath = path.join(paths.skillsDir, entry.name, "SKILL.md");
    try {
      const content = await fs.readFile(skillPath, "utf-8");
      skills.push({ name: entry.name, content });
    } catch {
      // Skip directories without SKILL.md
    }
  }

  return skills.sort((a, b) => a.name.localeCompare(b.name));
}

export async function GET() {
  try {
    const skills = await readSkills();
    return NextResponse.json({ success: true, data: skills });
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Failed to read skills";
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const { name, content } = await request.json();

    if (!name || !/^[a-z0-9-]+$/.test(name)) {
      return NextResponse.json(
        { success: false, error: "Invalid skill name (lowercase, hyphens only)" },
        { status: 400 }
      );
    }

    const skillDir = path.join(paths.skillsDir, name);
    await fs.mkdir(skillDir, { recursive: true });
    await fs.writeFile(path.join(skillDir, "SKILL.md"), content, "utf-8");

    return NextResponse.json({ success: true, data: { name, content } });
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Failed to create skill";
    return NextResponse.json(
      { success: false, error: message },
      { status: 400 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const { name, content } = await request.json();
    const skillPath = path.join(paths.skillsDir, name, "SKILL.md");

    await fs.access(skillPath);
    await fs.writeFile(skillPath, content, "utf-8");

    return NextResponse.json({ success: true, data: { name, content } });
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Failed to update skill";
    return NextResponse.json(
      { success: false, error: message },
      { status: 400 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const { name } = await request.json();
    const skillDir = path.join(paths.skillsDir, name);

    await fs.rm(skillDir, { recursive: true, force: true });

    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Failed to delete skill";
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}
