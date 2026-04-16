"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";

interface MarkdownEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export function MarkdownEditor({
  value,
  onChange,
  placeholder,
}: MarkdownEditorProps) {
  const [tab, setTab] = useState<string>("edit");
  const lineCount = value ? value.split("\n").length : 0;

  return (
    <Tabs value={tab} onValueChange={setTab} className="flex h-full flex-col gap-4">
      <div className="flex items-center justify-between gap-4">
        <TabsList variant="line" className="h-auto gap-1 rounded-full bg-transparent p-0">
          <TabsTrigger
            value="edit"
            className="rounded-full border border-border/70 px-4 py-2 text-xs data-active:border-primary/20 data-active:bg-white data-active:text-foreground"
          >
            Edit
          </TabsTrigger>
          <TabsTrigger
            value="preview"
            className="rounded-full border border-border/70 px-4 py-2 text-xs data-active:border-primary/20 data-active:bg-white data-active:text-foreground"
          >
            Preview
          </TabsTrigger>
        </TabsList>
        <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
          {lineCount} lines
        </p>
      </div>

      <TabsContent value="edit" className="mt-0 flex-1">
        <Textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="editor-surface min-h-[440px] resize-none rounded-[1.75rem] border border-border/70 bg-white/75 px-5 py-4 font-mono text-sm leading-7 backdrop-blur-sm"
        />
      </TabsContent>

      <TabsContent value="preview" className="mt-0 flex-1">
        <div className="editor-surface min-h-[440px] rounded-[1.75rem] border border-border/70 bg-[#fffaf4] p-5">
          <pre className="whitespace-pre-wrap font-mono text-sm leading-7 text-foreground/80">
            {value || "No content"}
          </pre>
        </div>
      </TabsContent>
    </Tabs>
  );
}
