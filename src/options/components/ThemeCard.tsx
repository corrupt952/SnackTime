import { useTranslation } from "react-i18next";
import { ColorScheme, colorSchemeMetadata } from "@/lib/color-scheme";
import { cn } from "@/lib/utils";

interface ThemeCardProps {
  scheme: ColorScheme;
  isSelected: boolean;
  onClick: () => void;
}

/**
 * プレビュー用のCSSクラスを取得
 * System設定の場合はlight/darkを実際のシステム設定に基づいて返す
 */
const getPreviewClass = (scheme: ColorScheme): string => {
  if (scheme === ColorScheme.System) {
    // システム設定の場合は実際のprefers-color-schemeを使用
    const isDarkMode = window.matchMedia("(prefers-color-scheme: dark)").matches;
    return isDarkMode ? ColorScheme.Dark : ColorScheme.Light;
  }
  return scheme;
};

export function ThemeCard({ scheme, isSelected, onClick }: ThemeCardProps) {
  const { t } = useTranslation();
  const metadata = colorSchemeMetadata[scheme];
  const Icon = metadata.icon;
  const previewClass = getPreviewClass(scheme);

  return (
    <button
      data-theme={scheme}
      data-selected={isSelected}
      onClick={onClick}
      className={cn(
        "relative flex flex-col items-center gap-2 rounded-lg border p-3 transition-all duration-200",
        "hover:bg-accent/50 hover:shadow-md",
        isSelected ? "border-primary ring-2 ring-primary/20" : "border-border bg-background",
      )}
    >
      {/* Color swatches - テーマクラスを適用してCSS変数を使用 */}
      <div className={cn("flex h-8 w-full overflow-hidden rounded-md", previewClass)}>
        <div className="flex-1" style={{ backgroundColor: "hsl(var(--background))" }} />
        <div className="flex-1" style={{ backgroundColor: "hsl(var(--primary))" }} />
        <div className="flex-1" style={{ backgroundColor: "hsl(var(--accent))" }} />
      </div>

      {/* Theme name with icon */}
      <div className="flex items-center gap-1.5 text-sm font-medium">
        <Icon className="h-3.5 w-3.5 text-muted-foreground" />
        <span>{t(`colorScheme.${scheme}` as const)}</span>
      </div>

      {/* Selection indicator */}
      {isSelected && <div className="absolute right-2 top-2 h-2 w-2 rounded-full bg-primary" />}
    </button>
  );
}
