import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";
import {
  ColorScheme,
  ThemeCategory,
  getThemesByCategory,
  getColorSchemeIcon,
  getEffectiveColorScheme,
  colorSchemeMetadata,
  themeCategories,
  themeCategoryOrder,
} from "./color-scheme";
import {
  Monitor,
  Sun,
  Moon,
  Citrus,
  Leaf,
  Flower,
  Flower2,
  MoonStar,
  Fish,
  Sunset,
  PenTool,
  Film,
  CloudRain,
} from "lucide-react";

describe("color-scheme", () => {
  describe("ColorScheme enum", () => {
    it("should have all expected color schemes", () => {
      expect(ColorScheme.System).toBe("system");
      expect(ColorScheme.Light).toBe("light");
      expect(ColorScheme.Dark).toBe("dark");
      expect(ColorScheme.Lemon).toBe("lemon");
      expect(ColorScheme.Mint).toBe("mint");
      expect(ColorScheme.Rose).toBe("rose");
      expect(ColorScheme.Lavender).toBe("lavender");
      expect(ColorScheme.NightSky).toBe("nightsky");
      expect(ColorScheme.DeepSea).toBe("deepsea");
      expect(ColorScheme.Twilight).toBe("twilight");
      expect(ColorScheme.Ink).toBe("ink");
      expect(ColorScheme.Sepia).toBe("sepia");
      expect(ColorScheme.EveningRain).toBe("eveningrain");
    });
  });

  describe("themeCategories", () => {
    it("should have basic and seijaku categories", () => {
      expect(themeCategories.basic).toBeDefined();
      expect(themeCategories.seijaku).toBeDefined();
    });

    it("should have correct label keys", () => {
      expect(themeCategories.basic.labelKey).toBe("themeCategory.basic");
      expect(themeCategories.seijaku.labelKey).toBe("themeCategory.seijaku");
    });
  });

  describe("themeCategoryOrder", () => {
    it("should have correct order", () => {
      expect(themeCategoryOrder).toEqual(["basic", "seijaku"]);
    });
  });

  describe("colorSchemeMetadata", () => {
    it("should have metadata for all color schemes", () => {
      Object.values(ColorScheme).forEach((scheme) => {
        expect(colorSchemeMetadata[scheme]).toBeDefined();
        expect(colorSchemeMetadata[scheme].icon).toBeDefined();
        expect(colorSchemeMetadata[scheme].category).toBeDefined();
      });
    });

    it("should categorize basic themes correctly", () => {
      const basicThemes = [
        ColorScheme.System,
        ColorScheme.Light,
        ColorScheme.Dark,
        ColorScheme.Lemon,
        ColorScheme.Mint,
        ColorScheme.Rose,
        ColorScheme.Lavender,
      ];
      basicThemes.forEach((theme) => {
        expect(colorSchemeMetadata[theme].category).toBe("basic");
      });
    });

    it("should categorize seijaku themes correctly", () => {
      const seijakuThemes = [
        ColorScheme.NightSky,
        ColorScheme.DeepSea,
        ColorScheme.Twilight,
        ColorScheme.Ink,
        ColorScheme.Sepia,
        ColorScheme.EveningRain,
      ];
      seijakuThemes.forEach((theme) => {
        expect(colorSchemeMetadata[theme].category).toBe("seijaku");
      });
    });

    it("should have correct icons for each theme", () => {
      expect(colorSchemeMetadata[ColorScheme.System].icon).toBe(Monitor);
      expect(colorSchemeMetadata[ColorScheme.Light].icon).toBe(Sun);
      expect(colorSchemeMetadata[ColorScheme.Dark].icon).toBe(Moon);
      expect(colorSchemeMetadata[ColorScheme.Lemon].icon).toBe(Citrus);
      expect(colorSchemeMetadata[ColorScheme.Mint].icon).toBe(Leaf);
      expect(colorSchemeMetadata[ColorScheme.Rose].icon).toBe(Flower);
      expect(colorSchemeMetadata[ColorScheme.Lavender].icon).toBe(Flower2);
      expect(colorSchemeMetadata[ColorScheme.NightSky].icon).toBe(MoonStar);
      expect(colorSchemeMetadata[ColorScheme.DeepSea].icon).toBe(Fish);
      expect(colorSchemeMetadata[ColorScheme.Twilight].icon).toBe(Sunset);
      expect(colorSchemeMetadata[ColorScheme.Ink].icon).toBe(PenTool);
      expect(colorSchemeMetadata[ColorScheme.Sepia].icon).toBe(Film);
      expect(colorSchemeMetadata[ColorScheme.EveningRain].icon).toBe(CloudRain);
    });
  });

  describe("getThemesByCategory", () => {
    it("should return basic themes for basic category", () => {
      const basicThemes = getThemesByCategory("basic");
      expect(basicThemes).toContain(ColorScheme.System);
      expect(basicThemes).toContain(ColorScheme.Light);
      expect(basicThemes).toContain(ColorScheme.Dark);
      expect(basicThemes).toContain(ColorScheme.Lemon);
      expect(basicThemes).toContain(ColorScheme.Mint);
      expect(basicThemes).toContain(ColorScheme.Rose);
      expect(basicThemes).toContain(ColorScheme.Lavender);
      expect(basicThemes).toHaveLength(7);
    });

    it("should return seijaku themes for seijaku category", () => {
      const seijakuThemes = getThemesByCategory("seijaku");
      expect(seijakuThemes).toContain(ColorScheme.NightSky);
      expect(seijakuThemes).toContain(ColorScheme.DeepSea);
      expect(seijakuThemes).toContain(ColorScheme.Twilight);
      expect(seijakuThemes).toContain(ColorScheme.Ink);
      expect(seijakuThemes).toContain(ColorScheme.Sepia);
      expect(seijakuThemes).toContain(ColorScheme.EveningRain);
      expect(seijakuThemes).toHaveLength(6);
    });

    it("should not include seijaku themes in basic category", () => {
      const basicThemes = getThemesByCategory("basic");
      expect(basicThemes).not.toContain(ColorScheme.NightSky);
      expect(basicThemes).not.toContain(ColorScheme.DeepSea);
    });

    it("should not include basic themes in seijaku category", () => {
      const seijakuThemes = getThemesByCategory("seijaku");
      expect(seijakuThemes).not.toContain(ColorScheme.System);
      expect(seijakuThemes).not.toContain(ColorScheme.Light);
    });
  });

  describe("getColorSchemeIcon", () => {
    it("should return correct icon for each color scheme", () => {
      expect(getColorSchemeIcon(ColorScheme.System)).toBe(Monitor);
      expect(getColorSchemeIcon(ColorScheme.Light)).toBe(Sun);
      expect(getColorSchemeIcon(ColorScheme.Dark)).toBe(Moon);
      expect(getColorSchemeIcon(ColorScheme.NightSky)).toBe(MoonStar);
    });

    it("should return Sparkles icon for unknown scheme", () => {
      const icon = getColorSchemeIcon("unknown" as ColorScheme);
      expect(icon).toBeDefined();
    });
  });

  describe("getEffectiveColorScheme", () => {
    const originalMatchMedia = window.matchMedia;

    beforeEach(() => {
      vi.resetAllMocks();
    });

    afterEach(() => {
      window.matchMedia = originalMatchMedia;
    });

    it("should return Dark when System is selected and OS prefers dark", () => {
      window.matchMedia = vi.fn().mockImplementation((query) => ({
        matches: query === "(prefers-color-scheme: dark)",
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      }));

      expect(getEffectiveColorScheme(ColorScheme.System)).toBe(ColorScheme.Dark);
    });

    it("should return Light when System is selected and OS prefers light", () => {
      window.matchMedia = vi.fn().mockImplementation((query) => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      }));

      expect(getEffectiveColorScheme(ColorScheme.System)).toBe(ColorScheme.Light);
    });

    it("should return Light when colorScheme is null and OS prefers light", () => {
      window.matchMedia = vi.fn().mockImplementation((query) => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      }));

      expect(getEffectiveColorScheme(null)).toBe(ColorScheme.Light);
    });

    it("should return Dark when colorScheme is undefined and OS prefers dark", () => {
      window.matchMedia = vi.fn().mockImplementation((query) => ({
        matches: query === "(prefers-color-scheme: dark)",
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      }));

      expect(getEffectiveColorScheme(undefined)).toBe(ColorScheme.Dark);
    });

    it("should return the same scheme when not System", () => {
      expect(getEffectiveColorScheme(ColorScheme.Light)).toBe(ColorScheme.Light);
      expect(getEffectiveColorScheme(ColorScheme.Dark)).toBe(ColorScheme.Dark);
      expect(getEffectiveColorScheme(ColorScheme.Lemon)).toBe(ColorScheme.Lemon);
      expect(getEffectiveColorScheme(ColorScheme.NightSky)).toBe(ColorScheme.NightSky);
    });
  });

  // applyColorSchemeClass is tested via E2E tests since it requires DOM
});
