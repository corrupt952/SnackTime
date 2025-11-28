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
  type LucideIcon,
} from "lucide-react";

export enum ColorScheme {
  System = "system",
  Light = "light",
  Dark = "dark",
  Lemon = "lemon",
  Mint = "mint",
  Rose = "rose",
  Yorusora = "yorusora",
  Lavender = "lavender",
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

interface PreviewColors {
  background: string;
  primary: string;
  accent: string;
}

interface ColorSchemeMetadata {
  icon: LucideIcon;
  category: ThemeCategory;
  previewColors: PreviewColors;
}

export const colorSchemeMetadata: Record<ColorScheme, ColorSchemeMetadata> = {
  [ColorScheme.System]: {
    icon: Monitor,
    category: "basic",
    previewColors: { background: "hsl(0 0% 98%)", primary: "hsl(0 0% 9%)", accent: "hsl(217 91% 60%)" },
  },
  [ColorScheme.Light]: {
    icon: Sun,
    category: "basic",
    previewColors: { background: "hsl(0 0% 98%)", primary: "hsl(0 0% 9%)", accent: "hsl(217 91% 60%)" },
  },
  [ColorScheme.Dark]: {
    icon: Moon,
    category: "basic",
    previewColors: { background: "hsl(0 0% 10%)", primary: "hsl(0 0% 6%)", accent: "hsl(217 91% 60%)" },
  },
  [ColorScheme.Lemon]: {
    icon: Citrus,
    category: "basic",
    previewColors: { background: "hsl(54 60% 96%)", primary: "hsl(45 80% 35%)", accent: "hsl(42 100% 50%)" },
  },
  [ColorScheme.Mint]: {
    icon: Leaf,
    category: "basic",
    previewColors: { background: "hsl(160 35% 97%)", primary: "hsl(165 60% 35%)", accent: "hsl(165 70% 45%)" },
  },
  [ColorScheme.Rose]: {
    icon: Flower,
    category: "basic",
    previewColors: { background: "hsl(350 30% 97%)", primary: "hsl(345 60% 35%)", accent: "hsl(340 70% 50%)" },
  },
  [ColorScheme.Yorusora]: {
    icon: MoonStar,
    category: "seijaku",
    previewColors: { background: "hsl(244 47% 20%)", primary: "hsl(239 84% 67%)", accent: "hsl(239 84% 67%)" },
  },
  [ColorScheme.Lavender]: {
    icon: Flower2,
    category: "basic",
    previewColors: { background: "hsl(251 91% 95%)", primary: "hsl(263 70% 50%)", accent: "hsl(263 90% 66%)" },
  },
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
