import { defineConfig } from "wxt";
import pkg from "./package.json";

const chromeVersion = pkg.version
  .split(".")
  .map((n) => String(parseInt(n, 10)))
  .join(".");

export default defineConfig({
  srcDir: "src",
  entrypointsDir: "../entrypoints",
  modules: ["@wxt-dev/module-react"],
  manifest: {
    permissions: ["activeTab", "scripting", "storage"],
    default_locale: "en",
    name: "__MSG_extName__",
    description: "__MSG_extDescription__",
    version: chromeVersion,
    version_name: pkg.version,
    action: {},
    web_accessible_resources: [
      { resources: ["sounds/*.wav"], matches: ["<all_urls>"] },
    ],
  },
});
