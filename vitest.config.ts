/// <reference types="vitest" />
import { defineConfig } from "vite";
import path from "path";

export default defineConfig({
  test: {
    globals: true,
    setupFiles: ["src/test/setup.ts"],
    exclude: ["e2e/**", "node_modules/**"],
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
