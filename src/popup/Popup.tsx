import { Coffee, Clock, SettingsIcon, X } from "lucide-react";
import { History } from "@/domain/timer/model/history";
import { Duration } from "@/domain/timer/value/duration";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import "@/styles/globals.css";
import { Settings, PresetTimer } from "@/domain/settings/models/settings";
import { ColorScheme, applyColorSchemeClass } from "@/lib/color-scheme";
import { changeLanguage } from "@/i18n/config";
import { timerService } from "./services/timer";
import { TimeInputModal } from "./components/TimeInputModal";
import { CustomDurationModal } from "./components/CustomDurationModal";
import { TimerListItem } from "./components/TimerListItem";

const Popup = () => {
  const { t } = useTranslation();
  const [presets, setPresets] = useState<PresetTimer[]>([]);
  const [histories, setHistories] = useState<History[]>([]);
  const [colorScheme, setColorScheme] = useState<ColorScheme | null>(null);
  const [showTimeInput, setShowTimeInput] = useState(false);
  const [showCustomDuration, setShowCustomDuration] = useState(false);

  useEffect(() => {
    History.all().then((histories) => setHistories(histories));

    Settings.get().then((settings) => {
      setColorScheme(settings.colorScheme);
      setPresets(settings.presetTimers);
      changeLanguage(settings.language);
    });
  }, []);

  useEffect(() => {
    applyColorSchemeClass(document.documentElement, colorScheme);
  }, [colorScheme]);

  return (
    <div className="w-[344px] relative">
      <div className="w-full h-14 bg-primary text-primary-foreground px-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Coffee className="h-8 w-8" />
          <span className="text-lg font-semibold">{t("common.appName")}</span>
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
          <span>{t("popup.setEndTime")}</span>
        </Button>
      </div>

      <div className="flex">
        <Card className="flex-1 rounded-none border-0">
          <div className="text-center py-2 font-medium text-sm text-muted-foreground">{t("popup.presets")}</div>
          <div className="space-y-1">
            {presets.map((preset, index) => {
              const duration = new Duration(preset.minutes * 60);
              return <TimerListItem key={index} duration={duration} onStart={() => timerService.start(duration)} />;
            })}
            <Button variant="ghost" className="w-full justify-end" onClick={() => setShowCustomDuration(true)}>
              {t("popup.custom")}
            </Button>
          </div>
        </Card>

        <div className="w-px bg-border" />

        <Card className="flex-1 rounded-none border-0">
          <div className="text-center py-2 font-medium text-sm text-muted-foreground">{t("popup.recent")}</div>
          <div className="space-y-1">
            {histories.map((history: History, index: number) => (
              <TimerListItem
                key={index}
                duration={history.duration}
                onStart={() => timerService.start(history.duration)}
              />
            ))}
          </div>
        </Card>
      </div>

      {showTimeInput && (
        <TimeInputModal
          onClose={() => setShowTimeInput(false)}
          onSubmit={(time) => {
            timerService.start(null, time);
            setShowTimeInput(false);
          }}
        />
      )}

      {showCustomDuration && (
        <CustomDurationModal
          onClose={() => setShowCustomDuration(false)}
          onSubmit={(duration) => {
            timerService.start(duration);
            setShowCustomDuration(false);
          }}
        />
      )}
    </div>
  );
};

export default Popup;
