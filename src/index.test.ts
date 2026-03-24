import { afterEach, describe, expect, it } from "bun:test";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { z } from "zod";
import { readConfig } from "./index";

let tmpDir = "";

function makeTmpDir() {
  tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), "zod-config-test-"));
  return tmpDir;
}

afterEach(() => {
  if (tmpDir) fs.rmSync(tmpDir, { recursive: true, force: true });
  tmpDir = "";
});

const schema = z.object({
  port: z.coerce.number().default(3000),
  host: z.string().default("localhost"),
});

describe("readConfig", () => {
  describe("config file", () => {
    it("loads from .json file", async () => {
      const cwd = makeTmpDir();
      fs.writeFileSync(path.join(cwd, "app.config.json"), JSON.stringify({ port: 8080 }));

      const result = await readConfig({ cwd, basename: "app.config", schema });

      expect(result.port).toBe(8080);
      expect(result.host).toBe("localhost");
    });

    it("uses defaults when no config file exists", async () => {
      const cwd = makeTmpDir();
      const result = await readConfig({ cwd, basename: "app.config", schema });

      expect(result.port).toBe(3000);
      expect(result.host).toBe("localhost");
    });
  });

  describe("env variables", () => {
    it("loads from .env file", async () => {
      const cwd = makeTmpDir();
      fs.writeFileSync(path.join(cwd, ".env"), "PORT=9000\nHOST=example.com");

      const result = await readConfig({ cwd, basename: "app.config", schema });

      expect(result.port).toBe(9000);
      expect(result.host).toBe("example.com");
    });

    it("applies envPrefix", async () => {
      const cwd = makeTmpDir();
      fs.writeFileSync(path.join(cwd, ".env"), "APP_PORT=7000");

      const result = await readConfig({ cwd, basename: "app.config", schema, envPrefix: "APP_" });

      expect(result.port).toBe(7000);
    });

    it("env overrides config file", async () => {
      const cwd = makeTmpDir();
      fs.writeFileSync(path.join(cwd, "app.config.json"), JSON.stringify({ port: 8080 }));
      fs.writeFileSync(path.join(cwd, ".env"), "PORT=9000");

      const result = await readConfig({ cwd, basename: "app.config", schema });

      expect(result.port).toBe(9000);
    });
  });

  describe("positionals", () => {
    it("returns raw positionals", async () => {
      const cwd = makeTmpDir();
      const originalArgv = process.argv;
      process.argv = ["bun", "script.ts", "hello", "world"];

      try {
        const result = await readConfig({ cwd, basename: "app.config", schema });
        expect(result._).toEqual(["hello", "world"]);
      } finally {
        process.argv = originalArgv;
      }
    });

    it("parses typed positionals", async () => {
      const cwd = makeTmpDir();
      const originalArgv = process.argv;
      process.argv = ["bun", "script.ts", "42"];

      try {
        const result = await readConfig({
          cwd,
          basename: "app.config",
          schema,
          positionals: z.tuple([z.coerce.number()]),
        });
        expect(result._).toEqual([42]);
      } finally {
        process.argv = originalArgv;
      }
    });
  });
});
