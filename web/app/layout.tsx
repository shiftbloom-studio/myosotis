import type { Metadata } from "next";
import { Geist_Mono } from "next/font/google";
import Image from "next/image";
import { TabNav } from "@/components/TabNav";
import { SyncButton } from "@/components/SyncButton";
import "./globals.css";

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Team Setup — Shiftbloom",
  description: "Manage MCP servers, skills, and team instructions",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistMono.variable} h-full antialiased`}>
      <body className="shiftbloom-bg flex min-h-full flex-col">
        <header className="border-b border-border/60 bg-white/40 backdrop-blur-md">
          <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
            <div className="flex items-center gap-3">
              <Image
                src="/logo.png"
                alt="Shiftbloom Studio Logo"
                width={36}
                height={36}
                className="rounded-lg"
              />
              <div>
                <h1 className="text-lg font-bold tracking-wider">
                  <span className="gradient-text">shiftbloom</span>{" "}
                  <span className="text-[#e63946]">studio.</span>
                </h1>
                <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-muted-foreground">
                  Team Setup
                </p>
              </div>
            </div>
            <SyncButton />
          </div>
        </header>
        <TabNav />
        <main className="mx-auto w-full max-w-5xl flex-1 px-6 py-8">
          {children}
        </main>
        <footer className="border-t border-border/40 py-4 text-center text-xs text-muted-foreground">
          Shiftbloom Studio — Team Configuration Management
        </footer>
      </body>
    </html>
  );
}
