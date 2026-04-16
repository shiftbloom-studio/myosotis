import type { Metadata } from "next";
import path from "node:path";
import { Geist, Geist_Mono } from "next/font/google";
import Image from "next/image";
import { TabNav } from "@/components/TabNav";
import { SyncButton } from "@/components/SyncButton";
import { paths } from "@/lib/config-paths";
import "./globals.css";

const geist = Geist({
  variable: "--font-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Shiftbloom Archon",
  description: "Manage shared MCP servers, skills, and instruction packs.",
};

const repoName = path.basename(paths.root);

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geist.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-background text-foreground">
        <div className="relative min-h-screen overflow-hidden">
          <div className="relative grid min-h-screen lg:grid-cols-[22rem_minmax(0,1fr)]">
            <aside className="shell-aside border-b border-white/10 lg:border-r lg:border-b-0 lg:border-white/8">
              <div className="flex h-full flex-col gap-8 px-6 py-6 sm:px-8 lg:sticky lg:top-0 lg:min-h-screen lg:py-8">
                <div className="space-y-5">
                  <div className="flex items-center gap-3">
                    <Image
                      src="/logo.png"
                      alt="Shiftbloom Studio Logo"
                      width={44}
                      height={44}
                      className="rounded-xl"
                    />
                    <div>
                      <p className="text-sm font-medium uppercase tracking-[0.28em] text-white/40">
                        Archon
                      </p>
                      <h1 className="text-xl font-semibold tracking-[-0.04em] text-white">
                        <span className="gradient-text">shiftbloom</span>{" "}
                        <span className="text-white">studio.</span>
                      </h1>
                    </div>
                  </div>
                  <div className="space-y-3 text-sm leading-6 text-white/65">
                    <p>
                      Shared control surface for the team&apos;s MCP profiles,
                      skill library, and instruction packs.
                    </p>
                    <div className="border-y border-white/10 py-4">
                      <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-white/40">
                        Studio Workspace
                      </p>
                      <p className="mt-2 text-white/55">
                        Built to edit source-of-truth config and deploy the
                        Archon setup stack without leaving the repo.
                      </p>
                    </div>
                  </div>
                </div>

                <TabNav />

                <div className="mt-auto space-y-5">
                  <SyncButton />
                  <dl className="grid gap-4 border-t border-white/10 pt-5 text-sm text-white/60">
                    <div>
                      <dt className="font-mono text-[10px] uppercase tracking-[0.28em] text-white/35">
                        Repository
                      </dt>
                      <dd className="mt-2 text-white/75">{repoName}</dd>
                    </div>
                    <div>
                      <dt className="font-mono text-[10px] uppercase tracking-[0.28em] text-white/35">
                        Config Root
                      </dt>
                      <dd className="mt-2 break-all font-mono text-xs text-white/55">
                        {paths.root}
                      </dd>
                    </div>
                    <div>
                      <dt className="font-mono text-[10px] uppercase tracking-[0.28em] text-white/35">
                        Distribution
                      </dt>
                      <dd className="mt-2 text-white/55">
                        Claude, Codex, and shared agent surfaces
                      </dd>
                    </div>
                  </dl>
                </div>
              </div>
            </aside>

            <div className="min-w-0">
              <header className="sticky top-0 z-20 border-b border-border/70 bg-background/85 backdrop-blur-xl">
                <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-4 px-6 py-4 lg:px-12">
                  <div>
                    <p className="font-mono text-[10px] uppercase tracking-[0.35em] text-primary/80">
                      Team Setup
                    </p>
                    <p className="mt-2 text-sm text-muted-foreground">
                      Source-of-truth configuration for the shared Shiftbloom
                      Archon stack.
                    </p>
                  </div>
                  <div className="hidden rounded-full border border-border/70 bg-white/65 px-4 py-2 font-mono text-xs text-muted-foreground shadow-[0_12px_30px_rgba(15,15,15,0.04)] sm:block">
                    CONFIG_ROOT / {repoName}
                  </div>
                </div>
              </header>

              <main className="mx-auto w-full max-w-7xl px-6 py-8 lg:px-12 lg:py-10">
                {children}
              </main>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}
