import { Coffee, Clock, SettingsIcon, X } from "lucide-react";
import { History } from "@/domain/timer/model/history";
import { Duration } from "@/domain/timer/value/duration";
import { TargetTime } from "@/domain/timer/value/target-time";
import { useEffect, useState } from "react";
import { Settings as SettingsModel } from "@/domain/settings/models/settings";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { TimeInput } from "./time-input";
import "@/styles/globals.css";
import { Settings } from "@/domain/settings/models/settings";
import { ColorScheme } from "@/types/enums/ColorScheme";

const startTimer = async (duration: Duration | null, targetTime: string | null = null) => {
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

  const settings = await SettingsModel.get();

  const [tab] = await chrome.tabs.query({
    active: true,
    currentWindow: true,
  });
  chrome.tabs.sendMessage(tab.id!, {
    type: "timer-started",
    duration: duration.toSeconds(),
    colorScheme: settings.colorScheme,
    notificationType: settings.notificationType,
  });

  window.close();
};

const TimerListItem = ({ duration }: { duration: Duration }) => {
  const text = duration.toFormatted();
  return (
    <Button variant="ghost" className="w-full justify-end" onClick={() => startTimer(duration)}>
      {text}
    </Button>
  );
};

const TimeInputModal = ({ onClose, onSubmit }: { onClose: () => void; onSubmit: (time: string) => void }) => {
  const getDefaultTime = () => {
    const now = new Date();
    now.setMinutes(now.getMinutes() + 30);
    return now.toLocaleTimeString("ja-JP", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  };

  const [time, setTime] = useState<string>(getDefaultTime());

  return (
    <div className="absolute inset-0 bg-background/80 backdrop-blur-sm">
      <div className="flex items-center justify-center h-full">
        <Card className="w-[280px] p-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span className="font-medium">Set end time</span>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose} className="h-8 w-8">
              <X className="h-4 w-4" />
            </Button>
          </div>
          <div className="space-y-4">
            <div className="text-sm text-muted-foreground">
              Enter the time you want the timer to end at.
              <br />
              If the time is earlier than now, it will be set for tomorrow.
            </div>
            <TimeInput value={time} onTimeChange={setTime} placeholder="14:30" />
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button onClick={() => onSubmit(time)} disabled={!time}>
                Set
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

const Popup = () => {
  const presets = [new Duration(60), new Duration(180), new Duration(300), new Duration(600)];
  const [histories, setHistories] = useState<History[]>([]);
  const [colorScheme, setColorScheme] = useState<ColorScheme | null>(null);
  const [showTimeInput, setShowTimeInput] = useState(false);

  useEffect(() => {
    History.all().then((histories) => setHistories(histories));

    Settings.get().then((settings) => {
      setColorScheme(settings.colorScheme);
    });
  }, []);

  useEffect(() => {
    if (colorScheme === ColorScheme.System || !colorScheme) {
      const isDarkMode = window.matchMedia("(prefers-color-scheme: dark)").matches;
      document.documentElement.classList.add(isDarkMode ? "dark" : "light");
    } else {
      document.documentElement.classList.add(colorScheme);
    }
  }, [colorScheme]);

  return (
    <div className="w-[344px] relative">
      <div className="w-full h-14 bg-primary text-primary-foreground px-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Coffee className="h-8 w-8" />
          <span className="text-lg font-semibold">Snack Time</span>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="text-primary-foreground hover:text-primary-foreground/50 hover:bg-transparent"
          onClick={() => chrome.runtime.openOptionsPage()}
        >
          <SettingsIcon className="h-8 w-8" />
        </Button>
      </div>

      <div className="p-3 border-b flex items-center gap-2">
        <Button variant="outline" className="w-full flex items-center gap-2" onClick={() => setShowTimeInput(true)}>
          <Clock className="h-4 w-4" />
          <span>Set end time</span>
        </Button>
      </div>

      <div className="flex">
        <Card className="flex-1 rounded-none border-0">
          <div className="text-center py-2 font-medium text-sm text-muted-foreground">Presets</div>
          <div className="space-y-1">
            {presets.map((duration, index) => (
              <TimerListItem key={index} duration={duration} />
            ))}
            <Button variant="ghost" className="w-full justify-end" onClick={() => startTimer(null)}>
              ⚡Custom
            </Button>
          </div>
        </Card>

        <div className="w-px bg-border" />

        <Card className="flex-1 rounded-none border-0">
          <div className="text-center py-2 font-medium text-sm text-muted-foreground">Recent</div>
          <div className="space-y-1">
            {histories.map((history: History, index: number) => (
              <TimerListItem key={index} duration={history.duration} />
            ))}
          </div>
        </Card>
      </div>

      {showTimeInput && (
        <TimeInputModal
          onClose={() => setShowTimeInput(false)}
          onSubmit={(time) => {
            startTimer(null, time);
            setShowTimeInput(false);
          }}
        />
      )}
    </div>
  );
};

export default Popup;
