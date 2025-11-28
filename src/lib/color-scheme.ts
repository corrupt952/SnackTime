import {
  Monitor,
  Sun,
  Moon,
  Citrus,
  Leaf,
  Flower,
  MoonStar,
  Flower2,
  Sparkles,
  Circle,
  Fish,
  Sunset,
  PenTool,
  Film,
  CloudRain,
  type LucideIcon,
} from "lucide-react";

export enum ColorScheme {
  System = "system",
  Light = "light",
  Dark = "dark",
  Lemon = "lemon",
  Mint = "mint",
  Rose = "rose",
  Lavender = "lavender",
  // 静寂 (Seijaku) themes
  NightSky = "nightsky",
  DeepSea = "deepsea",
  Twilight = "twilight",
  Ink = "ink",
  Sepia = "sepia",
  EveningRain = "eveningrain",
}

export type ThemeCategory = "basic" | "seijaku";

export interface ThemeCategoryMetadata {
  labelKey: string;
  icon: LucideIcon;
}

export const themeCategories: Record<ThemeCategory, ThemeCategoryMetadata> = {
  basic: { labelKey: "themeCategory.basic", icon: Circle },
  seijaku: { labelKey: "themeCategory.seijaku", icon: MoonStar },
};

export const themeCategoryOrder: ThemeCategory[] = ["basic", "seijaku"];

interface ColorSchemeMetadata {
  icon: LucideIcon;
  category: ThemeCategory;
}

export const colorSchemeMetadata: Record<ColorScheme, ColorSchemeMetadata> = {
  [ColorScheme.System]: { icon: Monitor, category: "basic" },
  [ColorScheme.Light]: { icon: Sun, category: "basic" },
  [ColorScheme.Dark]: { icon: Moon, category: "basic" },
  [ColorScheme.Lemon]: { icon: Citrus, category: "basic" },
  [ColorScheme.Mint]: { icon: Leaf, category: "basic" },
  [ColorScheme.Rose]: { icon: Flower, category: "basic" },
  [ColorScheme.Lavender]: { icon: Flower2, category: "basic" },
  // 静寂 (Seijaku) themes
  [ColorScheme.NightSky]: { icon: MoonStar, category: "seijaku" },
  [ColorScheme.DeepSea]: { icon: Fish, category: "seijaku" },
  [ColorScheme.Twilight]: { icon: Sunset, category: "seijaku" },
  [ColorScheme.Ink]: { icon: PenTool, category: "seijaku" },
  [ColorScheme.Sepia]: { icon: Film, category: "seijaku" },
  [ColorScheme.EveningRain]: { icon: CloudRain, category: "seijaku" },
};

export const getThemesByCategory = (category: ThemeCategory): ColorScheme[] => {
  return Object.entries(colorSchemeMetadata)
    .filter(([_, meta]) => meta.category === category)
    .map(([scheme]) => scheme as ColorScheme);
};

export const getColorSchemeIcon = (scheme: ColorScheme): LucideIcon => {
  return colorSchemeMetadata[scheme]?.icon ?? Sparkles;
};

/**
 * System設定の場合はOSのダークモード設定を判定して実際のテーマを返す
 */
export const getEffectiveColorScheme = (colorScheme: ColorScheme | null | undefined): ColorScheme => {
  if (colorScheme === ColorScheme.System || !colorScheme) {
    const isDarkMode = window.matchMedia("(prefers-color-scheme: dark)").matches;
    return isDarkMode ? ColorScheme.Dark : ColorScheme.Light;
  }
  return colorScheme;
};

/**
 * 要素にColorSchemeクラスを適用する
 */
export const applyColorSchemeClass = (element: HTMLElement, colorScheme: ColorScheme | null | undefined): void => {
  // 既存のテーマクラスを削除
  Object.values(ColorScheme).forEach((scheme) => {
    element.classList.remove(scheme);
  });
  element.classList.remove("dark", "light");

  // 新しいテーマクラスを追加
  const effective = getEffectiveColorScheme(colorScheme);
  element.classList.add(effective);
};
