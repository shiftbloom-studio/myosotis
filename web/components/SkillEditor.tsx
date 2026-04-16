"use client";

import { useState } from "react";
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

  function selectSkill(name: string) {
    const skill = skills.find((s) => s.name === name);
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
      "# Skill Name\n\nDescribe what this skill does.\n\n## Expectations\n\n- \n"
    );
  }

  async function handleSave() {
    if (!selected) return;
    setSaving(true);
    await onSave({ name: selected, content });
    setSaving(false);
  }

  async function handleCreate() {
    if (!newName.trim()) return;
    setSaving(true);
    await onCreate({ name: newName.trim(), content: newContent });
    setSaving(false);
    setCreating(false);
  }

  async function handleDelete(name: string) {
    await onDelete(name);
    if (selected === name) {
      setSelected(null);
      setContent("");
    }
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[260px_1fr]">
      {/* Sidebar */}
      <div className="space-y-1.5">
        <p className="mb-2 text-[11px] font-medium uppercase tracking-widest text-muted-foreground/60">
          Skills
        </p>
        {skills.map((skill) => (
          <button
            key={skill.name}
            onClick={() => selectSkill(skill.name)}
            className={cn(
              "group flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-left text-sm transition-all duration-200",
              selected === skill.name
                ? "bg-primary/10 text-primary font-medium"
                : "text-foreground/80 hover:bg-muted/60"
            )}
          >
            <div className="flex items-center gap-2 overflow-hidden">
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className={cn(
                  "shrink-0",
                  selected === skill.name
                    ? "text-primary"
                    : "text-muted-foreground/50"
                )}
              >
                <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
                <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
              </svg>
              <span className="truncate font-mono text-xs">{skill.name}</span>
            </div>
            <button
              className="shrink-0 rounded px-1 text-[10px] text-destructive opacity-0 transition-opacity hover:bg-destructive/10 group-hover:opacity-100"
              onClick={(e) => {
                e.stopPropagation();
                handleDelete(skill.name);
              }}
            >
              Delete
            </button>
          </button>
        ))}
        <button
          onClick={startCreate}
          className="flex w-full items-center gap-2 rounded-xl border border-dashed border-border/60 px-3 py-2.5 text-xs text-muted-foreground transition-all hover:border-primary/40 hover:text-primary"
        >
          <svg
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M12 5v14M5 12h14" />
          </svg>
          New Skill
        </button>
      </div>

      {/* Main content */}
      <div>
        {creating ? (
          <div className="rounded-2xl border-2 border-primary/30 bg-card/80 p-6 shadow-lg shadow-primary/5 backdrop-blur-sm">
            <h3 className="mb-4 text-sm font-semibold">Create New Skill</h3>
            <div className="space-y-4">
              <div className="space-y-1.5">
                <Label className="text-xs">Skill Name (lowercase-hyphen)</Label>
                <Input
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="e.g. shiftbloom-analytics"
                  className="bg-background/50"
                />
              </div>
              <MarkdownEditor
                value={newContent}
                onChange={setNewContent}
                placeholder="# Skill Title..."
              />
              <div className="flex gap-2 pt-1">
                <Button
                  onClick={handleCreate}
                  disabled={saving}
                  className="shadow-md shadow-primary/20"
                >
                  {saving ? "Creating…" : "Create Skill"}
                </Button>
                <Button variant="ghost" onClick={() => setCreating(false)}>
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        ) : selected ? (
          <div className="rounded-2xl border border-border/60 bg-card/60 p-6 backdrop-blur-sm">
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-accent/10 text-accent">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
                    <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
                  </svg>
                </div>
                <h3 className="font-mono text-sm font-semibold">{selected}</h3>
              </div>
              <Button
                onClick={handleSave}
                disabled={saving}
                size="sm"
                className="shadow-md shadow-primary/20"
              >
                {saving ? "Saving…" : "Save"}
              </Button>
            </div>
            <MarkdownEditor
              value={content}
              onChange={setContent}
              placeholder="# Skill content..."
            />
          </div>
        ) : (
          <div className="flex h-64 items-center justify-center rounded-2xl border border-dashed border-border/40 text-sm text-muted-foreground/60">
            Select a skill to edit, or create a new one.
          </div>
        )}
      </div>
    </div>
  );
}
