import { describe, expect, it, vi, beforeEach } from "vitest";
import { timerService } from "./timer";
import { Duration } from "@/domain/timer/value/duration";
import { History } from "@/domain/timer/model/history";
import { Settings } from "@/domain/settings/models/settings";
import { ColorScheme } from "@/types/enums/ColorScheme";
import { NotificationType } from "@/types/enums/NotificationType";

vi.mock("@/domain/timer/model/history");
vi.mock("@/domain/settings/models/settings");

describe("timerService", () => {
  beforeEach(() => {
    vi.resetAllMocks();
    // Settingsのモック
    vi.mocked(Settings.get).mockResolvedValue({
      colorScheme: ColorScheme.Light,
      notificationType: NotificationType.Alarm,
      alarmSound: "Simple",
      volume: 0.1,
    });

    // Chrome APIのモック
    chrome.tabs.query.mockResolvedValue([{ id: 1 }]);
  });

  describe("start", () => {
    it("指定された時間でタイマーを開始できる", async () => {
      const duration = new Duration(300);
      await timerService.start(duration);

      expect(History.add).toHaveBeenCalledWith(duration);
      expect(chrome.tabs.sendMessage).toHaveBeenCalledWith(1, {
        type: "timer-started",
        duration: 300,
        colorScheme: ColorScheme.Light,
        notificationType: NotificationType.Alarm,
      });
      expect(window.close).toHaveBeenCalled();
    });

    it("目標時刻からタイマーを開始できる", async () => {
      vi.useFakeTimers();
      const now = new Date("2024-01-24T10:00:00");
      vi.setSystemTime(now);

      await timerService.start(null, "10:05"); // 5分後

      expect(History.add).toHaveBeenCalledWith(expect.any(Duration));
      expect(chrome.tabs.sendMessage).toHaveBeenCalledWith(1, {
        type: "timer-started",
        duration: 300, // 5分 = 300秒
        colorScheme: ColorScheme.Light,
        notificationType: NotificationType.Alarm,
      });

      vi.useRealTimers();
    });

    it("不正な目標時刻の場合はタイマーを開始しない", async () => {
      await timerService.start(null, "invalid");

      expect(History.add).not.toHaveBeenCalled();
      expect(chrome.tabs.sendMessage).not.toHaveBeenCalled();
      expect(window.close).not.toHaveBeenCalled();
    });

    it("タブが見つからない場合はタイマーを開始しない", async () => {
      chrome.tabs.query.mockResolvedValueOnce([]);
      const duration = new Duration(300);

      await timerService.start(duration);

      expect(chrome.tabs.sendMessage).not.toHaveBeenCalled();
      expect(window.close).not.toHaveBeenCalled();
    });
  });
});
