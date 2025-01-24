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
    // Chrome APIのモック
    global.chrome = {
      tabs: {
        query: vi.fn().mockResolvedValue([{ id: 1 }]),
        sendMessage: vi.fn(),
      },
    } as any;

    // Settingsのモック
    vi.mocked(Settings.get).mockResolvedValue({
      colorScheme: ColorScheme.Light,
      notificationType: NotificationType.Alarm,
      alarmSound: "Simple",
      volume: 0.1,
    });
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
    });

    it("目標時刻からタイマーを開始できる", async () => {
      const now = new Date();
      const targetTime = new Date(now.getTime() + 300000).toTimeString().slice(0, 5);
      await timerService.start(null, targetTime);

      expect(History.add).toHaveBeenCalled();
      expect(chrome.tabs.sendMessage).toHaveBeenCalled();
    });
  });
});
