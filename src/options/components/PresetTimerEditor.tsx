import { PresetTimer } from "@/domain/settings/models/settings";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Timer, BookOpen, Coffee, Brain, Briefcase, Settings } from "lucide-react";
import { LucideIcon } from "lucide-react";
import { useTranslation } from "react-i18next";

interface PresetTimerEditorProps {
  presets: PresetTimer[];
  onChange: (presets: PresetTimer[]) => void;
}

type TemplateId = "breaks" | "pomodoro" | "study" | "meditation" | "meetings";

interface QuickTemplate {
  id: TemplateId;
  icon: LucideIcon;
  presets: PresetTimer[];
}

const quickTemplateData: QuickTemplate[] = [
  {
    id: "breaks",
    icon: Coffee,
    presets: [{ minutes: 1 }, { minutes: 3 }, { minutes: 5 }, { minutes: 10 }],
  },
  {
    id: "pomodoro",
    icon: Timer,
    presets: [{ minutes: 25 }, { minutes: 5 }, { minutes: 15 }, { minutes: 30 }],
  },
  {
    id: "study",
    icon: BookOpen,
    presets: [{ minutes: 45 }, { minutes: 10 }, { minutes: 60 }, { minutes: 90 }],
  },
  {
    id: "meditation",
    icon: Brain,
    presets: [{ minutes: 2 }, { minutes: 5 }, { minutes: 10 }, { minutes: 20 }],
  },
  {
    id: "meetings",
    icon: Briefcase,
    presets: [{ minutes: 15 }, { minutes: 30 }, { minutes: 45 }, { minutes: 60 }],
  },
];

export function PresetTimerEditor({ presets, onChange }: PresetTimerEditorProps) {
  const { t } = useTranslation();
  const handleMinutesChange = (index: number, value: string) => {
    const minutes = parseInt(value, 10);
    if (isNaN(minutes) || minutes < 0 || minutes > 999) return;

    const newPresets = [...presets];
    newPresets[index] = { ...newPresets[index], minutes: minutes || 1 };
    onChange(newPresets);
  };

  const applyTemplate = (template: QuickTemplate) => {
    onChange(template.presets);
  };

  const resetToDefaults = () => {
    onChange([{ minutes: 1 }, { minutes: 3 }, { minutes: 5 }, { minutes: 10 }]);
  };

  // Check if current presets match any template
  const getSelectedTemplateId = () => {
    for (const template of quickTemplateData) {
      if (template.presets.length !== presets.length) continue;

      const matches = template.presets.every(
        (templatePreset, index) => presets[index]?.minutes === templatePreset.minutes,
      );

      if (matches) return template.id;
    }
    return "custom";
  };

  const selectedTemplateId = getSelectedTemplateId();

  return (
    <div className="space-y-6">
      {/* Quick Templates */}
      <div>
        <h3 className="text-base font-semibold mb-2">{t("presetEditor.quickTemplates.title")}</h3>
        <p className="text-sm text-muted-foreground mb-4">{t("presetEditor.quickTemplates.description")}</p>
        <div className="grid grid-cols-3 gap-3">
          {quickTemplateData.map((template) => {
            const isSelected = selectedTemplateId === template.id;
            return (
              <button
                key={template.id}
                onClick={() => applyTemplate(template)}
                className="relative flex cursor-pointer rounded-lg border bg-background p-4 transition-all duration-200 hover:bg-accent/50 hover:shadow-md"
              >
                <div className="flex w-full items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-md bg-primary/10 text-primary">
                    <template.icon className="h-4 w-4" />
                  </div>
                  <div className="flex-1 text-left">
                    <p className="font-medium">{t(`templates.${template.id}.name`)}</p>
                    <p className="text-xs text-muted-foreground">{t(`templates.${template.id}.description`)}</p>
                  </div>
                </div>
                {isSelected && <div className="absolute right-2 top-2 h-2 w-2 rounded-full bg-primary" />}
              </button>
            );
          })}
          {/* Custom template card */}
          <div className="relative flex rounded-lg border bg-background p-4 transition-all duration-200 opacity-75 cursor-not-allowed">
            <div className="flex w-full items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-md bg-muted text-muted-foreground">
                <Settings className="h-4 w-4" />
              </div>
              <div className="flex-1 text-left">
                <p className="font-medium text-muted-foreground">{t("presetEditor.custom")}</p>
                <p className="text-xs text-muted-foreground">{t("presetEditor.userDefined")}</p>
              </div>
            </div>
            {selectedTemplateId === "custom" && (
              <div className="absolute right-2 top-2 h-2 w-2 rounded-full bg-primary" />
            )}
          </div>
        </div>
      </div>

      {/* Custom Presets */}
      <div>
        <h3 className="text-base font-semibold mb-2">{t("presetEditor.customPresets.title")}</h3>
        <p className="text-sm text-muted-foreground mb-4">{t("presetEditor.customPresets.description")}</p>
        <div className="grid grid-cols-4 gap-4">
          {presets.map((preset, index) => (
            <div key={index} className="text-center">
              <div className="text-sm text-muted-foreground mb-2">
                {t("presetEditor.preset", { number: index + 1 })}
              </div>
              <Input
                type="number"
                value={preset.minutes}
                onChange={(e) => handleMinutesChange(index, e.target.value)}
                min="0"
                max="999"
                className="w-full px-3 py-2 text-center text-lg font-mono"
              />
              <div className="text-xs text-muted-foreground mt-1">{t("presetEditor.minutes")}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Reset Button */}
      <div className="flex justify-end">
        <Button variant="outline" size="sm" onClick={resetToDefaults}>
          {t("presetEditor.resetToDefaults")}
        </Button>
      </div>
    </div>
  );
}
