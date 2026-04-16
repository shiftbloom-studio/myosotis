"use client";

import { useEffect, useState } from "react";
import { PageIntro } from "@/components/PageIntro";
import { McpServerEditor } from "@/components/McpServerEditor";
import type { McpServer } from "@/lib/validators";

export default function McpServersPage() {
  const [servers, setServers] = useState<Record<string, McpServer> | null>(
    null
  );
  const [error, setError] = useState<string | null>(null);

  async function readServers() {
    const res = await fetch("/api/mcp-servers");
    const json = await res.json();

    if (!res.ok || !json.success) {
      throw new Error(json.error ?? "Failed to load MCP servers");
    }

    return json.data as Record<string, McpServer>;
  }

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const data = await readServers();
        if (cancelled) return;
        setError(null);
        setServers(data);
      } catch (nextError) {
        if (cancelled) return;
        setError(
          nextError instanceof Error
            ? nextError.message
            : "Failed to load MCP servers"
        );
      }
    }

    void load();

    return () => {
      cancelled = true;
    };
  }, []);

  async function handleSave(updated: Record<string, McpServer>) {
    setError(null);
    const res = await fetch("/api/mcp-servers", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ mcpServers: updated }),
    });
    const json = await res.json();
    if (json.success) {
      setServers(json.data);
    } else {
      setError(json.error);
    }
  }

  const serverCount = Object.keys(servers ?? {}).length;
  const envVarCount = Object.values(servers ?? {}).reduce(
    (count, server) => count + Object.keys(server.env ?? {}).length,
    0
  );

  return (
    <div className="space-y-8">
      <PageIntro
        eyebrow="MCP Registry"
        title="Composable MCP profiles, versioned in git."
        description="Manage runtime commands, arguments, and environment placeholders for your MCP stack. Myosotis keeps the source-of-truth in plain files and writes changes back to the shared JSON template plus the individual profiles under mcp/."
        stats={[
          {
            label: "Profiles",
            value: servers ? String(serverCount).padStart(2, "0") : "—",
          },
          {
            label: "Env placeholders",
            value: servers ? String(envVarCount).padStart(2, "0") : "—",
          },
          { label: "File outputs", value: "02" },
        ]}
        details={[
          {
            label: "Template Output",
            value: "templates/global/claude/mcp-servers.json",
          },
          { label: "Profile Directory", value: "mcp/" },
        ]}
      />

      {error ? (
        <div className="rounded-[1.75rem] border border-destructive/20 bg-white/70 p-6 text-sm leading-6 text-destructive shadow-[0_18px_40px_rgba(15,15,15,0.04)]">
          {error}
        </div>
      ) : !servers ? (
        <div className="sb-panel flex h-48 items-center justify-center rounded-[1.75rem] px-6 text-sm text-muted-foreground">
          <svg
            className="mr-2 h-4 w-4 animate-spin"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M21 12a9 9 0 1 1-6.219-8.56" />
          </svg>
          Loading MCP servers…
        </div>
      ) : (
        <McpServerEditor servers={servers} onSave={handleSave} />
      )}
    </div>
  );
}
