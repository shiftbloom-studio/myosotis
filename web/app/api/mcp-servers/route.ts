import { NextResponse } from "next/server";
import fs from "node:fs/promises";
import path from "node:path";
import { paths } from "@/lib/config-paths";
import { mcpServersFileSchema, type McpServersFile } from "@/lib/validators";

async function readMcpServers(): Promise<McpServersFile> {
  const raw = await fs.readFile(paths.mcpServersJson, "utf-8");
  return mcpServersFileSchema.parse(JSON.parse(raw));
}

async function writeMcpServers(data: McpServersFile): Promise<void> {
  await fs.writeFile(
    paths.mcpServersJson,
    JSON.stringify(data, null, 2) + "\n",
    "utf-8"
  );

  // Also write individual profile files under mcp/
  await fs.mkdir(paths.mcpDir, { recursive: true });
  for (const [name, server] of Object.entries(data.mcpServers)) {
    const profilePath = path.join(paths.mcpDir, `${name}.json`);
    const profile = {
      command: server.command,
      args: server.args,
      env: server.env ?? {},
      ...(server.description ? { description: server.description } : {}),
    };
    await fs.writeFile(
      profilePath,
      JSON.stringify(profile, null, 2) + "\n",
      "utf-8"
    );
  }

  // Remove orphan profile files
  const files = await fs.readdir(paths.mcpDir);
  const validNames = new Set(Object.keys(data.mcpServers));
  for (const file of files) {
    if (file === "README.md") continue;
    const name = path.basename(file, ".json");
    if (!validNames.has(name)) {
      await fs.unlink(path.join(paths.mcpDir, file));
    }
  }
}

export async function GET() {
  try {
    const data = await readMcpServers();
    return NextResponse.json({ success: true, data: data.mcpServers });
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Failed to read MCP servers";
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { mcpServers } = mcpServersFileSchema.parse(body);
    const data: McpServersFile = { mcpServers };
    await writeMcpServers(data);
    return NextResponse.json({ success: true, data: mcpServers });
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Failed to update MCP servers";
    return NextResponse.json(
      { success: false, error: message },
      { status: 400 }
    );
  }
}
