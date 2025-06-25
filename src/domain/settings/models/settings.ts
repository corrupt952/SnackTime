import { NotificationType } from "@/types/enums/NotificationType";
import { ColorScheme } from "@/types/enums/ColorScheme";

export type AlarmSound = "Simple" | "Piano" | "Vibraphone" | "SteelDrums";

export interface ExtensionSettings {
  colorScheme: ColorScheme;
  notificationType: NotificationType;
  alarmSound: AlarmSound;
  volume: number;
  applyThemeToSettings: boolean;
}

export class Settings {
  private static readonly defaultSettings: ExtensionSettings = {
    notificationType: NotificationType.Alarm,
    colorScheme: ColorScheme.Dark,
    alarmSound: "Simple",
    volume: 0.1,
    applyThemeToSettings: false,
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
