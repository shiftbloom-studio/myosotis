"use client";

import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { McpServer } from "@/lib/validators";
import { cn } from "@/lib/utils";

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

  const serverEntries = useMemo(
    () => Object.entries(servers).sort(([left], [right]) => left.localeCompare(right)),
    [servers]
  );

  function startEdit(name: string) {
    setEditing(name);
    setForm(serverToForm(name, servers[name]));
    setNewEnvKey("");
    setNewEnvValue("");
  }

  function startNew() {
    setEditing("__new__");
    setForm(emptyForm());
    setNewEnvKey("");
    setNewEnvValue("");
  }

  function cancel() {
    setEditing(null);
    setForm(emptyForm());
    setNewEnvKey("");
    setNewEnvValue("");
  }

  function addEnvVar() {
    if (!newEnvKey.trim()) return;

    setForm((current) => ({
      ...current,
      env: { ...current.env, [newEnvKey.trim()]: newEnvValue },
    }));
    setNewEnvKey("");
    setNewEnvValue("");
  }

  function removeEnvVar(key: string) {
    const nextEnv = { ...form.env };
    delete nextEnv[key];
    setForm({ ...form, env: nextEnv });
  }

  async function handleSave() {
    if (!form.name.trim() || !form.command.trim()) return;

    setSaving(true);
    try {
      const updated = { ...servers };

      if (editing !== "__new__" && editing !== form.name && editing) {
        delete updated[editing];
      }

      updated[form.name.trim()] = {
        command: form.command.trim(),
        args: form.args.split(/\s+/).filter(Boolean),
        env: Object.keys(form.env).length > 0 ? form.env : undefined,
        description: form.description || undefined,
      };

      await onSave(updated);
      setEditing(null);
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(name: string) {
    const updated = { ...servers };
    delete updated[name];
    await onSave(updated);

    if (editing === name) {
      cancel();
    }
  }

  const isCreating = editing === "__new__";

  return (
    <div className="grid gap-10 xl:grid-cols-[320px_minmax(0,1fr)]">
      <aside className="space-y-4">
        <div className="flex items-end justify-between gap-4 border-b border-border/70 pb-4">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.32em] text-muted-foreground">
              Registry
            </p>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              One canonical command library for the team&apos;s MCP connections.
            </p>
          </div>
          <Button
            type="button"
            variant="ghost"
            className="h-10 rounded-full border border-border/70 bg-white/70 px-4 text-sm font-semibold text-foreground hover:border-primary/15 hover:bg-white"
            onClick={startNew}
          >
            New
          </Button>
        </div>

        <div className="space-y-2">
          {serverEntries.length > 0 ? (
            serverEntries.map(([name, server], index) => {
              const isActive = editing === name;
              const envCount = Object.keys(server.env ?? {}).length;

              return (
                <div
                  key={name}
                  className={cn(
                    "rounded-[1.6rem] border p-4 transition-all duration-300",
                    isActive
                      ? "border-primary/20 bg-white shadow-[0_16px_36px_rgba(15,15,15,0.05)]"
                      : "border-border/60 bg-transparent hover:border-primary/15 hover:bg-white/70"
                  )}
                >
                  <div className="flex items-start gap-3">
                    <button
                      type="button"
                      onClick={() => startEdit(name)}
                      className="flex-1 text-left"
                    >
                      <div className="flex items-center gap-3">
                        <span className="font-mono text-[11px] text-primary/70">
                          {String(index + 1).padStart(2, "0")}
                        </span>
                        <div>
                          <p className="text-sm font-medium tracking-[-0.02em] text-foreground">
                            {name}
                          </p>
                          <p className="mt-1 text-sm leading-5 text-muted-foreground">
                            {server.description ?? "No description yet."}
                          </p>
                        </div>
                      </div>

                      <div className="mt-3 flex flex-wrap gap-2 pl-7">
                        <span className="rounded-full border border-border/70 px-2.5 py-1 font-mono text-[11px] text-muted-foreground">
                          {server.command}
                        </span>
                        <span className="rounded-full border border-border/70 px-2.5 py-1 font-mono text-[11px] text-muted-foreground">
                          {server.args.length} args
                        </span>
                        {envCount > 0 && (
                          <span className="rounded-full border border-border/70 px-2.5 py-1 font-mono text-[11px] text-muted-foreground">
                            {envCount} env vars
                          </span>
                        )}
                      </div>
                    </button>

                    <Button
                      type="button"
                      variant="ghost"
                      size="icon-sm"
                      className="mt-1 rounded-full text-destructive hover:bg-destructive/10 hover:text-destructive"
                      onClick={() => handleDelete(name)}
                    >
                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M3 6h18" />
                        <path d="M8 6V4h8v2" />
                        <path d="M19 6l-1 14H6L5 6" />
                        <path d="M10 11v6" />
                        <path d="M14 11v6" />
                      </svg>
                    </Button>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="rounded-[1.6rem] border border-dashed border-border/70 p-6 text-sm leading-6 text-muted-foreground">
              No MCP profiles exist yet. Create the first shared server profile
              to get started.
            </div>
          )}
        </div>
      </aside>

      <div className="sb-panel rounded-[2rem] p-6 sm:p-8">
        {editing ? (
          <div className="space-y-6">
            <div className="flex flex-col gap-4 border-b border-border/70 pb-6 sm:flex-row sm:items-start sm:justify-between">
              <div className="space-y-3">
                <p className="font-mono text-[11px] uppercase tracking-[0.32em] text-primary/70">
                  {isCreating ? "New Profile" : "Editing"}
                </p>
                <div>
                  <h3 className="text-3xl font-semibold tracking-[-0.04em] text-foreground">
                    {isCreating ? "Add an MCP server" : form.name}
                  </h3>
                  <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
                    Define the runtime command, arguments, placeholder
                    environment variables, and a team-facing description.
                  </p>
                </div>
              </div>

              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="ghost"
                  className="h-10 rounded-full border border-border/70 bg-white/60 px-4 text-sm font-semibold text-foreground hover:bg-white"
                  onClick={cancel}
                >
                  Cancel
                </Button>
                <Button
                  type="button"
                  className="modern-btn h-10 rounded-full border-0 px-5 text-sm font-semibold text-white hover:text-white"
                  onClick={handleSave}
                  disabled={saving}
                >
                  {saving ? "Saving…" : "Save Profile"}
                </Button>
              </div>
            </div>

            <div className="grid gap-6">
              <div className="grid gap-5 md:grid-cols-2">
                <div className="space-y-2">
                  <Label className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
                    Name
                  </Label>
                  <Input
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="github"
                    className="h-11 rounded-2xl border-border/70 bg-white/70 px-4"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
                    Command
                  </Label>
                  <Input
                    value={form.command}
                    onChange={(e) =>
                      setForm({ ...form, command: e.target.value })
                    }
                    placeholder="npx"
                    className="h-11 rounded-2xl border-border/70 bg-white/70 px-4"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
                  Arguments
                </Label>
                <Input
                  value={form.args}
                  onChange={(e) => setForm({ ...form, args: e.target.value })}
                  placeholder="-y @modelcontextprotocol/server-github"
                  className="h-11 rounded-2xl border-border/70 bg-white/70 px-4"
                />
              </div>

              <div className="space-y-2">
                <Label className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
                  Description
                </Label>
                <Input
                  value={form.description}
                  onChange={(e) =>
                    setForm({ ...form, description: e.target.value })
                  }
                  placeholder="Optional description"
                  className="h-11 rounded-2xl border-border/70 bg-white/70 px-4"
                />
              </div>

              <div className="rounded-[1.75rem] border border-border/70 bg-white/55 p-5">
                <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
                  Command Preview
                </p>
                <code className="mt-3 block break-all font-mono text-sm leading-6 text-foreground/80">
                  {form.command}
                  {form.args ? ` ${form.args}` : ""}
                </code>
              </div>

              <div className="space-y-4">
                <div>
                  <Label className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
                    Environment Variables
                  </Label>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">
                    Store placeholders and required keys that operators should
                    fill in before syncing.
                  </p>
                </div>

                <div className="space-y-2">
                  {Object.keys(form.env).length > 0 ? (
                    Object.entries(form.env).map(([key, value]) => (
                      <div
                        key={key}
                        className="flex items-center gap-3 rounded-[1.25rem] border border-border/70 bg-white/60 px-4 py-3"
                      >
                        <code className="flex-1 break-all font-mono text-xs text-foreground/80">
                          {key}={value}
                        </code>
                        <Button
                          type="button"
                          variant="ghost"
                          className="h-8 rounded-full px-3 text-xs text-muted-foreground hover:bg-white hover:text-foreground"
                          onClick={() => removeEnvVar(key)}
                        >
                          Remove
                        </Button>
                      </div>
                    ))
                  ) : (
                    <div className="rounded-[1.25rem] border border-dashed border-border/70 px-4 py-5 text-sm text-muted-foreground">
                      No environment variables added yet.
                    </div>
                  )}
                </div>

                <div className="grid gap-3 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_auto]">
                  <Input
                    value={newEnvKey}
                    onChange={(e) => setNewEnvKey(e.target.value)}
                    placeholder="GITHUB_TOKEN"
                    className="h-11 rounded-2xl border-border/70 bg-white/70 px-4"
                  />
                  <Input
                    value={newEnvValue}
                    onChange={(e) => setNewEnvValue(e.target.value)}
                    placeholder="__PLACEHOLDER__"
                    className="h-11 rounded-2xl border-border/70 bg-white/70 px-4"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    className="h-11 rounded-full border border-border/70 bg-white/70 px-4 text-sm font-semibold text-foreground hover:border-primary/15 hover:bg-white"
                    onClick={addEnvVar}
                  >
                    Add
                  </Button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex min-h-[420px] flex-col items-center justify-center gap-3 rounded-[1.75rem] border border-dashed border-border/70 bg-white/45 px-6 text-center">
            <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
              Select a profile
            </p>
            <p className="max-w-sm text-sm leading-6 text-muted-foreground">
              Choose an MCP server from the registry to edit its command and
              environment placeholders.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
