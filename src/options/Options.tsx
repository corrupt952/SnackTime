import { Coffee, Volume2, Palette, Bell, Settings2, Sparkles, Moon, Sun, Monitor } from "lucide-react";
import { useEffect, useState } from "react";
import { NotificationType } from "@/types/enums/NotificationType";
import { ExtensionSettings, Settings, AlarmSound } from "@/domain/settings/models/settings";
import { ColorScheme } from "@/types/enums/ColorScheme";
import "@/styles/globals.css";
import { RadioGroup } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { PageHeader } from "@/components/ui/page-header";
import { SidebarNavigation, type SidebarNavigationItem } from "@/components/ui/sidebar-navigation";
import { SettingsSection } from "@/components/ui/settings-section";
import { RadioCard } from "@/components/ui/radio-card";
import { VolumeControl } from "@/components/ui/volume-control";
import { useSettingsSync } from "@/lib/hooks/use-settings-sync";
import { useAudioPlayback } from "@/lib/hooks/use-audio-playback";
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

  const { playSound } = useAudioPlayback(alarmSound, volume);

  const navigationItems: SidebarNavigationItem[] = [
    { href: "#general", label: "General", icon: Settings2 },
    { href: "#appearance", label: "Appearance", icon: Palette },
    { href: "#notification", label: "Notification", icon: Bell },
  ];

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

  // Use custom hooks for settings synchronization
  useSettingsSync("notificationType", notificationType);
  useSettingsSync("alarmSound", alarmSound);
  useSettingsSync("colorScheme", colorScheme);
  useSettingsSync("volume", volume);
  useSettingsSync("applyThemeToSettings", applyThemeToSettings);

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

  const getColorSchemeIcon = (scheme: ColorScheme) => {
    switch (scheme) {
      case ColorScheme.Light:
        return Sun;
      case ColorScheme.Dark:
        return Moon;
      case ColorScheme.System:
        return Monitor;
      default:
        return Sparkles;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
      <PageHeader icon={Coffee} title="Snack Time" subtitle="Timer Extension Settings" showPulse />

      <div className="container mx-auto mt-8 pb-12">
        <div className="grid gap-6 lg:grid-cols-4">
          <aside className="lg:col-span-1">
            <SidebarNavigation items={navigationItems} />
          </aside>

          <main className="lg:col-span-3 space-y-6">
            <SettingsSection id="general" icon={Settings2} title="General Settings">
              <div className="rounded-lg bg-muted/50 p-4 border border-dashed">
                <p className="text-sm text-muted-foreground">More settings coming soon...</p>
              </div>
            </SettingsSection>

            <SettingsSection id="appearance" icon={Palette} title="Appearance">
              <div className="space-y-6">
                <div>
                  <h3 className="text-base font-semibold text-foreground mb-4">Color Scheme</h3>
                  <RadioGroup
                    value={colorScheme}
                    onValueChange={(value) => setColorScheme(value as ColorScheme)}
                    className="grid grid-cols-1 sm:grid-cols-3 gap-3"
                  >
                    {Object.entries(ColorScheme).map(([key, value]) => (
                      <RadioCard
                        key={value}
                        value={value}
                        title={key}
                        description={
                          value === ColorScheme.System
                            ? "Match system preference"
                            : value === ColorScheme.Light
                              ? "Always light theme"
                              : value === ColorScheme.Dark
                                ? "Always dark theme"
                                : value === ColorScheme.Lemon
                                  ? "Bright yellow theme"
                                  : value === ColorScheme.Mint
                                    ? "Fresh mint theme"
                                    : value === ColorScheme.Rose
                                      ? "Soft rose theme"
                                      : ""
                        }
                        icon={getColorSchemeIcon(value)}
                        isSelected={colorScheme === value}
                      />
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
            </SettingsSection>

            <SettingsSection id="notification" icon={Bell} title="Notification">
              <div className="space-y-6">
                <div>
                  <h3 className="text-base font-semibold text-foreground mb-4">Notification Type</h3>
                  <RadioGroup
                    value={notificationType}
                    onValueChange={(value) => setNotificationType(value as NotificationType)}
                    className="grid grid-cols-1 sm:grid-cols-2 gap-3"
                  >
                    {Object.entries(NotificationType).map(([key, value]) => (
                      <RadioCard
                        key={value}
                        value={value}
                        title={key}
                        description={
                          value === NotificationType.Alarm
                            ? "Play sound notification"
                            : value === NotificationType.None
                              ? "Silent mode"
                              : ""
                        }
                        icon={Bell}
                        isSelected={notificationType === value}
                      />
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
                      <RadioCard
                        key={value}
                        value={value}
                        title={value}
                        icon={Volume2}
                        isSelected={alarmSound === value}
                        className="p-3"
                      />
                    ))}
                  </RadioGroup>
                </div>

                <div
                  className={`space-y-4 transition-opacity duration-300 ${notificationType === NotificationType.None ? "opacity-50 pointer-events-none" : ""}`}
                >
                  <h3 className="text-base font-semibold text-foreground">Volume</h3>
                  <VolumeControl
                    value={volume}
                    onValueChange={setVolume}
                    disabled={notificationType === NotificationType.None}
                  />
                </div>
              </div>
            </SettingsSection>
          </main>
        </div>
      </div>
    </div>
  );
};

export default Options;
