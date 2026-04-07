import { defineConfig } from "wxt";

export default defineConfig({
  srcDir: "src",
  entrypointsDir: "../entrypoints",
  modules: ["@wxt-dev/module-react"],
  manifest: {
    permissions: ["activeTab", "scripting", "storage"],
    default_locale: "en",
    name: "__MSG_extName__",
    description: "__MSG_extDescription__",
    action: {},
    web_accessible_resources: [
      { resources: ["sounds/*.wav"], matches: ["<all_urls>"] },
    ],
  },
});
