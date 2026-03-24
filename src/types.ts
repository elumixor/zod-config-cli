import type { z } from "zod";

export type ReadConfigOptions<S extends z.ZodTypeAny> = {
  cwd?: string;
  basename: string;
  schema: S;
  positionals?: z.ZodTuple<[z.ZodTypeAny, ...z.ZodTypeAny[]]>;
  envPrefix?: string;
};
