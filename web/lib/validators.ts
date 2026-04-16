import { z } from "zod/v4";

export const mcpEnvVarSchema = z.record(z.string(), z.string());

export const mcpServerSchema = z.object({
  command: z.string().min(1, "Command is required"),
  args: z.array(z.string()),
  env: mcpEnvVarSchema.optional(),
  description: z.string().optional(),
});

export type McpServer = z.infer<typeof mcpServerSchema>;

export const mcpServersFileSchema = z.object({
  mcpServers: z.record(z.string(), mcpServerSchema),
});

export type McpServersFile = z.infer<typeof mcpServersFileSchema>;

export const skillSchema = z.object({
  name: z
    .string()
    .min(1, "Skill name is required")
    .regex(
      /^[a-z0-9-]+$/,
      "Skill name must be lowercase with hyphens only"
    ),
  content: z.string().min(1, "Skill content is required"),
});

export type Skill = z.infer<typeof skillSchema>;
