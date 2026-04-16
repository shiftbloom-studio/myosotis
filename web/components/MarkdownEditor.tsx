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

  return (
    <Tabs value={tab} onValueChange={setTab} className="flex h-full flex-col">
      <TabsList className="w-fit bg-muted/50">
        <TabsTrigger value="edit" className="text-xs">
          Edit
        </TabsTrigger>
        <TabsTrigger value="preview" className="text-xs">
          Preview
        </TabsTrigger>
      </TabsList>
      <TabsContent value="edit" className="flex-1">
        <Textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="h-full min-h-[400px] resize-none bg-background/40 font-mono text-sm leading-relaxed backdrop-blur-sm"
        />
      </TabsContent>
      <TabsContent value="preview" className="flex-1">
        <div className="min-h-[400px] rounded-lg border border-border/40 bg-card/40 p-5 backdrop-blur-sm">
          <pre className="whitespace-pre-wrap font-mono text-sm leading-relaxed text-foreground/80">
            {value || "No content"}
          </pre>
        </div>
      </TabsContent>
    </Tabs>
  );
}
