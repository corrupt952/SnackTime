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
  color: string;
}

const quickTemplates: QuickTemplate[] = [
  {
    name: "Pomodoro",
    icon: Timer,
    description: "25, 5, 15, 30 min",
    presets: [{ minutes: 25 }, { minutes: 5 }, { minutes: 15 }, { minutes: 30 }],
    color: "red",
  },
  {
    name: "Study",
    icon: BookOpen,
    description: "45, 10, 60, 90 min",
    presets: [{ minutes: 45 }, { minutes: 10 }, { minutes: 60 }, { minutes: 90 }],
    color: "green",
  },
  {
    name: "Exercise",
    icon: Dumbbell,
    description: "1, 3, 5, 10 min",
    presets: [{ minutes: 1 }, { minutes: 3 }, { minutes: 5 }, { minutes: 10 }],
    color: "purple",
  },
  {
    name: "Breaks",
    icon: Coffee,
    description: "1, 3, 5, 10 min",
    presets: [{ minutes: 1 }, { minutes: 3 }, { minutes: 5 }, { minutes: 10 }],
    color: "yellow",
  },
  {
    name: "Meditation",
    icon: Brain,
    description: "2, 5, 10, 20 min",
    presets: [{ minutes: 2 }, { minutes: 5 }, { minutes: 10 }, { minutes: 20 }],
    color: "pink",
  },
  {
    name: "Meetings",
    icon: Briefcase,
    description: "15, 30, 45, 60 min",
    presets: [{ minutes: 15 }, { minutes: 30 }, { minutes: 45 }, { minutes: 60 }],
    color: "orange",
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

  const colorClasses = {
    red: "hover:bg-red-50 hover:border-red-300",
    green: "hover:bg-green-50 hover:border-green-300",
    purple: "hover:bg-purple-50 hover:border-purple-300",
    yellow: "hover:bg-yellow-50 hover:border-yellow-300",
    pink: "hover:bg-pink-50 hover:border-pink-300",
    orange: "hover:bg-orange-50 hover:border-orange-300",
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
              className={`p-3 border rounded-lg transition-colors ${colorClasses[template.color as keyof typeof colorClasses]}`}
            >
              <div className="font-medium mb-1 flex items-center gap-2">
                <template.icon className="h-4 w-4" />
                <span>{template.name}</span>
              </div>
              <div className="text-xs text-muted-foreground">{template.description}</div>
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
