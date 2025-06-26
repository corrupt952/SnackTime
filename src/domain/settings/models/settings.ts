import { NotificationType } from "@/types/enums/NotificationType";
import { ColorScheme } from "@/types/enums/ColorScheme";

export type AlarmSound = "Simple" | "Piano" | "Vibraphone" | "SteelDrums";

export type TimerPosition = "top-right" | "top-left" | "bottom-right" | "bottom-left" | "center";

export interface PresetTimer {
  minutes: number;
}

export interface ExtensionSettings {
  colorScheme: ColorScheme;
  notificationType: NotificationType;
  alarmSound: AlarmSound;
  volume: number;
  applyThemeToSettings: boolean;
  timerPosition: TimerPosition;
  presetTimers: PresetTimer[];
}

export class Settings {
  private static readonly defaultSettings: ExtensionSettings = {
    notificationType: NotificationType.Alarm,
    colorScheme: ColorScheme.Dark,
    alarmSound: "Simple",
    volume: 0.1,
    applyThemeToSettings: false,
    timerPosition: "top-right",
    presetTimers: [{ minutes: 1 }, { minutes: 3 }, { minutes: 5 }, { minutes: 10 }],
  };

  private static readonly validAlarmSounds: AlarmSound[] = ["Simple", "Piano", "Vibraphone", "SteelDrums"];

  private static normalizeSettings(settings: Partial<ExtensionSettings>): Partial<ExtensionSettings> {
    const normalized = { ...settings };

    if (normalized.volume !== undefined) {
      normalized.volume = Math.max(0, Math.min(1, normalized.volume));
    }

    if (normalized.alarmSound && !this.validAlarmSounds.includes(normalized.alarmSound)) {
      normalized.alarmSound = "Simple";
    }

    if (normalized.presetTimers) {
      normalized.presetTimers = normalized.presetTimers
        .filter((timer) => timer.minutes > 0 && timer.minutes <= 999)
        .slice(0, 4);

      while (normalized.presetTimers.length < 4) {
        normalized.presetTimers.push({ minutes: 5 });
      }
    }

    return normalized;
  }

  static async get(): Promise<ExtensionSettings> {
    try {
      const stored = (await chrome.storage.sync.get(["settings"])).settings;
      if (!stored) {
        return this.defaultSettings;
      }
      return { ...this.defaultSettings, ...this.normalizeSettings(stored) };
    } catch (error) {
      console.warn("Failed to load settings:", error);
      return this.defaultSettings;
    }
  }

  static async set(settings: Partial<ExtensionSettings>): Promise<void> {
    try {
      const currentSettings = await this.get();
      const normalizedSettings = this.normalizeSettings(settings);
      await chrome.storage.sync.set({
        settings: { ...currentSettings, ...normalizedSettings },
      });
    } catch (error) {
      console.warn("Failed to save settings:", error);
    }
  }
}
