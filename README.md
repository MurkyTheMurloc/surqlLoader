# surqlloader

**Universal `.surql` file loader for SurrealDB queries.**

Supports:

- ✅ Vite + Astro (Node.js)
- 🦕 Deno
- 🐇 Bun
- 📦 JSR (`jsr.io`)

---

## 🌐 Platform Compatibility

| Platform    | Import Path              | Notes              |
| ----------- | ------------------------ | ------------------ |
| **Node.js** | `surqlLoader/node/vite`  | Vite plugin        |
|             | `surqlLoader/node/astro` | Astro integration  |
| **Deno**    | `surqlLoader/deno/vite`  | Vite plugin        |
|             | `surqlLoader/deno/astro` | Astro integration  |
| **Bun**     | `surqlLoader/bun/vite`   | Vite plugin        |
|             | `surqlLoader/bun/astro`  | Astro integration  |
| **JSR**     | `@surql-loader/loader`   | Same usage as Deno |

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
import surqlLoader from "surqlloader/node/vite";

export default defineConfig({
  plugins: [surqlLoader()],
});
```

### typescript

```typescript
import listPosts from "./queries/listPosts.surql";

const result = await db.query(listPosts);
```
