import { useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import {
  ColorScheme,
  ThemeCategory,
  themeCategories,
  themeCategoryOrder,
  getThemesByCategory,
  colorSchemeMetadata,
} from "@/lib/color-scheme";
import { cn } from "@/lib/utils";
import { ThemeCard } from "./ThemeCard";
import TimerCardPreview from "./TimerCardPreview";

interface ThemeSelectorProps {
  value: ColorScheme;
  onChange: (scheme: ColorScheme) => void;
}

export function ThemeSelector({ value, onChange }: ThemeSelectorProps) {
  const { t } = useTranslation();

  // Find the category of the currently selected theme
  const selectedCategory = colorSchemeMetadata[value]?.category ?? "basic";
  const [activeCategory, setActiveCategory] = useState<ThemeCategory>(selectedCategory);

  // Get themes for the active category
  const themesInCategory = useMemo(() => getThemesByCategory(activeCategory), [activeCategory]);

  return (
    <div className="space-y-4">
      {/* Category tabs */}
      <div className="flex flex-wrap gap-2">
        {themeCategoryOrder.map((category) => {
          const meta = themeCategories[category];
          const Icon = meta.icon;
          const isActive = activeCategory === category;

          return (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={cn(
                "flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium transition-all",
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground",
              )}
            >
              <Icon className="h-3.5 w-3.5" />
              <span>{t(meta.labelKey as "themeCategory.basic")}</span>
            </button>
          );
        })}
      </div>

      {/* Theme grid */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
        {themesInCategory.map((scheme) => (
          <ThemeCard key={scheme} scheme={scheme} isSelected={value === scheme} onClick={() => onChange(scheme)} />
        ))}
      </div>

      {/* Preview */}
      <div className="rounded-lg bg-muted/30 p-4">
        <h4 className="mb-3 text-sm font-medium">{t("options.appearance.preview")}</h4>
        <TimerCardPreview colorScheme={value} />
      </div>
    </div>
  );
}
