import type { AstroIntegration } from "astro";
import type { Parameter } from "../parameter.ts";
const decoder = new TextDecoder("utf-8");
import * as path from "@std/path";
export default function astroSurql({
  basePath = "/src",
}: Parameter): AstroIntegration {
  return {
    name: "astro:surql",
    hooks: {
      "astro:config:setup": ({ updateConfig, config, logger }) => {
        // Log start of config setup
        logger.info(`[astro:surql] configuring .surql loader plugin`); // info-level startup message

        updateConfig({
          vite: {
            plugins: [
              {
                name: "vite:surql-loader",
                enforce: "pre",
                resolveId(source, importer) {
                  logger.debug(
                    `[astro:surql][resolveId] source="${source}" importer="${importer}"`,
                  );
                  if (source.endsWith(".surql")) {
                    const resolved = path.resolve(
                      path.dirname(importer!),
                      source,
                    );

                    return resolved;
                  }
                },
                async load(id) {
                  if (!id.endsWith(".surql")) {
                    return null;
                  }
                  try {
                    // Support absolute “/src” imports against project root
                    const fsPath = id.startsWith(basePath) ? `.${id}` : id;
                    const content = decoder.decode(Deno.readFileSync(fsPath));
                    const trimmed = content.trim();
                    logger.info(
                      `[astro:surql][load] loaded ${trimmed.length} chars from "${fsPath}"`,
                    );
                    return `export default ${JSON.stringify(trimmed)};`;
                  } catch (err: any) {
                    logger.error(
                      `[astro:surql][load] failed to read "${id}": ${err.message}`,
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
