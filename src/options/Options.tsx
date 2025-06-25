import { Coffee, Volume2, Palette, Bell, Settings2, Sparkles, Moon, Sun, Monitor } from "lucide-react";
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
import { Switch } from "@/components/ui/switch";
import TimerCardPreview from "./components/TimerCardPreview";

const Options = () => {
  const [notificationType, setNotificationType] = useState<NotificationType>(NotificationType.Alarm);
  const [colorScheme, setColorScheme] = useState<ColorScheme>(ColorScheme.System);
  const [alarmSound, setAlarmSound] = useState<AlarmSound>("Simple");
  const [volume, setVolume] = useState<number>(0.1);
  const [applyThemeToSettings, setApplyThemeToSettings] = useState<boolean>(false);
  const [settings, setSettings] = useState<ExtensionSettings>({
    colorScheme: ColorScheme.System,
    notificationType: NotificationType.Alarm,
    alarmSound: "Simple",
    volume: 0.1,
    applyThemeToSettings: false,
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
    document.documentElement.classList.remove("dark");
    Object.values(ColorScheme).forEach((scheme) => {
      document.documentElement.classList.remove(scheme);
    });
    document.documentElement.classList.add("light");

    Settings.get().then((settings) => {
      setSettings(settings);
      setNotificationType(settings.notificationType);
      setColorScheme(settings.colorScheme);
      setAlarmSound(settings.alarmSound);
      setVolume(settings.volume);
      setApplyThemeToSettings(settings.applyThemeToSettings);
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
  }, [colorScheme]);

  useEffect(() => {
    if (applyThemeToSettings) {
      Object.values(ColorScheme).forEach((scheme) => {
        document.documentElement.classList.remove(scheme);
      });

      if (colorScheme === ColorScheme.System) {
        const isDarkMode = window.matchMedia("(prefers-color-scheme: dark)").matches;
        document.documentElement.classList.add(isDarkMode ? ColorScheme.Dark : ColorScheme.Light);
      } else {
        document.documentElement.classList.add(colorScheme);
      }
    } else {
      // Reset to light theme when disabled
      Object.values(ColorScheme).forEach((scheme) => {
        document.documentElement.classList.remove(scheme);
      });
      document.documentElement.classList.add("light");
    }
  }, [colorScheme, applyThemeToSettings]);

  useEffect(() => {
    Settings.set({ volume });
  }, [volume]);

  useEffect(() => {
    Settings.set({ applyThemeToSettings });
  }, [applyThemeToSettings]);

  const getColorSchemeIcon = (scheme: ColorScheme) => {
    switch (scheme) {
      case ColorScheme.Light:
        return <Sun className="h-4 w-4" />;
      case ColorScheme.Dark:
        return <Moon className="h-4 w-4" />;
      case ColorScheme.System:
        return <Monitor className="h-4 w-4" />;
      default:
        return <Sparkles className="h-4 w-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
      <div className="w-full h-16 bg-gradient-to-r from-primary to-primary/80 text-primary-foreground px-6 flex items-center shadow-lg">
        <div className="flex items-center gap-3">
          <div className="relative">
            <Coffee className="h-9 w-9" />
            <div className="absolute -bottom-1 -right-1 h-3 w-3 bg-accent rounded-full animate-pulse" />
          </div>
          <div>
            <h1 className="text-xl font-bold">Snack Time</h1>
            <p className="text-xs opacity-90">Timer Extension Settings</p>
          </div>
        </div>
      </div>

      <div className="container mx-auto mt-8 pb-12">
        <div className="grid gap-6 lg:grid-cols-4">
          <aside className="lg:col-span-1">
            <nav className="sticky top-8 space-y-1 rounded-lg border bg-card p-4 shadow-sm">
              <a
                href="#general"
                className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground transition-colors"
              >
                <Settings2 className="h-4 w-4" />
                General
              </a>
              <a
                href="#appearance"
                className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground transition-colors"
              >
                <Palette className="h-4 w-4" />
                Appearance
              </a>
              <a
                href="#notification"
                className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground transition-colors"
              >
                <Bell className="h-4 w-4" />
                Notification
              </a>
            </nav>
          </aside>

          <main className="lg:col-span-3 space-y-6">
            <section id="general" className="rounded-xl border bg-card p-6 shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <Settings2 className="h-5 w-5 text-primary" />
                <h2 className="text-xl font-bold text-foreground">General Settings</h2>
              </div>
              <Separator className="mb-6" />
              <div className="rounded-lg bg-muted/50 p-4 border border-dashed">
                <p className="text-sm text-muted-foreground">More settings coming soon...</p>
              </div>
            </section>

            <section id="appearance" className="rounded-xl border bg-card p-6 shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <Palette className="h-5 w-5 text-primary" />
                <h2 className="text-xl font-bold text-foreground">Appearance</h2>
              </div>
              <Separator className="mb-6" />

              <div className="space-y-6">
                <div>
                  <h3 className="text-base font-semibold text-foreground mb-4">Color Scheme</h3>
                  <RadioGroup
                    value={colorScheme}
                    onValueChange={(value) => setColorScheme(value as ColorScheme)}
                    className="grid grid-cols-1 sm:grid-cols-3 gap-3"
                  >
                    {Object.entries(ColorScheme).map(([key, value]) => (
                      <label
                        key={value}
                        htmlFor={`color-scheme-${value}`}
                        className="relative flex cursor-pointer rounded-lg border bg-background p-4 hover:bg-accent/50 transition-all duration-200 hover:shadow-md"
                      >
                        <RadioGroupItem value={value} id={`color-scheme-${value}`} className="sr-only" />
                        <div className="flex items-center gap-3 w-full">
                          <div className="flex h-10 w-10 items-center justify-center rounded-md bg-primary/10 text-primary">
                            {getColorSchemeIcon(value)}
                          </div>
                          <div className="flex-1">
                            <p className="font-medium">{key}</p>
                            <p className="text-xs text-muted-foreground">
                              {value === ColorScheme.System && "Match system preference"}
                              {value === ColorScheme.Light && "Always light theme"}
                              {value === ColorScheme.Dark && "Always dark theme"}
                              {value === ColorScheme.Lemon && "Bright yellow theme"}
                              {value === ColorScheme.Mint && "Fresh mint theme"}
                              {value === ColorScheme.Rose && "Soft rose theme"}
                            </p>
                          </div>
                          {colorScheme === value && (
                            <div className="absolute right-2 top-2 h-2 w-2 rounded-full bg-primary" />
                          )}
                        </div>
                      </label>
                    ))}
                  </RadioGroup>
                </div>
                <div className="rounded-lg bg-muted/30 p-4">
                  <h4 className="text-sm font-medium mb-3">Preview</h4>
                  <TimerCardPreview colorScheme={colorScheme} />
                </div>

                <div className="flex items-center justify-between p-4 rounded-lg border bg-muted/10">
                  <div className="space-y-0.5">
                    <Label htmlFor="apply-theme-to-settings" className="text-base font-medium cursor-pointer">
                      Apply to this page
                    </Label>
                    <p className="text-xs text-muted-foreground">Use selected theme for the settings page</p>
                  </div>
                  <Switch
                    id="apply-theme-to-settings"
                    checked={applyThemeToSettings}
                    onCheckedChange={setApplyThemeToSettings}
                  />
                </div>
              </div>
            </section>

            <section id="notification" className="rounded-xl border bg-card p-6 shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <Bell className="h-5 w-5 text-primary" />
                <h2 className="text-xl font-bold text-foreground">Notification</h2>
              </div>
              <Separator className="mb-6" />

              <div className="space-y-6">
                <div>
                  <h3 className="text-base font-semibold text-foreground mb-4">Notification Type</h3>
                  <RadioGroup
                    value={notificationType}
                    onValueChange={(value) => setNotificationType(value as NotificationType)}
                    className="grid grid-cols-1 sm:grid-cols-2 gap-3"
                  >
                    {Object.entries(NotificationType).map(([key, value]) => (
                      <label
                        key={value}
                        htmlFor={`notification-type-${value}`}
                        className="relative flex cursor-pointer rounded-lg border bg-background p-4 hover:bg-accent/50 transition-all duration-200 hover:shadow-md"
                      >
                        <RadioGroupItem value={value} id={`notification-type-${value}`} className="sr-only" />
                        <div className="flex items-center gap-3 w-full">
                          <div className="flex h-10 w-10 items-center justify-center rounded-md bg-primary/10 text-primary">
                            <Bell className="h-4 w-4" />
                          </div>
                          <div className="flex-1">
                            <p className="font-medium">{key}</p>
                            <p className="text-xs text-muted-foreground">
                              {value === NotificationType.Alarm && "Play sound notification"}
                              {value === NotificationType.None && "Silent mode"}
                            </p>
                          </div>
                          {notificationType === value && (
                            <div className="absolute right-2 top-2 h-2 w-2 rounded-full bg-primary" />
                          )}
                        </div>
                      </label>
                    ))}
                  </RadioGroup>
                </div>

                <div
                  className={`space-y-4 transition-opacity duration-300 ${notificationType === NotificationType.None ? "opacity-50 pointer-events-none" : ""}`}
                >
                  <div className="flex items-center justify-between">
                    <h3 className="text-base font-semibold text-foreground">Alarm Sound</h3>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={playSound}
                      className="gap-2"
                      title="Play selected sound"
                      disabled={notificationType === NotificationType.None}
                    >
                      <Volume2 className="h-4 w-4" />
                      <span className="text-xs">Preview</span>
                    </Button>
                  </div>
                  <RadioGroup
                    value={alarmSound}
                    onValueChange={(value) => setAlarmSound(value as AlarmSound)}
                    className="grid grid-cols-2 gap-3"
                  >
                    {["Simple", "Piano", "Vibraphone", "SteelDrums"].map((value) => (
                      <label
                        key={value}
                        htmlFor={`alarm-sound-${value}`}
                        className="relative flex cursor-pointer rounded-lg border bg-background p-3 hover:bg-accent/50 transition-all duration-200 hover:shadow-md"
                      >
                        <RadioGroupItem value={value} id={`alarm-sound-${value}`} className="sr-only" />
                        <div className="flex items-center gap-2 w-full">
                          <Volume2 className="h-4 w-4 text-muted-foreground" />
                          <p className="font-medium text-sm">{value}</p>
                          {alarmSound === value && (
                            <div className="absolute right-2 top-2 h-2 w-2 rounded-full bg-primary" />
                          )}
                        </div>
                      </label>
                    ))}
                  </RadioGroup>
                </div>

                <div
                  className={`space-y-4 transition-opacity duration-300 ${notificationType === NotificationType.None ? "opacity-50 pointer-events-none" : ""}`}
                >
                  <h3 className="text-base font-semibold text-foreground">Volume</h3>
                  <div className="rounded-lg bg-muted/10 p-4">
                    <div className="flex items-center gap-4">
                      <Volume2 className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                      <div className="flex-1">
                        <Slider
                          value={[volume * 100]}
                          onValueChange={(value) => setVolume(value[0] / 100)}
                          max={100}
                          step={1}
                          disabled={notificationType === NotificationType.None}
                          className="[&_[role=slider]]:transition-all [&_[role=slider]]:duration-200 [&_[role=slider]:hover]:scale-110"
                        />
                      </div>
                      <div className="min-w-[3rem] text-right font-mono text-sm font-medium">
                        {Math.round(volume * 100)}%
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </main>
        </div>
      </div>
    </div>
  );
};

export default Options;
