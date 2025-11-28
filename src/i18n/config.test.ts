import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";
import { resolveLanguage, changeLanguage, supportedLanguages, resources, defaultNS } from "./config";
import i18n from "i18next";

// Mock chrome.i18n
const mockChrome = {
  i18n: {
    getUILanguage: vi.fn(),
  },
};

describe("i18n/config", () => {
  const originalChrome = global.chrome;
  const originalNavigator = global.navigator;

  beforeEach(() => {
    vi.resetAllMocks();
    // Reset chrome mock
    (global as any).chrome = mockChrome;
  });

  afterEach(() => {
    (global as any).chrome = originalChrome;
  });

  describe("supportedLanguages", () => {
    it("should include system, en, and ja languages", () => {
      expect(supportedLanguages).toHaveLength(3);
      expect(supportedLanguages.map((l) => l.code)).toEqual(["system", "en", "ja"]);
    });

    it("should have correct language names", () => {
      const system = supportedLanguages.find((l) => l.code === "system");
      const en = supportedLanguages.find((l) => l.code === "en");
      const ja = supportedLanguages.find((l) => l.code === "ja");

      expect(system?.name).toBe("System");
      expect(en?.name).toBe("English");
      expect(ja?.name).toBe("Japanese");
    });

    it("should have native names", () => {
      const en = supportedLanguages.find((l) => l.code === "en");
      const ja = supportedLanguages.find((l) => l.code === "ja");

      expect(en?.nativeName).toBe("English");
      expect(ja?.nativeName).toBe("日本語");
    });
  });

  describe("resources", () => {
    it("should have en and ja resources", () => {
      expect(resources.en).toBeDefined();
      expect(resources.ja).toBeDefined();
    });

    it("should have translation namespace", () => {
      expect(resources.en.translation).toBeDefined();
      expect(resources.ja.translation).toBeDefined();
    });
  });

  describe("defaultNS", () => {
    it("should be translation", () => {
      expect(defaultNS).toBe("translation");
    });
  });

  describe("resolveLanguage", () => {
    it("should return en when language is en", () => {
      expect(resolveLanguage("en")).toBe("en");
    });

    it("should return ja when language is ja", () => {
      expect(resolveLanguage("ja")).toBe("ja");
    });

    describe("with system language", () => {
      it("should return ja when chrome.i18n returns ja", () => {
        mockChrome.i18n.getUILanguage.mockReturnValue("ja");
        expect(resolveLanguage("system")).toBe("ja");
      });

      it("should return ja when chrome.i18n returns ja-JP", () => {
        mockChrome.i18n.getUILanguage.mockReturnValue("ja-JP");
        expect(resolveLanguage("system")).toBe("ja");
      });

      it("should return en when chrome.i18n returns en", () => {
        mockChrome.i18n.getUILanguage.mockReturnValue("en");
        expect(resolveLanguage("system")).toBe("en");
      });

      it("should return en when chrome.i18n returns en-US", () => {
        mockChrome.i18n.getUILanguage.mockReturnValue("en-US");
        expect(resolveLanguage("system")).toBe("en");
      });

      it("should return en for other languages (fallback)", () => {
        mockChrome.i18n.getUILanguage.mockReturnValue("fr");
        expect(resolveLanguage("system")).toBe("en");
      });

      it("should fallback to navigator.language when chrome.i18n is unavailable", () => {
        (global as any).chrome = undefined;
        Object.defineProperty(global, "navigator", {
          value: { language: "ja-JP" },
          writable: true,
        });

        expect(resolveLanguage("system")).toBe("ja");

        Object.defineProperty(global, "navigator", {
          value: originalNavigator,
          writable: true,
        });
      });

      it("should return en when navigator.language is not Japanese", () => {
        (global as any).chrome = undefined;
        Object.defineProperty(global, "navigator", {
          value: { language: "de-DE" },
          writable: true,
        });

        expect(resolveLanguage("system")).toBe("en");

        Object.defineProperty(global, "navigator", {
          value: originalNavigator,
          writable: true,
        });
      });
    });
  });

  describe("changeLanguage", () => {
    it("should call i18n.changeLanguage with resolved language", () => {
      const spy = vi.spyOn(i18n, "changeLanguage");

      changeLanguage("en");
      expect(spy).toHaveBeenCalledWith("en");

      changeLanguage("ja");
      expect(spy).toHaveBeenCalledWith("ja");
    });

    it("should resolve system language before changing", () => {
      const spy = vi.spyOn(i18n, "changeLanguage");
      mockChrome.i18n.getUILanguage.mockReturnValue("ja");

      changeLanguage("system");
      expect(spy).toHaveBeenCalledWith("ja");
    });
  });
});
