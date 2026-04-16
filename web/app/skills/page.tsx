"use client";

import { useEffect, useState } from "react";
import { SkillEditor } from "@/components/SkillEditor";

interface Skill {
  name: string;
  content: string;
}

export default function SkillsPage() {
  const [skills, setSkills] = useState<Skill[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function fetchSkills() {
    try {
      const res = await fetch("/api/skills");
      const json = await res.json();
      if (json.success) {
        setSkills(json.data);
      } else {
        setError(json.error);
      }
    } catch {
      setError("Failed to load skills");
    }
  }

  useEffect(() => {
    fetchSkills();
  }, []);

  async function handleSave(skill: Skill) {
    await fetch("/api/skills", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(skill),
    });
    await fetchSkills();
  }

  async function handleCreate(skill: Skill) {
    await fetch("/api/skills", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(skill),
    });
    await fetchSkills();
  }

  async function handleDelete(name: string) {
    await fetch("/api/skills", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name }),
    });
    await fetchSkills();
  }

  if (error) {
    return (
      <div className="rounded-2xl border border-destructive/30 bg-destructive/5 p-5 text-sm text-destructive">
        {error}
      </div>
    );
  }

  if (!skills) {
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
        Loading skills…
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Team Skills</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Manage reusable SKILL.md files distributed to{" "}
          <code className="rounded-md bg-muted/60 px-1.5 py-0.5 font-mono text-xs">
            ~/.claude/skills/
          </code>
          ,{" "}
          <code className="rounded-md bg-muted/60 px-1.5 py-0.5 font-mono text-xs">
            ~/.codex/skills/
          </code>
          , and{" "}
          <code className="rounded-md bg-muted/60 px-1.5 py-0.5 font-mono text-xs">
            ~/.agents/skills/
          </code>
          .
        </p>
      </div>
      <SkillEditor
        skills={skills}
        onSave={handleSave}
        onCreate={handleCreate}
        onDelete={handleDelete}
      />
    </div>
  );
}
