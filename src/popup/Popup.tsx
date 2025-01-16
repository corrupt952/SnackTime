import { Coffee, SettingsIcon } from "lucide-react";
import { History } from "@/domain/timer/model/history";
import { Duration } from "@/domain/timer/value/duration";
import { useEffect, useState } from "react";
import { Settings as SettingsModel } from "@/domain/settings/models/settings";
import { NavigationMenu, NavigationMenuItem, NavigationMenuList } from "@/components/ui/navigation-menu";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import "@/styles/globals.css";

const startTimer = async (duration: Duration | null) => {
  if (!duration) {
    const time = Number(prompt("Enter timer seconds in seconds:", String(300)));
    if (time === 0 || isNaN(time)) {
      return;
    }
    duration = new Duration(time);
  }

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

const Popup = () => {
  const presets = [new Duration(60), new Duration(180), new Duration(300), new Duration(600)];
  const [histories, setHistories] = useState<History[]>([]);

  useEffect(() => {
    History.all().then((histories) => setHistories(histories));
  }, []);

  return (
    <div className="w-[344px]">
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
    </div>
  );
};

export default Popup;
