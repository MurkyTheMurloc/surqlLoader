import { readFileSync, writeFileSync, existsSync } from "node:fs";

export function addGlobalTypesToTsConfig(path: string, logger: unknown): void {
  if (!existsSync(path)) {
    logger.warn(`tsconfig not found at path: ${path}`);
    return;
  }

  let raw: string;
  try {
    raw = readFileSync(path, { encoding: "utf-8" });
  } catch (err) {
    logger.error(`Failed to read tsconfig at ${path}:`, err);
    return;
  }

  let tsconfig: any;
  try {
    tsconfig = JSON.parse(raw);
  } catch (err) {
    logger.error(`Invalid JSON in tsconfig at ${path}:`, err);
    return;
  }

  // Ensure there's a compilerOptions object
  if (
    tsconfig.compilerOptions == null ||
    typeof tsconfig.compilerOptions !== "object"
  ) {
    tsconfig.compilerOptions = {};
  }

  // Ensure there's a types array
  if (!Array.isArray(tsconfig.compilerOptions.types)) {
    tsconfig.compilerOptions.types = [];
  }

  const desiredTypeEntry = "node_modules/surqlLoader/types";

  // Check if the entry already exists (exact match)
  const alreadyIncluded =
    tsconfig.compilerOptions.types.includes(desiredTypeEntry);

  if (alreadyIncluded) {
    logger.info(`"${desiredTypeEntry}" is already included in tsconfig types.`);
    return;
  }

  // Insert the entry
  tsconfig.compilerOptions.include.push(desiredTypeEntry);
  logger.info(`Added "${desiredTypeEntry}" to tsconfig types.`);

  // Write the updated tsconfig back to disk with 2-space indentation
  try {
    const updated = JSON.stringify(tsconfig, null, 2) + "\n";
    writeFileSync(path, updated, { encoding: "utf-8" });
    logger.info(`Successfully updated tsconfig at ${path}.`);
  } catch (err) {
    logger.error(`Failed to write updated tsconfig to ${path}:`, err);
  }
}
