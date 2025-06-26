import { PresetTimer } from "@/domain/settings/models/settings";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Timer, BookOpen, Dumbbell, Coffee, Brain, Briefcase } from "lucide-react";
import { LucideIcon } from "lucide-react";

interface PresetTimerEditorProps {
  presets: PresetTimer[];
  onChange: (presets: PresetTimer[]) => void;
}

interface QuickTemplate {
  name: string;
  icon: LucideIcon;
  description: string;
  presets: PresetTimer[];
}

const quickTemplates: QuickTemplate[] = [
  {
    name: "Pomodoro",
    icon: Timer,
    description: "25, 5, 15, 30 min",
    presets: [{ minutes: 25 }, { minutes: 5 }, { minutes: 15 }, { minutes: 30 }],
  },
  {
    name: "Study",
    icon: BookOpen,
    description: "45, 10, 60, 90 min",
    presets: [{ minutes: 45 }, { minutes: 10 }, { minutes: 60 }, { minutes: 90 }],
  },
  {
    name: "Exercise",
    icon: Dumbbell,
    description: "1, 3, 5, 10 min",
    presets: [{ minutes: 1 }, { minutes: 3 }, { minutes: 5 }, { minutes: 10 }],
  },
  {
    name: "Breaks",
    icon: Coffee,
    description: "1, 3, 5, 10 min",
    presets: [{ minutes: 1 }, { minutes: 3 }, { minutes: 5 }, { minutes: 10 }],
  },
  {
    name: "Meditation",
    icon: Brain,
    description: "2, 5, 10, 20 min",
    presets: [{ minutes: 2 }, { minutes: 5 }, { minutes: 10 }, { minutes: 20 }],
  },
  {
    name: "Meetings",
    icon: Briefcase,
    description: "15, 30, 45, 60 min",
    presets: [{ minutes: 15 }, { minutes: 30 }, { minutes: 45 }, { minutes: 60 }],
  },
];

export function PresetTimerEditor({ presets, onChange }: PresetTimerEditorProps) {
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

  return (
    <div className="space-y-6">
      {/* Quick Templates */}
      <div>
        <h3 className="text-base font-semibold mb-2">Quick Templates</h3>
        <p className="text-sm text-muted-foreground mb-4">Click a template to apply preset times instantly</p>
        <div className="grid grid-cols-3 gap-3">
          {quickTemplates.map((template) => (
            <button
              key={template.name}
              onClick={() => applyTemplate(template)}
              className="relative flex cursor-pointer rounded-lg border bg-background p-4 transition-all duration-200 hover:bg-accent/50 hover:shadow-md"
            >
              <div className="flex w-full items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-md bg-primary/10 text-primary">
                  <template.icon className="h-4 w-4" />
                </div>
                <div className="flex-1 text-left">
                  <p className="font-medium">{template.name}</p>
                  <p className="text-xs text-muted-foreground">{template.description}</p>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Custom Presets */}
      <div>
        <h3 className="text-base font-semibold mb-2">Custom Presets</h3>
        <p className="text-sm text-muted-foreground mb-4">Set your own timer values for each preset button</p>
        <div className="grid grid-cols-4 gap-4">
          {presets.map((preset, index) => (
            <div key={index} className="text-center">
              <div className="text-sm text-muted-foreground mb-2">Preset {index + 1}</div>
              <Input
                type="number"
                value={preset.minutes}
                onChange={(e) => handleMinutesChange(index, e.target.value)}
                min="0"
                max="999"
                className="w-full px-3 py-2 text-center text-lg font-mono"
              />
              <div className="text-xs text-muted-foreground mt-1">minutes</div>
            </div>
          ))}
        </div>
      </div>

      {/* Reset Button */}
      <div className="flex justify-end">
        <Button variant="outline" size="sm" onClick={resetToDefaults}>
          Reset to Defaults
        </Button>
      </div>
    </div>
  );
}
