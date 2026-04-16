import path from "node:path";

const CONFIG_ROOT = process.env.CONFIG_ROOT ?? path.resolve(process.cwd(), "..");

export const paths = {
  root: CONFIG_ROOT,
  mcpDir: path.join(CONFIG_ROOT, "mcp"),
  skillsDir: path.join(CONFIG_ROOT, "skills"),
  globalClaude: path.join(CONFIG_ROOT, "templates/global/claude/CLAUDE.md"),
  globalCodex: path.join(CONFIG_ROOT, "templates/global/codex/AGENTS.md"),
  projectClaude: path.join(CONFIG_ROOT, "templates/project/CLAUDE.md"),
  projectCodex: path.join(CONFIG_ROOT, "templates/project/AGENTS.md"),
  mcpServersJson: path.join(
    CONFIG_ROOT,
    "templates/global/claude/mcp-servers.json"
  ),
} as const;
