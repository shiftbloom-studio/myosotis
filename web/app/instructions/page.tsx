"use client";

import { useEffect, useState, useCallback } from "react";
import { PageIntro } from "@/components/PageIntro";
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
    setError(null);
    try {
      const res = await fetch("/api/instructions");
      const json = await res.json();
      if (res.ok && json.success) {
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

  return (
    <div className="space-y-8">
      <PageIntro
        eyebrow="Instruction Packs"
        title="Instruction layers for global and project scopes."
        description="Edit the canonical Claude and Codex instruction files that shape how your tools behave across local and project contexts. Unsaved tabs remain visible until you write them back to disk."
        stats={[
          { label: "Files", value: "04" },
          { label: "Scopes", value: "02" },
          {
            label: "Unsaved",
            value: String(Object.keys(dirty).length).padStart(2, "0"),
          },
        ]}
        details={[
          { label: "Global Files", value: "templates/global/claude + codex" },
          { label: "Project Files", value: "templates/project/" },
        ]}
      />

      {error ? (
        <div className="rounded-[1.75rem] border border-destructive/20 bg-white/70 p-6 text-sm leading-6 text-destructive shadow-[0_18px_40px_rgba(15,15,15,0.04)]">
          {error}
        </div>
      ) : !data ? (
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
          Loading instructions…
        </div>
      ) : (
        <div className="sb-panel rounded-[2rem] p-6 sm:p-8">
          <div className="flex flex-col gap-4 border-b border-border/70 pb-6 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="font-mono text-[11px] uppercase tracking-[0.32em] text-primary/70">
                Editor
              </p>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground">
                Switch between global and project instruction files without
                leaving the workspace.
              </p>
            </div>
            <Button
              onClick={handleSave}
              disabled={saving || !hasDirtyChanges}
              className={
                hasDirtyChanges
                  ? "modern-btn h-10 rounded-full border-0 px-5 text-sm font-semibold text-white hover:text-white"
                  : "h-10 rounded-full border border-border/70 bg-white/60 px-5 text-sm font-semibold text-muted-foreground"
              }
            >
              {saving
                ? "Saving…"
                : hasDirtyChanges
                  ? "Save Changes"
                  : "No Changes"}
            </Button>
          </div>

          <div className="pt-6">
            <Tabs defaultValue="global-claude">
              <TabsList
                variant="line"
                className="h-auto flex-wrap gap-2 rounded-none bg-transparent p-0"
              >
                {INSTRUCTION_FILES.map((f) => (
                  <TabsTrigger
                    key={f.key}
                    value={f.key}
                    className="rounded-full border border-border/70 px-4 py-2 text-xs data-active:border-primary/20 data-active:bg-white data-active:text-foreground"
                  >
                    {f.label}
                    {dirty[f.key] !== undefined && (
                      <span className="ml-1.5 inline-block h-1.5 w-1.5 rounded-full bg-primary" />
                    )}
                  </TabsTrigger>
                ))}
              </TabsList>
              {INSTRUCTION_FILES.map((f) => (
                <TabsContent key={f.key} value={f.key} className="mt-6">
                  <p className="mb-4 font-mono text-[11px] uppercase tracking-[0.28em] text-muted-foreground">
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
      )}
    </div>
  );
}
