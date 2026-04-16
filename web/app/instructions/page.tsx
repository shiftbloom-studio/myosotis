"use client";

import { useEffect, useState, useCallback } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { MarkdownEditor } from "@/components/MarkdownEditor";

const INSTRUCTION_FILES = [
  {
    key: "global-claude",
    label: "Global Claude",
    file: "templates/global/claude/CLAUDE.md",
  },
  {
    key: "global-codex",
    label: "Global Codex",
    file: "templates/global/codex/AGENTS.md",
  },
  {
    key: "project-claude",
    label: "Project Claude",
    file: "templates/project/CLAUDE.md",
  },
  {
    key: "project-codex",
    label: "Project Codex",
    file: "templates/project/AGENTS.md",
  },
] as const;

type InstructionKey = (typeof INSTRUCTION_FILES)[number]["key"];

export default function InstructionsPage() {
  const [data, setData] = useState<Record<string, string> | null>(null);
  const [dirty, setDirty] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchInstructions = useCallback(async () => {
    try {
      const res = await fetch("/api/instructions");
      const json = await res.json();
      if (json.success) {
        setData(json.data);
        setDirty({});
      } else {
        setError(json.error);
      }
    } catch {
      setError("Failed to load instructions");
    }
  }, []);

  useEffect(() => {
    fetchInstructions();
  }, [fetchInstructions]);

  function handleChange(key: InstructionKey, value: string) {
    setDirty((prev) => ({ ...prev, [key]: value }));
  }

  function getValue(key: InstructionKey): string {
    return dirty[key] ?? data?.[key] ?? "";
  }

  const hasDirtyChanges = Object.keys(dirty).length > 0;

  async function handleSave() {
    if (!hasDirtyChanges) return;
    setSaving(true);
    try {
      const res = await fetch("/api/instructions", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dirty),
      });
      const json = await res.json();
      if (json.success) {
        await fetchInstructions();
      } else {
        setError(json.error);
      }
    } catch {
      setError("Failed to save instructions");
    } finally {
      setSaving(false);
    }
  }

  if (error) {
    return (
      <div className="rounded-2xl border border-destructive/30 bg-destructive/5 p-5 text-sm text-destructive">
        {error}
      </div>
    );
  }

  if (!data) {
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
        Loading instructions…
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Instructions</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Edit global and project-level CLAUDE.md and AGENTS.md files.
          </p>
        </div>
        <Button
          onClick={handleSave}
          disabled={saving || !hasDirtyChanges}
          className={
            hasDirtyChanges ? "shadow-md shadow-primary/20" : ""
          }
        >
          {saving
            ? "Saving…"
            : hasDirtyChanges
              ? "Save Changes"
              : "No Changes"}
        </Button>
      </div>

      <div className="rounded-2xl border border-border/60 bg-card/60 p-6 backdrop-blur-sm">
        <Tabs defaultValue="global-claude">
          <TabsList className="bg-muted/50">
            {INSTRUCTION_FILES.map((f) => (
              <TabsTrigger key={f.key} value={f.key} className="text-xs">
                {f.label}
                {dirty[f.key] !== undefined && (
                  <span className="ml-1.5 inline-block h-1.5 w-1.5 rounded-full bg-primary" />
                )}
              </TabsTrigger>
            ))}
          </TabsList>
          {INSTRUCTION_FILES.map((f) => (
            <TabsContent key={f.key} value={f.key}>
              <p className="mb-3 font-mono text-[11px] text-muted-foreground/60">
                {f.file}
              </p>
              <MarkdownEditor
                value={getValue(f.key)}
                onChange={(v) => handleChange(f.key, v)}
                placeholder={`# ${f.label} Instructions...`}
              />
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </div>
  );
}
