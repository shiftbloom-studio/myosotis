import { NextResponse } from "next/server";
import fs from "node:fs/promises";
import path from "node:path";
import { paths } from "@/lib/config-paths";
import { mcpServersFileSchema, type McpServersFile } from "@/lib/validators";

const MCP_SERVER_NAME_PATTERN = /^[a-z0-9_-]+$/;

function getMcpProfilePath(name: string): string {
  if (!MCP_SERVER_NAME_PATTERN.test(name)) {
    throw new Error("Invalid MCP server name");
  }

  const root = path.resolve(paths.mcpDir);
  const profilePath = path.resolve(root, `${name}.json`);
  if (!profilePath.startsWith(`${root}${path.sep}`)) {
    throw new Error("Invalid MCP server path");
  }

  return profilePath;
}

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
    const profilePath = getMcpProfilePath(name);
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
  const files = await fs.readdir(paths.mcpDir, { withFileTypes: true });
  const validNames = new Set(Object.keys(data.mcpServers));
  for (const file of files) {
    if (!file.isFile() || !file.name.endsWith(".json")) continue;

    const name = path.basename(file.name, ".json");
    if (!validNames.has(name)) {
      try {
        await fs.unlink(path.join(paths.mcpDir, file.name));
      } catch {
        // Ignore delete failures for non-critical orphan cleanup.
      }
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
