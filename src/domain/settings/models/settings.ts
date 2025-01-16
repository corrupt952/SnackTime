import { NotificationType } from "@/types/enums/NotificationType";
import { ColorScheme } from "@/types/enums/ColorScheme";

export type AlarmSound = "Simple" | "Piano" | "Vibraphone" | "SteelDrums";

export interface ExtensionSettings {
  colorScheme: ColorScheme;
  notificationType: NotificationType;
  alarmSound: AlarmSound;
  volume: number;
}

export class Settings {
  static async get(): Promise<ExtensionSettings> {
    const settings = (await chrome.storage.sync.get(["settings"])).settings;
    return (
      settings ?? {
        notificationType: NotificationType.Alarm,
        colorScheme: ColorScheme.Dark,
        alarmSound: "Simple",
        volume: 0.1,
      }
    );
  }

  static async set(settings: Partial<ExtensionSettings>) {
    const currentSettings = await this.get();
    chrome.storage.sync.set({ settings: { ...currentSettings, ...settings } });
  }
}
