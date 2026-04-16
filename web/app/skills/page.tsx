"use client";

import { useEffect, useState } from "react";
import { PageIntro } from "@/components/PageIntro";
import { SkillEditor } from "@/components/SkillEditor";

interface Skill {
  name: string;
  content: string;
}

export default function SkillsPage() {
  const [skills, setSkills] = useState<Skill[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function readSkills() {
    const res = await fetch("/api/skills");
    const json = await res.json();

    if (!res.ok || !json.success) {
      throw new Error(json.error ?? "Failed to load skills");
    }

    return json.data as Skill[];
  }

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const data = await readSkills();
        if (cancelled) return;
        setError(null);
        setSkills(data);
      } catch (nextError) {
        if (cancelled) return;
        setError(
          nextError instanceof Error ? nextError.message : "Failed to load skills"
        );
      }
    }

    void load();

    return () => {
      cancelled = true;
    };
  }, []);

  async function handleSave(skill: Skill) {
    setError(null);
    const res = await fetch("/api/skills", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(skill),
    });
    const json = await res.json();

    if (!res.ok || !json.success) {
      setError(json.error ?? "Failed to update skill");
      return;
    }

    setError(null);
    setSkills(await readSkills());
  }

  async function handleCreate(skill: Skill) {
    setError(null);
    const res = await fetch("/api/skills", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(skill),
    });
    const json = await res.json();

    if (!res.ok || !json.success) {
      setError(json.error ?? "Failed to create skill");
      return;
    }

    setError(null);
    setSkills(await readSkills());
  }

  async function handleDelete(name: string) {
    setError(null);
    const res = await fetch("/api/skills", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name }),
    });
    const json = await res.json();

    if (!res.ok || !json.success) {
      setError(json.error ?? "Failed to delete skill");
      return;
    }

    setError(null);
    setSkills(await readSkills());
  }

  return (
    <div className="space-y-8">
      <PageIntro
        eyebrow="Skill Library"
        title="Canonical skill packs for Claude, Codex, and agents."
        description="Manage reusable SKILL.md directories distributed into the team’s shared agent surfaces. This fixes the old skills workflow by keeping the library index and the editor in a stable two-pane layout."
        stats={[
          {
            label: "Skill folders",
            value: skills ? String(skills.length).padStart(2, "0") : "—",
          },
          { label: "Distribution targets", value: "03" },
          { label: "Source format", value: "MD" },
        ]}
        details={[
          {
            label: "Targets",
            value: "~/.claude/skills · ~/.codex/skills · ~/.agents/skills",
          },
          { label: "Source Directory", value: "skills/" },
        ]}
      />

      {error ? (
        <div className="rounded-[1.75rem] border border-destructive/20 bg-white/70 p-6 text-sm leading-6 text-destructive shadow-[0_18px_40px_rgba(15,15,15,0.04)]">
          {error}
        </div>
      ) : !skills ? (
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
          Loading skills…
        </div>
      ) : (
        <SkillEditor
          skills={skills}
          onSave={handleSave}
          onCreate={handleCreate}
          onDelete={handleDelete}
        />
      )}
    </div>
  );
}
