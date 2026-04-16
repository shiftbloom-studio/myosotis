"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import type { McpServer } from "@/lib/validators";

interface McpServerEditorProps {
  servers: Record<string, McpServer>;
  onSave: (servers: Record<string, McpServer>) => Promise<void>;
}

interface ServerFormState {
  name: string;
  command: string;
  args: string;
  env: Record<string, string>;
  description: string;
}

function emptyForm(): ServerFormState {
  return { name: "", command: "npx", args: "", env: {}, description: "" };
}

function serverToForm(name: string, server: McpServer): ServerFormState {
  return {
    name,
    command: server.command,
    args: server.args.join(" "),
    env: server.env ?? {},
    description: server.description ?? "",
  };
}

export function McpServerEditor({ servers, onSave }: McpServerEditorProps) {
  const [editing, setEditing] = useState<string | null>(null);
  const [form, setForm] = useState<ServerFormState>(emptyForm());
  const [newEnvKey, setNewEnvKey] = useState("");
  const [newEnvValue, setNewEnvValue] = useState("");
  const [saving, setSaving] = useState(false);

  function startEdit(name: string) {
    setEditing(name);
    setForm(serverToForm(name, servers[name]));
  }

  function startNew() {
    setEditing("__new__");
    setForm(emptyForm());
  }

  function cancel() {
    setEditing(null);
    setForm(emptyForm());
  }

  function addEnvVar() {
    if (!newEnvKey.trim()) return;
    setForm({
      ...form,
      env: { ...form.env, [newEnvKey.trim()]: newEnvValue },
    });
    setNewEnvKey("");
    setNewEnvValue("");
  }

  function removeEnvVar(key: string) {
    const { [key]: _, ...rest } = form.env;
    setForm({ ...form, env: rest });
  }

  async function handleSave() {
    if (!form.name.trim() || !form.command.trim()) return;

    setSaving(true);
    const updated = { ...servers };

    if (editing !== "__new__" && editing !== form.name && editing) {
      delete updated[editing];
    }

    updated[form.name.trim()] = {
      command: form.command,
      args: form.args.split(/\s+/).filter(Boolean),
      env: Object.keys(form.env).length > 0 ? form.env : undefined,
      description: form.description || undefined,
    };

    await onSave(updated);
    setSaving(false);
    setEditing(null);
  }

  async function handleDelete(name: string) {
    const updated = { ...servers };
    delete updated[name];
    await onSave(updated);
  }

  return (
    <div className="space-y-3">
      {Object.entries(servers).map(([name, server]) =>
        editing === name ? null : (
          <div
            key={name}
            className="group rounded-2xl border border-border/60 bg-card/60 p-5 backdrop-blur-sm transition-all duration-200 hover:border-border hover:shadow-sm"
          >
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect width="20" height="8" x="2" y="2" rx="2" ry="2" />
                      <rect width="20" height="8" x="2" y="14" rx="2" ry="2" />
                      <line x1="6" x2="6.01" y1="6" y2="6" />
                      <line x1="6" x2="6.01" y1="18" y2="18" />
                    </svg>
                  </div>
                  <h3 className="font-mono text-sm font-semibold">{name}</h3>
                </div>
                <div className="pl-9">
                  <code className="text-xs text-muted-foreground">
                    {server.command} {server.args.join(" ")}
                  </code>
                  {server.description && (
                    <p className="mt-1 text-xs text-muted-foreground/70">
                      {server.description}
                    </p>
                  )}
                  {server.env && Object.keys(server.env).length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-1">
                      {Object.entries(server.env).map(([k, v]) => (
                        <Badge
                          key={k}
                          variant="secondary"
                          className="font-mono text-[10px] bg-accent/10 text-accent-foreground border-0"
                        >
                          {k}={v}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              <div className="flex gap-1.5 opacity-0 transition-opacity group-hover:opacity-100">
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-7 px-2 text-xs"
                  onClick={() => startEdit(name)}
                >
                  Edit
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-7 px-2 text-xs text-destructive hover:text-destructive"
                  onClick={() => handleDelete(name)}
                >
                  Delete
                </Button>
              </div>
            </div>
          </div>
        )
      )}

      {editing && (
        <div className="rounded-2xl border-2 border-primary/30 bg-card/80 p-6 shadow-lg shadow-primary/5 backdrop-blur-sm">
          <h3 className="mb-4 text-sm font-semibold">
            {editing === "__new__" ? "New MCP Server" : `Editing: ${editing}`}
          </h3>
          <div className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label className="text-xs">Name (slug)</Label>
                <Input
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="e.g. github"
                  className="bg-background/50"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Command</Label>
                <Input
                  value={form.command}
                  onChange={(e) =>
                    setForm({ ...form, command: e.target.value })
                  }
                  placeholder="npx"
                  className="bg-background/50"
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Args (space-separated)</Label>
              <Input
                value={form.args}
                onChange={(e) => setForm({ ...form, args: e.target.value })}
                placeholder="-y @modelcontextprotocol/server-github"
                className="bg-background/50"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Description</Label>
              <Input
                value={form.description}
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
                placeholder="Optional description"
                className="bg-background/50"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-xs">Environment Variables</Label>
              {Object.entries(form.env).map(([k, v]) => (
                <div key={k} className="flex items-center gap-2">
                  <code className="flex-1 truncate rounded-lg bg-muted/50 px-3 py-1.5 font-mono text-xs">
                    {k}={v}
                  </code>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-7 px-2 text-xs"
                    onClick={() => removeEnvVar(k)}
                  >
                    Remove
                  </Button>
                </div>
              ))}
              <div className="flex gap-2">
                <Input
                  value={newEnvKey}
                  onChange={(e) => setNewEnvKey(e.target.value)}
                  placeholder="KEY"
                  className="flex-1 bg-background/50"
                />
                <Input
                  value={newEnvValue}
                  onChange={(e) => setNewEnvValue(e.target.value)}
                  placeholder="__PLACEHOLDER__"
                  className="flex-1 bg-background/50"
                />
                <Button size="sm" variant="outline" onClick={addEnvVar}>
                  Add
                </Button>
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <Button
                onClick={handleSave}
                disabled={saving}
                className="shadow-md shadow-primary/20"
              >
                {saving ? "Saving…" : "Save"}
              </Button>
              <Button variant="ghost" onClick={cancel}>
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}

      {!editing && (
        <button
          onClick={startNew}
          className="flex w-full items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-border/60 py-4 text-sm text-muted-foreground transition-all duration-200 hover:border-primary/40 hover:text-primary"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 5v14M5 12h14" />
          </svg>
          Add MCP Server
        </button>
      )}
    </div>
  );
}
