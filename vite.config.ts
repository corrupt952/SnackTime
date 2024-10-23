import { defineConfig, loadEnv } from "vite";
import { resolve } from "path";

// Don't working 'inlineDynamicImports' when multiple input files
// So we need to specify a target file
const target = process.env.BUILD_TARGET;
if (!target) {
  throw new Error("BUILD_TARGET is not defined");
}

export default defineConfig({
  resolve: {
    alias: {
      "@": resolve(__dirname, "src"),
    },
  },
  build: {
    emptyOutDir: false,
    outDir: "dist",
    rollupOptions: {
      input: resolve(__dirname, target),
      output: {
        entryFileNames: "[name].js",
        inlineDynamicImports: true,
        format: "iife",
      },
    },
  },
});
