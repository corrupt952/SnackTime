import { Duration } from "@/domain/timer/value/duration";
import { TargetTime } from "@/domain/timer/value/target-time";
import { History } from "@/domain/timer/model/history";
import { Settings } from "@/domain/settings/models/settings";

export const timerService = {
  async start(duration: Duration | null, targetTime: string | null = null): Promise<void> {
    if (!duration && !targetTime) {
      const time = Number(prompt("Enter timer seconds in seconds:", String(300)));
      if (time === 0 || isNaN(time)) {
        return;
      }
      duration = new Duration(time);
    }

    if (targetTime) {
      try {
        const target = TargetTime.fromString(targetTime);
        duration = new Duration(target.toDuration());
      } catch (error) {
        console.error("Error parsing target time:", error);
        return;
      }
    }

    if (!duration) return;

    await History.add(duration);

    const settings = await Settings.get();

    const [tab] = await chrome.tabs.query({
      active: true,
      currentWindow: true,
    });

    if (!tab?.id) return;

    chrome.tabs.sendMessage(tab.id, {
      type: "timer-started",
      duration: duration.toSeconds(),
      colorScheme: settings.colorScheme,
      notificationType: settings.notificationType,
    });

    window.close();
  },
};
