# @elumixor/zod-config-cli

Reads configuration from a config file, `.env`, and CLI args — merged and validated with [Zod](https://zod.dev).

## Installation

```bash
npm install @elumixor/zod-config-cli zod
# or
bun add @elumixor/zod-config-cli zod
```

## Usage

```ts
import { readConfig } from "@elumixor/zod-config-cli";
import { z } from "zod";

const schema = z.object({
  port: z.coerce.number().default(3000),
  output: z.string().default("dist"),
});

const config = await readConfig({
  basename: "mycommand.config",
  schema,
});

console.log(config.port);   // number
console.log(config.output); // string
```

## Options

| Option | Type | Description |
|--------|------|-------------|
| `basename` | `string` | Config file name without extension (e.g. `"mycommand.config"`) |
| `schema` | `z.ZodObject` | Zod schema for named options |
| `cwd` | `string` | Working directory to resolve files from (default: `process.cwd()`) |
| `envPrefix` | `string` | Env var prefix, e.g. `"APP_"` maps `APP_PORT` → `port` |
| `positionals` | `z.ZodTuple` | Schema for positional CLI arguments, returned as `_` |

## Config sources

Values are merged in order of increasing priority:

1. **Config file** — auto-detected by extension: `.ts`, `.js`, `.mjs`, `.cjs`, `.json`
2. **`.env` file** — parsed from `cwd`; also merges `process.env`
3. **CLI args** — `--port 8080`, `--output build`

### Config file example

`mycommand.config.json`:
```json
{ "port": 8080, "output": "build" }
```

`mycommand.config.ts`:
```ts
export default { port: 8080, output: "build" };
```

### Env file example

`.env`:
```
PORT=8080
OUTPUT=build
```

With `envPrefix: "APP_"`:
```
APP_PORT=8080
APP_OUTPUT=build
```

### Positional arguments

```ts
const config = await readConfig({
  basename: "mycommand.config",
  schema,
  positionals: z.tuple([z.string(), z.coerce.number(), z.coerce.date()]),
});

// mycommand input.txt 42 2024-01-01
console.log(config._); // ["input.txt", 42, Date]
```

## Development

```bash
bun install
bun test       # run tests
bun run build  # compile to dist/
```
