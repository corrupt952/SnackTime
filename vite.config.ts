import { defineConfig } from "vite";
import { resolve } from "path";
import { crx, defineManifest } from "@crxjs/vite-plugin";
import react from "@vitejs/plugin-react";
import { version } from "./package.json";

const OUTPUT_DIR = process.env.OUTPUT_DIR || "dist";

const manifest = defineManifest(async (env) => ({
  manifest_version: 3,
  name: `${env.mode === "development" ? "[DEV] " : ""}Snack Time - Online Timer`,
  version: version,
  description: "This extension is a timer on the website to help with timekeeping for meetings",
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

// Storybook builds require different configuration:
// - CRX plugin must be disabled as it conflicts with Storybook's build process
// - root/publicDir settings must be undefined to use Vite's defaults
// This is controlled by the STORYBOOK_BUILD environment variable set in package.json
const isStorybook = process.env.STORYBOOK_BUILD === 'true';

export default defineConfig({
  plugins: isStorybook ? [react()] : [react(), crx({ manifest })],
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
  // Chrome extension needs custom root/publicDir, but Storybook requires defaults
  root: isStorybook ? undefined : resolve(__dirname, "src"),
  publicDir: isStorybook ? undefined : resolve(__dirname, "public"),
  build: {
    outDir: resolve(__dirname, OUTPUT_DIR),
    rollupOptions: {
      output: {
        chunkFileNames: "assets/chunk-[hash].js",
      },
    },
  },
});
