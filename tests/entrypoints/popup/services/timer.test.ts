import { describe, expect, it, vi, beforeEach } from "vitest";
import { timerService } from "../../../../entrypoints/popup/services/timer";
import { Duration } from "@/domain/timer/value/duration";
import { History } from "@/domain/timer/model/history";
import { Settings } from "@/domain/settings/models/settings";
import { ColorScheme } from "@/lib/color-scheme";
import { NotificationType } from "@/types/enums/NotificationType";
import { mockedChrome } from "@/test/setup";

vi.mock("@/domain/timer/model/history");
vi.mock("@/domain/settings/models/settings");

const mockTab: chrome.tabs.Tab = {
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
  frozen: false,
};

const defaultSettings = {
  language: "system" as const,
  colorScheme: ColorScheme.Light,
  notificationType: NotificationType.Alarm,
  alarmSound: "Simple" as const,
  volume: 0.1,
  applyThemeToSettings: false,
  timerPosition: "top-right" as const,
  presetTimers: [{ minutes: 1 }, { minutes: 3 }, { minutes: 5 }, { minutes: 10 }],
};

describe("timerService", () => {
  beforeEach(() => {
    vi.resetAllMocks();
    vi.mocked(Settings.get).mockResolvedValue(defaultSettings);
    mockedChrome.tabs.query.mockResolvedValue([mockTab]);
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
      mockedChrome.tabs.query.mockResolvedValueOnce([]);
      const duration = new Duration(300);

      await timerService.start(duration);

      expect(chrome.tabs.sendMessage).not.toHaveBeenCalled();
      expect(window.close).not.toHaveBeenCalled();
    });

    it("should not start timer when tab has undefined id", async () => {
      const tabWithoutId: chrome.tabs.Tab = {
        ...mockTab,
        id: undefined,
      };
      mockedChrome.tabs.query.mockResolvedValueOnce([tabWithoutId]);
      const duration = new Duration(300);

      await timerService.start(duration);

      expect(History.add).toHaveBeenCalledWith(duration);
      expect(chrome.tabs.sendMessage).not.toHaveBeenCalled();
      expect(window.close).not.toHaveBeenCalled();
    });

    it("should not start timer with target time in HH:MM:SS format", async () => {
      await timerService.start(null, "10:05:30");

      expect(History.add).not.toHaveBeenCalled();
      expect(chrome.tabs.sendMessage).not.toHaveBeenCalled();
      expect(window.close).not.toHaveBeenCalled();
    });

    it("should not start timer with target time using single-digit hours", async () => {
      await timerService.start(null, "9:05");

      expect(History.add).not.toHaveBeenCalled();
      expect(chrome.tabs.sendMessage).not.toHaveBeenCalled();
      expect(window.close).not.toHaveBeenCalled();
    });

    it("should not start timer with target time out of range (25:00)", async () => {
      await timerService.start(null, "25:00");

      expect(History.add).not.toHaveBeenCalled();
      expect(chrome.tabs.sendMessage).not.toHaveBeenCalled();
      expect(window.close).not.toHaveBeenCalled();
    });

    it("should fall through to prompt when target time is empty string", async () => {
      // Empty string is falsy, so targetTime check is skipped and it goes to prompt path.
      // With prompt not returning a valid number, the timer should not start.
      global.prompt = vi.fn().mockReturnValue(null);
      await timerService.start(null, "");

      expect(History.add).not.toHaveBeenCalled();
      expect(chrome.tabs.sendMessage).not.toHaveBeenCalled();
      expect(window.close).not.toHaveBeenCalled();
    });

    it("should handle chrome.tabs.sendMessage throwing an error", async () => {
      mockedChrome.tabs.sendMessage.mockRejectedValueOnce(new Error("Could not establish connection"));
      const duration = new Duration(300);

      // The function does not await sendMessage, so it should not throw.
      // However, it still calls History.add and window.close before sendMessage rejects.
      await timerService.start(duration);

      expect(History.add).toHaveBeenCalledWith(duration);
      expect(chrome.tabs.sendMessage).toHaveBeenCalledWith(1, {
        type: "timer-started",
        duration: 300,
      });
      expect(window.close).toHaveBeenCalled();
    });

    it("should start timer with a very large duration value", async () => {
      const duration = new Duration(86400); // 24 hours in seconds
      await timerService.start(duration);

      expect(History.add).toHaveBeenCalledWith(duration);
      expect(chrome.tabs.sendMessage).toHaveBeenCalledWith(1, {
        type: "timer-started",
        duration: 86400,
      });
      expect(window.close).toHaveBeenCalled();
    });

    it("should start timer with duration of 1 second", async () => {
      const duration = new Duration(1);
      await timerService.start(duration);

      expect(History.add).toHaveBeenCalledWith(duration);
      expect(chrome.tabs.sendMessage).toHaveBeenCalledWith(1, {
        type: "timer-started",
        duration: 1,
      });
      expect(window.close).toHaveBeenCalled();
    });

    it("should handle multiple sequential start calls independently", async () => {
      const duration1 = new Duration(60);
      const duration2 = new Duration(120);

      await timerService.start(duration1);
      await timerService.start(duration2);

      expect(History.add).toHaveBeenCalledTimes(2);
      expect(History.add).toHaveBeenNthCalledWith(1, duration1);
      expect(History.add).toHaveBeenNthCalledWith(2, duration2);
      expect(chrome.tabs.sendMessage).toHaveBeenCalledTimes(2);
      expect(window.close).toHaveBeenCalledTimes(2);
    });

    it("should query for active tab in current window", async () => {
      const duration = new Duration(300);
      await timerService.start(duration);

      expect(chrome.tabs.query).toHaveBeenCalledWith({
        active: true,
        currentWindow: true,
      });
    });

    it("should wrap target time to next day when target is in the past", async () => {
      vi.useFakeTimers();
      const now = new Date("2024-01-24T10:00:00");
      vi.setSystemTime(now);

      // 09:00 is in the past relative to 10:00, so TargetTime wraps to next day
      // next day 09:00 minus today 10:00 = 23 hours = 82800 seconds
      await timerService.start(null, "09:00");

      expect(History.add).toHaveBeenCalledWith(expect.any(Duration));
      expect(chrome.tabs.sendMessage).toHaveBeenCalledWith(1, {
        type: "timer-started",
        duration: 82800,
      });

      vi.useRealTimers();
    });
  });
});
