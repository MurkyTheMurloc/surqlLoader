import type { Plugin } from "vite";
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
        const fsPath = id;
        const content = Bun.file(fsPath);
        const trimmed = (await content.text()).trim();
        console.log(`[vite:surql] load "${fsPath}" (${trimmed.length} chars)`);
        return `export default ${JSON.stringify(trimmed)};`;
      } catch (err: any) {
        console.error(`[vite:surql] load error "${id}": ${err.message}`);
        throw err;
      }
    },
  };
}
