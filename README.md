# surqlloader

**Universal `.surql` file loader for SurrealDB queries.**

Supports:

- ✅ Vite + Astro (Node.js)
- 🦕 Deno
- 🐇 Bun
- 📦 JSR (`jsr.io`)

---

## 🌐 Platform Compatibility

| Platform    | Import Path               | Notes              |
| ----------- | ------------------------- | ------------------ |
| **Node.js** | `surql-loader/node/vite`  | Vite plugin        |
|             | `surql-loader/node/astro` | Astro integration  |
| **Deno**    | `surql-loader/deno/vite`  | Vite plugin        |
|             | `surql-loader/deno/astro` | Astro integration  |
| **Bun**     | `surql-loader/bun/vite`   | Vite plugin        |
|             | `surql-loader/bun/astro`  | Astro integration  |
| **JSR**     | `@surql-loader/loader`    | Same usage as Deno |

---

## 📦 Installation

### Node.js (Vite / Astro)

```bash
npm install --save-dev surqlLoader

deno install jsr:@surql-loader/loader

```

## 🔧 Usage

### Vite (Node.js)

```ts
// vite.config.ts
import { defineConfig } from "vite";
import surqlLoader from "surql-loader/node/vite";

export default defineConfig({
  plugins: [surqlLoader()],
});
```

### typescript

```typescript
import listPosts from "./queries/listPosts.surql";

const result = await db.query(listPosts);
```
