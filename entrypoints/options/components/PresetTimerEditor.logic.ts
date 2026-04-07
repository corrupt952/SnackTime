import { PresetTimer } from "@/domain/settings/models/settings";
import { LucideIcon } from "lucide-react";
import { Timer, BookOpen, Coffee, Brain, Briefcase } from "lucide-react";

export type TemplateId = "breaks" | "pomodoro" | "study" | "meditation" | "meetings";

export interface QuickTemplate {
  id: TemplateId;
  icon: LucideIcon;
  presets: PresetTimer[];
}

export const DEFAULT_PRESETS: PresetTimer[] = [{ minutes: 1 }, { minutes: 3 }, { minutes: 5 }, { minutes: 10 }];

export const quickTemplateData: QuickTemplate[] = [
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

/**
 * Determine which template ID matches the given presets.
 * Returns "custom" if no template matches.
 */
export function getSelectedTemplateId(presets: PresetTimer[]): TemplateId | "custom" {
  for (const template of quickTemplateData) {
    if (template.presets.length !== presets.length) continue;

    const matches = template.presets.every(
      (templatePreset, index) => presets[index]?.minutes === templatePreset.minutes,
    );

    if (matches) return template.id;
  }
  return "custom";
}

/**
 * Validate and parse a minutes input value.
 * Returns the parsed minutes value, or null if the input is invalid.
 */
export function validateMinutesInput(value: string): number | null {
  const minutes = parseInt(value, 10);
  if (isNaN(minutes) || minutes < 0 || minutes > 999) return null;
  return minutes || 1;
}

/**
 * Create updated presets array with a new minutes value at the given index.
 * Returns null if the input is invalid.
 */
export function updatePresetAtIndex(presets: PresetTimer[], index: number, value: string): PresetTimer[] | null {
  const minutes = validateMinutesInput(value);
  if (minutes === null) return null;

  const newPresets = [...presets];
  newPresets[index] = { ...newPresets[index], minutes };
  return newPresets;
}
