import { Coffee, Volume2 } from "lucide-react";
import { useEffect, useState, useRef } from "react";
import { NotificationType } from "@/types/enums/NotificationType";
import { ExtensionSettings, Settings, AlarmSound } from "@/domain/settings/models/settings";
import { ColorScheme } from "@/types/enums/ColorScheme";
import "@/styles/globals.css";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import TimerCardPreview from "./components/TimerCardPreview";

const Options = () => {
  const [notificationType, setNotificationType] = useState<NotificationType>(NotificationType.Alarm);
  const [colorScheme, setColorScheme] = useState<ColorScheme>(ColorScheme.System);
  const [alarmSound, setAlarmSound] = useState<AlarmSound>("Simple");
  const [volume, setVolume] = useState<number>(0.1);
  const [settings, setSettings] = useState<ExtensionSettings>({
    colorScheme: ColorScheme.System,
    notificationType: NotificationType.Alarm,
    alarmSound: "Simple",
    volume: 0.1,
  });

  const audioContext = useRef<AudioContext | null>(null);
  const audioBuffer = useRef<AudioBuffer | null>(null);
  const gainNode = useRef<GainNode | null>(null);

  const playSound = async () => {
    try {
      if (!audioContext.current) {
        audioContext.current = new (window.AudioContext || (window as any).webkitAudioContext)();
        gainNode.current = audioContext.current.createGain();
        gainNode.current.connect(audioContext.current.destination);
      }

      if (!audioBuffer.current) {
        const response = await fetch(chrome.runtime.getURL(`sounds/${alarmSound}.wav`));
        const arrayBuffer = await response.arrayBuffer();
        audioBuffer.current = await audioContext.current.decodeAudioData(arrayBuffer);
      }

      await audioContext.current.resume();
      const source = audioContext.current.createBufferSource();
      source.buffer = audioBuffer.current;
      if (gainNode.current) {
        gainNode.current.gain.value = volume;
        source.connect(gainNode.current);
      }
      source.start();
    } catch (error) {
      console.error("Error playing sound:", error);
    }
  };

  // Reset audio buffer when alarm sound changes
  useEffect(() => {
    audioBuffer.current = null;
  }, [alarmSound]);

  useEffect(() => {
    if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
      document.documentElement.classList.add("dark");
    }

    Settings.get().then((settings) => {
      setSettings(settings);
      setNotificationType(settings.notificationType);
      setColorScheme(settings.colorScheme);
      setAlarmSound(settings.alarmSound);
      setVolume(settings.volume);
    });
  }, []);

  useEffect(() => {
    Settings.set({ notificationType });
  }, [notificationType]);

  useEffect(() => {
    Settings.set({ alarmSound });
  }, [alarmSound]);

  useEffect(() => {
    Settings.set({ colorScheme });

    // 全てのカラースキームのクラスを一旦削除
    Object.values(ColorScheme).forEach((scheme) => {
      document.documentElement.classList.remove(scheme);
    });

    if (colorScheme === ColorScheme.System) {
      // システムの設定に従う
      const isDarkMode = window.matchMedia("(prefers-color-scheme: dark)").matches;
      document.documentElement.classList.add(isDarkMode ? ColorScheme.Dark : ColorScheme.Light);
    } else {
      // 選択されたカラースキームを適用
      document.documentElement.classList.add(colorScheme);
    }
  }, [colorScheme]);

  useEffect(() => {
    Settings.set({ volume });
  }, [volume]);

  return (
    <div className="min-h-screen bg-background">
      <div className="w-full h-14 bg-primary/80 text-primary-foreground px-3 flex items-center">
        <div className="flex items-center gap-2">
          <Coffee className="h-8 w-8" />
          <span className="text-lg font-semibold">Snack Time</span>
        </div>
      </div>

      <div className="container mx-auto mt-8">
        <div className="space-y-12">
          <section>
            <h2 className="text-2xl font-bold text-foreground">General</h2>
            <Separator className="my-4" />
            <div>
              <h3 className="text-lg font-semibold text-foreground">Coming soon...</h3>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-foreground">Appearance</h2>
            <Separator className="my-4" />
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-foreground">Color Scheme</h3>
              <RadioGroup
                value={colorScheme}
                onValueChange={(value) => setColorScheme(value as ColorScheme)}
                className="flex gap-8"
              >
                {Object.values(ColorScheme).map((value) => (
                  <div key={value} className="flex items-center space-x-2">
                    <RadioGroupItem value={value} id={`color-scheme-${value}`} />
                    <Label htmlFor={`color-scheme-${value}`} className="text-foreground">
                      {Object.keys(ColorScheme)[Object.values(ColorScheme).indexOf(value)]}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>
            <div className="mt-8">
              <TimerCardPreview />
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-foreground">Notification</h2>
            <Separator className="my-4" />
            <div className="space-y-8">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-foreground">Notification Type</h3>
                <RadioGroup
                  value={notificationType}
                  onValueChange={(value) => setNotificationType(value as NotificationType)}
                  className="flex gap-8"
                >
                  {Object.values(NotificationType).map((value) => (
                    <div key={value} className="flex items-center space-x-2">
                      <RadioGroupItem value={value} id={`notification-type-${value}`} />
                      <Label htmlFor={`notification-type-${value}`} className="text-foreground">
                        {Object.keys(NotificationType)[Object.values(NotificationType).indexOf(value)]}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-foreground">Alarm Sound</h3>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={playSound}
                    className="rounded-full"
                    title="Play selected sound"
                  >
                    <Volume2 className="h-4 w-4" />
                  </Button>
                </div>
                <RadioGroup
                  value={alarmSound}
                  onValueChange={(value) => setAlarmSound(value as AlarmSound)}
                  className="flex gap-8"
                >
                  {["Simple", "Piano", "Vibraphone", "SteelDrums"].map((value) => (
                    <div key={value} className="flex items-center space-x-2">
                      <RadioGroupItem value={value} id={`alarm-sound-${value}`} />
                      <Label htmlFor={`alarm-sound-${value}`} className="text-foreground">
                        {value}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-foreground">Volume</h3>
                <div className="flex items-center gap-8">
                  <div className="flex-1">
                    <Slider
                      value={[volume * 100]}
                      onValueChange={(value) => setVolume(value[0] / 100)}
                      max={100}
                      step={1}
                    />
                  </div>
                  <div className="w-12 text-right">{Math.round(volume * 100)}%</div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Options;
