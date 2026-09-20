import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

// Unit tests cover plain TS (utils, schemas); no Nuxt runtime needed.
export default defineConfig({
  resolve: {
    alias: { "~": fileURLToPath(new URL("./app", import.meta.url)) },
  },
  test: {
    include: ["test/unit/**/*.test.ts"],
  },
});
