import type { AstroIntegration } from "astro";
import "../../global.d.ts";
import path from "node:path";
import { addGlobalTypesToTsConfig } from "../utils.ts";
export default function astroSurql(): AstroIntegration {
  return {
    name: "astro:surql",
    hooks: {
      "astro:config:setup": ({ updateConfig, config, logger }) => {
        // Log start of config setup
        logger.info(`[astro:surql] configuring .surql loader plugin`); // info-level startup message
        const typesFilePath = `${config.root.pathname}tsconfig.json`;
        addGlobalTypesToTsConfig(typesFilePath, logger);
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
                    const content = Bun.file(id);
                    console.info("content", await content.text());
                    const trimmed = (await content.text()).trim();
                    logger.info(
                      `[astro:surql][load] loaded ${trimmed.length} chars from "${id}"`
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
