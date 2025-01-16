import { defineConfig } from "vite";
import { resolve } from "path";
import { crx, defineManifest } from "@crxjs/vite-plugin";
import react from "@vitejs/plugin-react";
import { version } from "./package.json";

const OUTPUT_DIR = process.env.OUTPUT_DIR || "dist";

const manifest = defineManifest(async (env) => ({
  manifest_version: 3,
  name: `${env.mode === "development" ? "[DEV] " : ""}Snack Time`,
  version: version,
  description: "This extension is a timer to help you keep your break time.",
  permissions: ["activeTab", "scripting", "storage"],
  icons: {
    128: "images/icon.png",
  },
  action: {
    default_icon: "images/icon.png",
    default_popup: "popup/index.html",
  },
  options_ui: {
    page: "options/index.html",
    open_in_tab: true,
  },
  content_scripts: [
    {
      matches: ["<all_urls>"],
      js: ["content/index.tsx"],
    },
  ],
  web_accessible_resources: [
    {
      resources: ["sounds/*.wav"],
      matches: ["<all_urls>"],
    },
  ],
}));

export default defineConfig({
  plugins: [react(), crx({ manifest })],
  // @see https://github.com/crxjs/chrome-extension-tools/issues/696
  server: {
    port: 5173,
    strictPort: true,
    hmr: {
      port: 5173,
    },
  },
  resolve: {
    alias: {
      "@": resolve(__dirname, "src"),
    },
  },
  root: resolve(__dirname, "src"),
  publicDir: resolve(__dirname, "public"),
  build: {
    outDir: resolve(__dirname, OUTPUT_DIR),
    rollupOptions: {
      output: {
        chunkFileNames: "assets/chunk-[hash].js",
      },
    },
  },
});
