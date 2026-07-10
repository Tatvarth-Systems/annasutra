<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.

<!-- END:nextjs-agent-rules -->

## Code style

These rules apply across the entire codebase.

1. **Arrow functions only.** Write `const fn = () => {}`, never `function fn() {}`. This applies to all utilities, handlers, hooks, and components.
2. **One-line JSDoc above every function.** Describe what it does in a single sentence — no multi-line blocks, no parameter docs unless the purpose is genuinely non-obvious. Example:

   ```ts
   /** Returns the percentage of value relative to total, rounded to 2 decimal places. */
   export const percentage = (value: number, total: number): number => ...

   ```

3. **`&&` over `?` ternary when one side is `null`.** Write `condition && value` rather than `condition ? value : null`. Exception: if the condition can be `0`, `false`, or `''` — those short-circuit to the wrong value; keep the ternary.
