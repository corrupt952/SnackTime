import { Monitor, Sun, Moon, Citrus, Leaf, Flower, MoonStar, Flower2, Sparkles, type LucideIcon } from "lucide-react";

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

interface ColorSchemeMetadata {
  icon: LucideIcon;
  description: string;
}

export const colorSchemeMetadata: Record<ColorScheme, ColorSchemeMetadata> = {
  [ColorScheme.System]: { icon: Monitor, description: "Match system preference" },
  [ColorScheme.Light]: { icon: Sun, description: "Always light theme" },
  [ColorScheme.Dark]: { icon: Moon, description: "Always dark theme" },
  [ColorScheme.Lemon]: { icon: Citrus, description: "Bright yellow theme" },
  [ColorScheme.Mint]: { icon: Leaf, description: "Fresh mint theme" },
  [ColorScheme.Rose]: { icon: Flower, description: "Soft rose theme" },
  [ColorScheme.Yorusora]: { icon: MoonStar, description: "Night sky indigo theme" },
  [ColorScheme.Lavender]: { icon: Flower2, description: "Soft purple theme" },
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
