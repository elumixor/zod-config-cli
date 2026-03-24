import { parseArgs } from "node:util";
import { z } from "zod";

function buildCliOptions(schema: z.ZodTypeAny) {
  if (!(schema instanceof z.ZodObject)) return {};

  const shape = schema.shape as Record<string, unknown>;
  const options: Record<string, { type: "string" }> = {};

  for (const key in shape) {
    options[key] = { type: "string" };
  }

  return options;
}

export function parseCli(schema: z.ZodTypeAny) {
  const options = buildCliOptions(schema);
  const parsed = parseArgs({ options, allowPositionals: true });
  return { values: parsed.values, positionals: parsed.positionals ?? [] };
}
