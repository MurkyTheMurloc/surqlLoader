import type { Plugin } from "vite";
import fs from "fs/promises";
import path from "path";
import type { Parameter } from "../parameter.ts";

export default function surqlPlugin({ basePath = "/src" }: Parameter): Plugin {
  return {
    name: "vite:surql-loader",
    enforce: "pre",

    // Resolve “.surql” imports to absolute paths
    resolveId(source, importer) {
      if (source.endsWith(".surql") && importer) {
        const resolved = path.resolve(path.dirname(importer), source);
        console.log(`[vite:surql] resolveId "${source}" → "${resolved}"`);
        return resolved;
      }
      return null;
    },

    // Load and inline the .surql file as a JS string
    async load(id) {
      if (!id.endsWith(".surql")) return null;

      try {
        // If user wrote import "/src/foo.surql", treat that as project-root /src
        const fsPath = id.startsWith(basePath) ? `.${id}` : id;
        const raw = await fs.readFile(fsPath, "utf-8");
        const trimmed = raw.trim();
        console.log(`[vite:surql] load "${fsPath}" (${trimmed.length} chars)`);
        return `export default ${JSON.stringify(trimmed)};`;
      } catch (err: any) {
        console.error(`[vite:surql] load error "${id}": ${err.message}`);
        throw err;
      }
    },
  };
}
