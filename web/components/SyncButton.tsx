"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface GitStatus {
  modified: string[];
  created: string[];
  deleted: string[];
  isClean: boolean;
}

export function SyncButton() {
  const [status, setStatus] = useState<GitStatus | null>(null);
  const [syncing, setSyncing] = useState(false);
  const [message, setMessage] = useState("");

  async function fetchStatus() {
    try {
      const res = await fetch("/api/sync");
      const json = await res.json();
      if (json.success) setStatus(json.data);
    } catch {
      // silently fail on status check
    }
  }

  useEffect(() => {
    fetchStatus();
    const interval = setInterval(fetchStatus, 5000);
    return () => clearInterval(interval);
  }, []);

  async function handleSync() {
    setSyncing(true);
    setMessage("");
    try {
      const res = await fetch("/api/sync", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}),
      });
      const json = await res.json();
      if (json.success) {
        setMessage(json.data.summary);
        await fetchStatus();
      } else {
        setMessage(`Error: ${json.error}`);
      }
    } catch {
      setMessage("Sync failed");
    } finally {
      setSyncing(false);
    }
  }

  const changeCount =
    (status?.modified.length ?? 0) +
    (status?.created.length ?? 0) +
    (status?.deleted.length ?? 0);

  const statusText = message
    ? message
    : changeCount > 0
      ? `${changeCount} file${changeCount === 1 ? "" : "s"} ready to sync`
      : "Working tree is clean";

  return (
    <div className="rounded-[1.75rem] border border-white/10 bg-white/[0.04] p-4 shadow-[0_18px_40px_rgba(0,0,0,0.14)]">
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-2">
          <p className="font-mono text-[10px] uppercase tracking-[0.32em] text-white/35">
            Git Sync
          </p>
          <p className="text-sm leading-6 text-white/70">{statusText}</p>
        </div>
        <Badge
          variant="secondary"
          className="border-0 bg-white/[0.08] px-2.5 text-[11px] text-white/70"
        >
          {changeCount > 0 ? `${changeCount} pending` : "in sync"}
        </Badge>
      </div>
      <Button
        onClick={handleSync}
        disabled={syncing || (status?.isClean ?? true)}
        className={
          changeCount > 0
            ? "modern-btn mt-4 h-11 w-full rounded-full border-0 text-sm font-semibold text-white hover:text-white"
            : "mt-4 h-11 w-full rounded-full border border-white/10 bg-white/[0.05] text-sm font-semibold text-white/55 hover:bg-white/[0.08] hover:text-white"
        }
        variant="ghost"
      >
        {syncing ? (
          <>
            <svg className="mr-1.5 h-3.5 w-3.5 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 12a9 9 0 1 1-6.219-8.56" />
            </svg>
            Syncing…
          </>
        ) : changeCount > 0 ? (
          <>
            <svg className="mr-1.5 h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 5v14M5 12h14" />
            </svg>
            Sync to Team
          </>
        ) : (
          <>
            <svg className="mr-1.5 h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 6 9 17l-5-5" />
            </svg>
            In Sync
          </>
        )}
      </Button>
    </div>
  );
}
