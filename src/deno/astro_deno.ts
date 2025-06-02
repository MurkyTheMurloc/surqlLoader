import type { AstroIntegration } from "astro";
const decoder = new TextDecoder("utf-8");
import { addGlobalTypesToTsConfig } from "../utils.ts";
import path from "node:path";
export default function astroSurql(): AstroIntegration {
  return {
    name: "astro:surql",
    hooks: {
      "astro:config:setup": ({ updateConfig, config, logger }) => {
        logger.info(`[astro:surql] configuring .surql loader plugin`);
        const typesFilePath = `${config.root.pathname}deno.json`;
        console.log("typesFilePath", typesFilePath);
        addGlobalTypesToTsConfig(typesFilePath, logger);
        updateConfig({
          vite: {
            plugins: [
              {
                name: "vite:surql-loader",
                enforce: "pre",
                resolveId(source, importer) {
                  logger.debug(
                    `[astro:surql][resolveId] source="${source}" importer="${importer}"`
                  );
                  if (source.endsWith(".surql")) {
                    const resolved = path.resolve(
                      path.dirname(importer!),
                      source
                    );

                    return resolved;
                  }
                },
                async load(id) {
                  if (!id.endsWith(".surql")) {
                    return null;
                  }
                  try {
                    const content = decoder.decode(Deno.readFileSync(id));
                    const trimmed = content.trim();
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
