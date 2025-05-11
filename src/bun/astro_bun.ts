import type { AstroIntegration } from "astro";
import type { Parameter } from "../parameter.ts";
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
                  if (source.endsWith(".surql")) {
                    const resolved = Bun.resolveSync(importer!, source);

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
                    const content = Bun.file(fsPath);
                    const trimmed = (await content.text()).trim();
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
