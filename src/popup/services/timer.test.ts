import { describe, expect, it, vi, beforeEach } from "vitest";
import { timerService } from "./timer";
import { Duration } from "@/domain/timer/value/duration";
import { History } from "@/domain/timer/model/history";
import { Settings } from "@/domain/settings/models/settings";
import { ColorScheme } from "@/types/enums/ColorScheme";
import { NotificationType } from "@/types/enums/NotificationType";

vi.mock("@/domain/timer/model/history");
vi.mock("@/domain/settings/models/settings");

const mockTab = {
  id: 1,
  index: 0,
  pinned: false,
  highlighted: false,
  windowId: 1,
  active: false,
  incognito: false,
  selected: false,
  discarded: false,
  autoDiscardable: true,
  groupId: -1,
  url: "about:blank",
  title: "Test Tab",
};

describe("timerService", () => {
  beforeEach(() => {
    vi.resetAllMocks();
    // Mock Settings
    vi.mocked(Settings.get).mockResolvedValue({
      colorScheme: ColorScheme.Light,
      notificationType: NotificationType.Alarm,
      alarmSound: "Simple",
      volume: 0.1,
    });

    // Mock Chrome API
    vi.mocked(chrome.tabs.query).mockResolvedValue([mockTab]);
  });

  describe("start", () => {
    it("should start timer with specified duration", async () => {
      const duration = new Duration(300);
      await timerService.start(duration);

      expect(History.add).toHaveBeenCalledWith(duration);
      expect(chrome.tabs.sendMessage).toHaveBeenCalledWith(1, {
        type: "timer-started",
        duration: 300,
      });
      expect(window.close).toHaveBeenCalled();
    });

    it("should start timer with target time", async () => {
      vi.useFakeTimers();
      const now = new Date("2024-01-24T10:00:00");
      vi.setSystemTime(now);

      await timerService.start(null, "10:05"); // 5 minutes later

      expect(History.add).toHaveBeenCalledWith(expect.any(Duration));
      expect(chrome.tabs.sendMessage).toHaveBeenCalledWith(1, {
        type: "timer-started",
        duration: 300, // 5 minutes = 300 seconds
      });

      vi.useRealTimers();
    });

    it("should not start timer with invalid target time", async () => {
      await timerService.start(null, "invalid");

      expect(History.add).not.toHaveBeenCalled();
      expect(chrome.tabs.sendMessage).not.toHaveBeenCalled();
      expect(window.close).not.toHaveBeenCalled();
    });

    it("should not start timer when no tab is found", async () => {
      vi.mocked(chrome.tabs.query).mockResolvedValueOnce([]);
      const duration = new Duration(300);

      await timerService.start(duration);

      expect(chrome.tabs.sendMessage).not.toHaveBeenCalled();
      expect(window.close).not.toHaveBeenCalled();
    });
  });
});
