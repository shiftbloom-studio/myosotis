"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const tabs = [
  {
    href: "/mcp-servers",
    label: "MCP Servers",
    description: "Versioned command profiles and environment placeholders.",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect width="20" height="8" x="2" y="2" rx="2" ry="2" />
        <rect width="20" height="8" x="2" y="14" rx="2" ry="2" />
        <line x1="6" x2="6.01" y1="6" y2="6" />
        <line x1="6" x2="6.01" y1="18" y2="18" />
      </svg>
    ),
  },
  {
    href: "/skills",
    label: "Skills",
    description: "Reusable SKILL.md packs for every agent surface.",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
        <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
      </svg>
    ),
  },
  {
    href: "/instructions",
    label: "Instructions",
    description: "Layered instruction files for global and project scope.",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="16" x2="8" y1="13" y2="13" />
        <line x1="16" x2="8" y1="17" y2="17" />
        <line x1="10" x2="8" y1="9" y2="9" />
      </svg>
    ),
  },
] as const;

export function TabNav() {
  const pathname = usePathname();

  return (
    <nav className="space-y-3" aria-label="Primary">
      <p className="font-mono text-[10px] uppercase tracking-[0.32em] text-white/35">
        Workspace
      </p>
      <div className="grid gap-2 md:grid-cols-3 lg:grid-cols-1">
        {tabs.map((tab) => {
          const isActive = pathname.startsWith(tab.href);
          return (
            <Link
              key={tab.href}
              href={tab.href}
              aria-current={isActive ? "page" : undefined}
              className={cn(
                "group relative rounded-[1.6rem] border px-4 py-4 transition-all duration-300",
                isActive
                  ? "border-white/18 bg-white/[0.08] text-white shadow-[0_20px_40px_rgba(0,0,0,0.16)]"
                  : "border-white/10 text-white/68 hover:border-white/18 hover:bg-white/[0.04] hover:text-white"
              )}
            >
              <div className="flex items-start gap-3">
                <div
                  className={cn(
                    "mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border transition-all duration-300",
                    isActive
                      ? "border-white/10 bg-primary/15 text-primary"
                      : "border-white/10 bg-white/[0.03] text-white/55 group-hover:border-white/15 group-hover:text-white/80"
                  )}
                >
                  {tab.icon}
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-medium tracking-[-0.02em]">
                    {tab.label}
                  </p>
                  <p
                    className={cn(
                      "mt-1 text-sm leading-5",
                      isActive ? "text-white/72" : "text-white/45"
                    )}
                  >
                    {tab.description}
                  </p>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
