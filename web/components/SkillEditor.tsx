"use client";

import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MarkdownEditor } from "./MarkdownEditor";
import { cn } from "@/lib/utils";

interface Skill {
  name: string;
  content: string;
}

interface SkillEditorProps {
  skills: Skill[];
  onSave: (skill: Skill) => Promise<void>;
  onCreate: (skill: Skill) => Promise<void>;
  onDelete: (name: string) => Promise<void>;
}

function getPreview(content: string) {
  const lines = content
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

  return (
    lines.find((line) => !line.startsWith("#") && !line.startsWith("-")) ??
    "No description yet."
  );
}

export function SkillEditor({
  skills,
  onSave,
  onCreate,
  onDelete,
}: SkillEditorProps) {
  const [selected, setSelected] = useState<string | null>(null);
  const [content, setContent] = useState("");
  const [creating, setCreating] = useState(false);
  const [newName, setNewName] = useState("");
  const [newContent, setNewContent] = useState("");
  const [saving, setSaving] = useState(false);

  const selectedSkill = useMemo(
    () => skills.find((skill) => skill.name === selected) ?? null,
    [selected, skills]
  );

  useEffect(() => {
    if (creating) return;

    if (selectedSkill) {
      setContent(selectedSkill.content);
      return;
    }

    if (skills.length === 0) {
      setSelected(null);
      setContent("");
      return;
    }

    setSelected(skills[0].name);
    setContent(skills[0].content);
  }, [creating, selectedSkill, skills]);

  function selectSkill(name: string) {
    const skill = skills.find((entry) => entry.name === name);
    if (!skill) return;
    setSelected(name);
    setContent(skill.content);
    setCreating(false);
  }

  function startCreate() {
    setCreating(true);
    setSelected(null);
    setNewName("");
    setNewContent(
      "---\nname: new-skill\ndescription: Explain when to use this skill.\n---\n\n# New Skill\n\nDescribe what this skill does.\n\n## Expectations\n\n- \n"
    );
  }

  async function handleSave() {
    if (!selected) return;

    setSaving(true);
    try {
      await onSave({ name: selected, content });
    } finally {
      setSaving(false);
    }
  }

  async function handleCreate() {
    const nextName = newName.trim();

    if (!nextName) return;

    setSaving(true);
    try {
      await onCreate({ name: nextName, content: newContent });
      setSelected(nextName);
      setContent(newContent);
      setCreating(false);
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(name: string) {
    await onDelete(name);

    if (selected === name) {
      setSelected(null);
      setContent("");
    }

    if (creating) {
      setCreating(false);
    }
  }

  return (
    <div className="grid gap-10 xl:grid-cols-[320px_minmax(0,1fr)]">
      <aside className="space-y-4">
        <div className="flex items-end justify-between gap-4 border-b border-border/70 pb-4">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.32em] text-muted-foreground">
              Library Index
            </p>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              Browse and edit reusable skill directories synced into every
              agent surface.
            </p>
          </div>
          <Button
            type="button"
            variant="ghost"
            className="h-10 rounded-full border border-border/70 bg-white/70 px-4 text-sm font-semibold text-foreground hover:border-primary/15 hover:bg-white"
            onClick={startCreate}
          >
            New
          </Button>
        </div>

        <div className="space-y-2">
          {skills.length > 0 ? (
            skills.map((skill, index) => {
              const isActive = !creating && selected === skill.name;

              return (
                <div
                  key={skill.name}
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
                      onClick={() => selectSkill(skill.name)}
                      className="flex-1 text-left"
                    >
                      <div className="flex items-center gap-3">
                        <span className="font-mono text-[11px] text-primary/70">
                          {String(index + 1).padStart(2, "0")}
                        </span>
                        <div>
                          <p className="text-sm font-medium tracking-[-0.02em] text-foreground">
                            {skill.name}
                          </p>
                          <p className="mt-1 text-sm leading-5 text-muted-foreground">
                            {getPreview(skill.content)}
                          </p>
                        </div>
                      </div>
                      <div className="mt-3 flex flex-wrap gap-2 pl-7">
                        <span className="rounded-full border border-border/70 px-2.5 py-1 font-mono text-[11px] text-muted-foreground">
                          {skill.content.split("\n").length} lines
                        </span>
                        <span className="rounded-full border border-border/70 px-2.5 py-1 font-mono text-[11px] text-muted-foreground">
                          SKILL.md
                        </span>
                      </div>
                    </button>

                    <Button
                      type="button"
                      variant="ghost"
                      size="icon-sm"
                      className="mt-1 rounded-full text-destructive hover:bg-destructive/10 hover:text-destructive"
                      onClick={() => handleDelete(skill.name)}
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
              No skills exist yet. Start by creating the first canonical skill
              for your team.
            </div>
          )}
        </div>
      </aside>

      <div className="sb-panel rounded-[2rem] p-6 sm:p-8">
        {creating ? (
          <div className="space-y-6">
            <div className="flex flex-col gap-4 border-b border-border/70 pb-6 sm:flex-row sm:items-start sm:justify-between">
              <div className="space-y-3">
                <p className="font-mono text-[11px] uppercase tracking-[0.32em] text-primary/70">
                  New Skill
                </p>
                <div>
                  <h3 className="text-3xl font-semibold tracking-[-0.04em] text-foreground">
                    Add a reusable skill pack
                  </h3>
                  <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
                    Create a new skill directory with a canonical{" "}
                    <span className="font-mono text-foreground/80">
                      SKILL.md
                    </span>{" "}
                    entry for the team.
                  </p>
                </div>
              </div>

              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="ghost"
                  className="h-10 rounded-full border border-border/70 bg-white/60 px-4 text-sm font-semibold text-foreground hover:bg-white"
                  onClick={() => setCreating(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="button"
                  className="modern-btn h-10 rounded-full border-0 px-5 text-sm font-semibold text-white hover:text-white"
                  onClick={handleCreate}
                  disabled={saving}
                >
                  {saving ? "Creating…" : "Create Skill"}
                </Button>
              </div>
            </div>

            <div className="space-y-6">
              <div className="space-y-2">
                <Label className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
                  Skill Name
                </Label>
                <Input
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="shiftbloom-analytics"
                  className="h-11 rounded-2xl border-border/70 bg-white/70 px-4"
                />
              </div>

              <MarkdownEditor
                value={newContent}
                onChange={setNewContent}
                placeholder="# Skill Title..."
              />
            </div>
          </div>
        ) : selectedSkill ? (
          <div className="space-y-6">
            <div className="flex flex-col gap-4 border-b border-border/70 pb-6 sm:flex-row sm:items-start sm:justify-between">
              <div className="space-y-3">
                <p className="font-mono text-[11px] uppercase tracking-[0.32em] text-primary/70">
                  Editing
                </p>
                <div>
                  <h3 className="text-3xl font-semibold tracking-[-0.04em] text-foreground">
                    {selectedSkill.name}
                  </h3>
                  <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
                    Update the skill instructions and sync them back into the
                    canonical repository state.
                  </p>
                </div>
              </div>

              <Button
                type="button"
                className="modern-btn h-10 rounded-full border-0 px-5 text-sm font-semibold text-white hover:text-white"
                onClick={handleSave}
                disabled={saving}
              >
                {saving ? "Saving…" : "Save Skill"}
              </Button>
            </div>

            <MarkdownEditor
              value={content}
              onChange={setContent}
              placeholder="# Skill content..."
            />
          </div>
        ) : (
          <div className="flex min-h-[420px] flex-col items-center justify-center gap-3 rounded-[1.75rem] border border-dashed border-border/70 bg-white/45 px-6 text-center">
            <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
              Select a skill
            </p>
            <p className="max-w-sm text-sm leading-6 text-muted-foreground">
              Choose an existing skill from the library or create a new one to
              start editing.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
