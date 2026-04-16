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

  return (
    <div className="flex items-center gap-3">
      {message && (
        <span className="text-xs text-muted-foreground">{message}</span>
      )}
      {changeCount > 0 && !syncing && (
        <Badge variant="secondary" className="text-xs tabular-nums">
          {changeCount} pending
        </Badge>
      )}
      <Button
        onClick={handleSync}
        disabled={syncing || (status?.isClean ?? true)}
        size="sm"
        className={
          changeCount > 0
            ? "bg-primary text-primary-foreground shadow-md shadow-primary/20 transition-all hover:shadow-lg hover:shadow-primary/30 hover:-translate-y-px"
            : ""
        }
        variant={changeCount > 0 ? "default" : "outline"}
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
