import { defineConfig } from "tsdown/config";

export default defineConfig({
  entry: "src/node/*",
  platform: "node",
  dts: true,
  format: "esm",
  outDir: "./build",
});
