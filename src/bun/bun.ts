import type { Plugin } from "vite";
import type { Parameter } from "../parameter.ts";
export default function surqlPlugin({ basePath = "/src" }: Parameter): Plugin {
  return {
    name: "vite:surql-loader",
    enforce: "pre",

    // Resolve “.surql” imports to absolute paths
    resolveId(source, importer) {
      if (source.endsWith(".surql") && importer) {
        const resolved = Bun.resolveSync(importer!, source);
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
