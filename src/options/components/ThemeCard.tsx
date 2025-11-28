import { useTranslation } from "react-i18next";
import { ColorScheme, colorSchemeMetadata } from "@/lib/color-scheme";
import { cn } from "@/lib/utils";

interface ThemeCardProps {
  scheme: ColorScheme;
  isSelected: boolean;
  onClick: () => void;
}

export function ThemeCard({ scheme, isSelected, onClick }: ThemeCardProps) {
  const { t } = useTranslation();
  const metadata = colorSchemeMetadata[scheme];
  const Icon = metadata.icon;

  return (
    <button
      onClick={onClick}
      className={cn(
        "relative flex flex-col items-center gap-2 rounded-lg border p-3 transition-all duration-200",
        "hover:bg-accent/50 hover:shadow-md",
        isSelected ? "border-primary ring-2 ring-primary/20" : "border-border bg-background",
      )}
    >
      {/* Color swatches */}
      <div className="flex h-8 w-full overflow-hidden rounded-md">
        <div className="flex-1" style={{ backgroundColor: metadata.previewColors.background }} />
        <div className="flex-1" style={{ backgroundColor: metadata.previewColors.primary }} />
        <div className="flex-1" style={{ backgroundColor: metadata.previewColors.accent }} />
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
