## Code Style

- Use `??` instead of `||` for defaults
- No `getXXX()`/`setXXX()` methods — use property accessors
- No unnecessary `?` optional chaining
- Don't use `!` — throw descriptive errors
- Don't abbreviate names (exceptions: `i` for loop index, `e` in catch, `x`/`y` for coordinates)
- Single-statement blocks: no braces, one line (e.g., `if (condition) throw error;`)
- Compact object returns: `return { inlineData: { mimeType, data } };`
- Use `Promise.withResolvers()` instead of `new Promise()` when exposing resolve/reject outside executor
- Don't define excessive helper interfaces/types — rely on TypeScript inference
- Never silence errors: `catch (e) { throw new Error("Descriptive message: " + e.message); }`
- Write self-explanatory code; avoid obvious comments

```typescript
class Example {
  private readonly field = new Field(); // assign directly when possible
  constructor(private readonly dependency: Dependency) {} // use constructor when init requires params
}
```
