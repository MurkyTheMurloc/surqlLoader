import type { AstroIntegration } from "astro";
import fs from "node:fs/promises";
import path from "node:path";
import "../../global.d.ts";
import { addGlobalTypes } from "../utils.ts";
export default function astroSurql(): AstroIntegration {
  return {
    name: "astro:surql",
    hooks: {
      "astro:config:setup": ({ updateConfig, config, logger }) => {
        logger.info(`[astro:surql] configuring .surql loader plugin`);
        const typesFilePath = `${config.root.pathname}.astro/types.d.ts`;

        addGlobalTypes(typesFilePath, logger);
        updateConfig({
          vite: {
            plugins: [
              {
                name: "vite:surql-loader",
                enforce: "pre",
                resolveId(source, importer) {
                  if (!source.endsWith(".surql")) {
                    return null;
                  }
                  return path.resolve(path.dirname(importer!), source);
                },
                async load(id) {
                  if (!id.endsWith(".surql")) {
                    return null;
                  }
                  try {
                    // Support absolute “/src” imports against project root
                    const fsPath = id.startsWith("/src") ? `.${id}` : id;
                    const content = await fs.readFile(fsPath, "utf-8");
                    const trimmed = content.trim();
                    logger.info(
                      `[astro:surql][load] loaded ${trimmed.length} chars from "${fsPath}"`
                    );
                    return `export default ${JSON.stringify(trimmed)};`;
                  } catch (err: any) {
                    logger.error(
                      `[astro:surql][load] failed to read "${id}": ${err.message}`
                    );
                    throw err;
                  }
                },
              },
            ],
          },
        });

        logger.info(`[astro:surql] Vite plugin registered successfully`);
      },
    },
  };
}
