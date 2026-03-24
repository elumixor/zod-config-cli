import { z } from "zod";
import { parseCli } from "./cli-parser";
import { loadEnv, extractEnv } from "./env-loader";
import { resolveConfigFile, loadConfigFile } from "./file-loader";
import type { ReadConfigOptions } from "./types";

export type { ReadConfigOptions };

export async function readConfig<S extends z.ZodTypeAny>(
  opts: ReadConfigOptions<S>,
): Promise<z.infer<S> & { _: unknown[] }> {
  const cwd = opts.cwd ?? process.cwd();

  const configPath = resolveConfigFile(cwd, opts.basename);
  const fileConfig = configPath ? await loadConfigFile(configPath) : {};

  const envFile = loadEnv(cwd);
  const env = { ...envFile, ...process.env } as Record<string, string>;
  const envConfig = extractEnv(opts.schema, env, opts.envPrefix);

  const { values: cliConfig, positionals } = parseCli(opts.schema);

  const merged = { ...fileConfig, ...envConfig, ...cliConfig };
  const parsedOptions = opts.schema.parse(merged);

  const parsedPositionals = opts.positionals ? opts.positionals.parse(positionals) : positionals;

  return { ...(parsedOptions as object), _: parsedPositionals } as z.infer<S> & { _: unknown[] };
}
