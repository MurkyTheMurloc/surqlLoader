import type { Plugin } from "vite";
import fs from "node:fs/promises";
import path from "node:path";

export default function surqlPlugin(): Plugin {
  return {
    name: "vite:surql-loader",
    enforce: "pre",

    resolveId(source, importer) {
      if (!source.endsWith(".surql")) {
        return null;
      }
      return path.resolve(path.dirname(importer!), source);
    },

    async load(id) {
      if (!id.endsWith(".surql")) return null;

      try {
        // If user wrote import "/src/foo.surql", treat that as project-root /src
        const raw = await fs.readFile(id, "utf-8");
        const trimmed = raw.trim();
        console.log(`[vite:surql] load "${id}" (${trimmed.length} chars)`);
        return `export default ${JSON.stringify(trimmed)};`;
      } catch (err: any) {
        console.error(`[vite:surql] load error "${id}": ${err.message}`);
        throw err;
      }
    },
  };
}
