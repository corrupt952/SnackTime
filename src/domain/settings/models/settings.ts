import { NotificationType } from "@/types/enums/NotificationType";
import { ColorScheme } from "@/types/enums/ColorScheme";

export interface ExtensionSettings {
  colorScheme: ColorScheme;
  notificationType: NotificationType;
}

export class Settings {
  static async get(): Promise<ExtensionSettings> {
    const settings = (await chrome.storage.sync.get(["settings"])).settings;
    return settings ?? { notificationType: NotificationType.Alarm, colorScheme: ColorScheme.Dark };
  }

  static async set(settings: Partial<ExtensionSettings>) {
    const currentSettings = await this.get();
    chrome.storage.sync.set({ settings: { ...currentSettings, ...settings } });
  }
}
