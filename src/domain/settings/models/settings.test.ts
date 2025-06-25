import { describe, expect, it, vi, beforeEach } from "vitest";
import { ExtensionSettings, Settings } from "./settings";
import { NotificationType } from "@/types/enums/NotificationType";
import { ColorScheme } from "@/types/enums/ColorScheme";

describe("Settings", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  describe("get", () => {
    it("should return default values when storage is empty", async () => {
      vi.spyOn(chrome.storage.sync, "get").mockImplementation(() => Promise.resolve({ settings: null }));

      const settings = await Settings.get();
      expect(settings).toEqual({
        notificationType: NotificationType.Alarm,
        colorScheme: ColorScheme.Dark,
        alarmSound: "Simple",
        volume: 0.1,
        applyThemeToSettings: false,
      });
    });

    it("should merge with default values when storage has partial settings", async () => {
      vi.spyOn(chrome.storage.sync, "get").mockImplementation(() =>
        Promise.resolve({
          settings: {
            colorScheme: ColorScheme.Light,
            volume: 0.5,
          },
        }),
      );

      const settings = await Settings.get();
      expect(settings).toEqual({
        notificationType: NotificationType.Alarm,
        colorScheme: ColorScheme.Light,
        alarmSound: "Simple",
        volume: 0.5,
        applyThemeToSettings: false,
      });
    });

    it("should return all stored settings when storage is complete", async () => {
      const fullSettings = {
        notificationType: NotificationType.None,
        colorScheme: ColorScheme.Light,
        alarmSound: "Piano" as const,
        volume: 0.8,
        applyThemeToSettings: true,
      };
      vi.spyOn(chrome.storage.sync, "get").mockImplementation(() =>
        Promise.resolve({
          settings: fullSettings,
        }),
      );

      const settings = await Settings.get();
      expect(settings).toEqual(fullSettings);
    });

    it("should handle storage error and return default values", async () => {
      vi.spyOn(chrome.storage.sync, "get").mockRejectedValue(new Error("Storage error"));
      const settings = await Settings.get();
      expect(settings).toEqual({
        notificationType: NotificationType.Alarm,
        colorScheme: ColorScheme.Dark,
        alarmSound: "Simple",
        volume: 0.1,
        applyThemeToSettings: false,
      });
    });
  });

  describe("set", () => {
    it("should merge and save new settings with existing ones", async () => {
      const getCurrentSettings = vi.spyOn(Settings, "get").mockResolvedValue({
        notificationType: NotificationType.None,
        colorScheme: ColorScheme.Dark,
        alarmSound: "Simple",
        volume: 0.1,
        applyThemeToSettings: false,
      });
      const setStorage = vi.spyOn(chrome.storage.sync, "set");

      await Settings.set({ volume: 0.8, colorScheme: ColorScheme.Light });

      expect(getCurrentSettings).toHaveBeenCalled();
      expect(setStorage).toHaveBeenCalledWith({
        settings: {
          notificationType: NotificationType.None,
          colorScheme: ColorScheme.Light,
          alarmSound: "Simple",
          volume: 0.8,
          applyThemeToSettings: false,
        },
      });
    });

    it("should not modify settings when empty object is provided", async () => {
      const getCurrentSettings = vi.spyOn(Settings, "get").mockResolvedValue({
        notificationType: NotificationType.None,
        colorScheme: ColorScheme.Dark,
        alarmSound: "Simple",
        volume: 0.1,
        applyThemeToSettings: false,
      });
      const setStorage = vi.spyOn(chrome.storage.sync, "set");

      await Settings.set({});

      expect(getCurrentSettings).toHaveBeenCalled();
      expect(setStorage).toHaveBeenCalledWith({
        settings: {
          notificationType: NotificationType.None,
          colorScheme: ColorScheme.Dark,
          alarmSound: "Simple",
          volume: 0.1,
          applyThemeToSettings: false,
        },
      });
    });

    it("should update all settings when full object is provided", async () => {
      const getCurrentSettings = vi.spyOn(Settings, "get").mockResolvedValue({
        notificationType: NotificationType.None,
        colorScheme: ColorScheme.Dark,
        alarmSound: "Simple",
        volume: 0.1,
        applyThemeToSettings: false,
      });
      const setStorage = vi.spyOn(chrome.storage.sync, "set");

      const newSettings: ExtensionSettings = {
        notificationType: NotificationType.None,
        colorScheme: ColorScheme.Light,
        alarmSound: "Piano",
        volume: 0.8,
        applyThemeToSettings: true,
      };
      await Settings.set(newSettings);

      expect(getCurrentSettings).toHaveBeenCalled();
      expect(setStorage).toHaveBeenCalledWith({
        settings: newSettings,
      });
    });

    it("should normalize volume to be between 0 and 1", async () => {
      const getCurrentSettings = vi.spyOn(Settings, "get").mockResolvedValue({
        notificationType: NotificationType.None,
        colorScheme: ColorScheme.Dark,
        alarmSound: "Simple",
        volume: 0.1,
        applyThemeToSettings: false,
      });
      const setStorage = vi.spyOn(chrome.storage.sync, "set");

      await Settings.set({ volume: -0.5 });
      expect(setStorage).toHaveBeenCalledWith({
        settings: expect.objectContaining({ volume: 0 }),
      });

      await Settings.set({ volume: 1.5 });
      expect(setStorage).toHaveBeenCalledWith({
        settings: expect.objectContaining({ volume: 1 }),
      });
    });

    it("should normalize invalid alarm sound to Simple", async () => {
      const getCurrentSettings = vi.spyOn(Settings, "get").mockResolvedValue({
        notificationType: NotificationType.None,
        colorScheme: ColorScheme.Dark,
        alarmSound: "Simple",
        volume: 0.1,
        applyThemeToSettings: false,
      });
      const setStorage = vi.spyOn(chrome.storage.sync, "set");

      await Settings.set({ alarmSound: "Invalid" as any });
      expect(setStorage).toHaveBeenCalledWith({
        settings: expect.objectContaining({ alarmSound: "Simple" }),
      });
    });

    it("should handle storage error silently", async () => {
      vi.spyOn(Settings, "get").mockResolvedValue({
        notificationType: NotificationType.None,
        colorScheme: ColorScheme.Dark,
        alarmSound: "Simple",
        volume: 0.1,
        applyThemeToSettings: false,
      });
      vi.spyOn(chrome.storage.sync, "set").mockRejectedValue(new Error("Storage error"));

      await expect(Settings.set({ volume: 0.5 })).resolves.not.toThrow();
    });
  });
});
