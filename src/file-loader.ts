import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";

function tryLoadJSON(file: string) {
  try {
    const raw = fs.readFileSync(file, "utf-8");
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

async function tryLoadModule(file: string) {
  try {
    const mod = await import(pathToFileURL(file).href);
    return mod.default ?? mod;
  } catch {
    return null;
  }
}

export function resolveConfigFile(cwd: string, basename: string) {
  const exts = [".ts", ".js", ".mjs", ".cjs", ".json"];

  for (const ext of exts) {
    const full = path.resolve(cwd, basename + ext);
    if (fs.existsSync(full)) return full;
  }

  return null;
}

export async function loadConfigFile(configPath: string) {
  if (configPath.endsWith(".json")) return tryLoadJSON(configPath) ?? {};
  return (await tryLoadModule(configPath)) ?? {};
}
