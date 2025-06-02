import type { Plugin } from "vite";
const decoder = new TextDecoder("utf-8");
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
    }, // Load and inline the .surql file as a JS string
    async load(id) {
      if (!id.endsWith(".surql")) return null;

      try {
        const content = decoder.decode(Deno.readFileSync(id));
        const trimmed = content.trim();
        console.log(`[vite:surql] load "${id}" (${trimmed.length} chars)`);
        return `export default ${JSON.stringify(trimmed)};`;
      } catch (err: any) {
        console.error(`[vite:surql] load error "${id}": ${err.message}`);
        throw err;
      }
    },
  };
}
