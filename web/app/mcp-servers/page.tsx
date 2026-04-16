"use client";

import { useEffect, useState } from "react";
import { McpServerEditor } from "@/components/McpServerEditor";
import type { McpServer } from "@/lib/validators";

export default function McpServersPage() {
  const [servers, setServers] = useState<Record<string, McpServer> | null>(
    null
  );
  const [error, setError] = useState<string | null>(null);

  async function fetchServers() {
    try {
      const res = await fetch("/api/mcp-servers");
      const json = await res.json();
      if (json.success) {
        setServers(json.data);
      } else {
        setError(json.error);
      }
    } catch {
      setError("Failed to load MCP servers");
    }
  }

  useEffect(() => {
    fetchServers();
  }, []);

  async function handleSave(updated: Record<string, McpServer>) {
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

  if (error) {
    return (
      <div className="rounded-2xl border border-destructive/30 bg-destructive/5 p-5 text-sm text-destructive">
        {error}
      </div>
    );
  }

  if (!servers) {
    return (
      <div className="flex h-40 items-center justify-center text-sm text-muted-foreground">
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
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">
          MCP Server Profiles
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Manage canonical MCP server profiles shared across the team. Changes
          update{" "}
          <code className="rounded-md bg-muted/60 px-1.5 py-0.5 font-mono text-xs">
            mcp/
          </code>{" "}
          and{" "}
          <code className="rounded-md bg-muted/60 px-1.5 py-0.5 font-mono text-xs">
            templates/global/claude/mcp-servers.json
          </code>
          .
        </p>
      </div>
      <McpServerEditor servers={servers} onSave={handleSave} />
    </div>
  );
}
