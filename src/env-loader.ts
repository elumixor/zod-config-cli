import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import { z } from "zod";

export function loadEnv(cwd: string): Record<string, string> {
  const envPath = path.resolve(cwd, ".env");
  if (fs.existsSync(envPath)) return dotenv.parse(fs.readFileSync(envPath));
  return {};
}

export function extractEnv(schema: z.ZodTypeAny, env: Record<string, string>, prefix?: string) {
  if (!(schema instanceof z.ZodObject)) return {};

  const shape = schema.shape as Record<string, unknown>;
  const result: Record<string, string> = {};

  for (const key in shape) {
    const envKey = (prefix ? prefix + key : key).toUpperCase();
    if (env[envKey] !== undefined) result[key] = env[envKey] as string;
  }

  return result;
}
