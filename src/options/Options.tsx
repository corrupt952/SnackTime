import {
  Coffee,
  Volume2,
  Palette,
  Bell,
  Settings2,
  Globe,
  Info,
  Github,
  ExternalLink,
  Scale,
  Heart,
  AtSign,
  Mail,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { NotificationType } from "@/types/enums/NotificationType";
import {
  ExtensionSettings,
  Settings,
  AlarmSound,
  TimerPosition,
  PresetTimer,
  Language,
} from "@/domain/settings/models/settings";
import { ColorScheme, applyColorSchemeClass } from "@/lib/color-scheme";
import { changeLanguage, supportedLanguages } from "@/i18n/config";
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
import { TimerPositionSelector } from "./components/TimerPositionSelector";
import { PresetTimerEditor } from "./components/PresetTimerEditor";
import { ThemeSelector } from "./components/ThemeSelector";

const Options = () => {
  const { t } = useTranslation();
  const [language, setLanguage] = useState<Language>("system");
  const [notificationType, setNotificationType] = useState<NotificationType>(NotificationType.Alarm);
  const [colorScheme, setColorScheme] = useState<ColorScheme>(ColorScheme.System);
  const [alarmSound, setAlarmSound] = useState<AlarmSound>("Simple");
  const [volume, setVolume] = useState<number>(0.1);
  const [applyThemeToSettings, setApplyThemeToSettings] = useState<boolean>(false);
  const [timerPosition, setTimerPosition] = useState<TimerPosition>("top-right");
  const [presetTimers, setPresetTimers] = useState<PresetTimer[]>([
    { minutes: 1 },
    { minutes: 3 },
    { minutes: 5 },
    { minutes: 10 },
  ]);
  const [settings, setSettings] = useState<ExtensionSettings>({
    language: "system",
    colorScheme: ColorScheme.System,
    notificationType: NotificationType.Alarm,
    alarmSound: "Simple",
    volume: 0.1,
    applyThemeToSettings: false,
    timerPosition: "top-right",
    presetTimers: [{ minutes: 1 }, { minutes: 3 }, { minutes: 5 }, { minutes: 10 }],
  });

  const { playSound } = useAudioPlayback(alarmSound, volume);

  const navigationItems: SidebarNavigationItem[] = [
    { href: "#general", label: t("options.nav.general"), icon: Settings2 },
    { href: "#appearance", label: t("options.nav.appearance"), icon: Palette },
    { href: "#notification", label: t("options.nav.notification"), icon: Bell },
    { href: "#about", label: t("options.nav.about"), icon: Info },
  ];

  useEffect(() => {
    applyColorSchemeClass(document.documentElement, ColorScheme.Light);

    Settings.get().then((settings) => {
      setSettings(settings);
      setLanguage(settings.language);
      setNotificationType(settings.notificationType);
      setColorScheme(settings.colorScheme);
      setAlarmSound(settings.alarmSound);
      setVolume(settings.volume);
      setApplyThemeToSettings(settings.applyThemeToSettings);
      setTimerPosition(settings.timerPosition);
      setPresetTimers(settings.presetTimers);
      // Apply stored language setting
      changeLanguage(settings.language);
    });
  }, []);

  // Use custom hooks for settings synchronization
  useSettingsSync("language", language);
  useSettingsSync("notificationType", notificationType);
  useSettingsSync("alarmSound", alarmSound);
  useSettingsSync("colorScheme", colorScheme);
  useSettingsSync("volume", volume);
  useSettingsSync("applyThemeToSettings", applyThemeToSettings);
  useSettingsSync("timerPosition", timerPosition);
  useSettingsSync("presetTimers", presetTimers);

  // Handle language change
  const handleLanguageChange = (newLanguage: Language) => {
    setLanguage(newLanguage);
    changeLanguage(newLanguage);
  };

  useEffect(() => {
    if (applyThemeToSettings) {
      applyColorSchemeClass(document.documentElement, colorScheme);
    } else {
      applyColorSchemeClass(document.documentElement, ColorScheme.Light);
    }
  }, [colorScheme, applyThemeToSettings]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
      <PageHeader icon={Coffee} title={t("common.appName")} subtitle={t("options.subtitle")} showPulse />

      <div className="container mx-auto mt-8 pb-12">
        <div className="grid gap-6 lg:grid-cols-4">
          <aside className="lg:col-span-1">
            <SidebarNavigation items={navigationItems} />
          </aside>

          <main className="lg:col-span-3 space-y-6">
            <SettingsSection id="general" icon={Settings2} title={t("options.general.title")}>
              <div className="space-y-6">
                <div>
                  <h3 className="text-base font-semibold text-foreground mb-2">
                    {t("options.general.language.label")}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4">{t("options.general.language.description")}</p>
                  <RadioGroup
                    value={language}
                    onValueChange={(value) => handleLanguageChange(value as Language)}
                    className="grid grid-cols-1 sm:grid-cols-3 gap-3"
                  >
                    {supportedLanguages.map((lang) => (
                      <RadioCard
                        key={lang.code}
                        id={`language-${lang.code}`}
                        value={lang.code}
                        title={t(`language.${lang.code}` as const)}
                        description={lang.code === "system" ? t("language.systemDescription") : lang.nativeName}
                        icon={Globe}
                        isSelected={language === lang.code}
                      />
                    ))}
                  </RadioGroup>
                </div>

                <div>
                  <h3 className="text-base font-semibold text-foreground mb-2">
                    {t("options.general.timerPosition.label")}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4">{t("options.general.timerPosition.description")}</p>
                  <TimerPositionSelector value={timerPosition} onChange={(value) => setTimerPosition(value)} />
                </div>

                <div>
                  <h3 className="text-base font-semibold text-foreground mb-2">{t("options.general.presetTimers")}</h3>
                  <PresetTimerEditor presets={presetTimers} onChange={setPresetTimers} />
                </div>
              </div>
            </SettingsSection>

            <SettingsSection id="appearance" icon={Palette} title={t("options.appearance.title")}>
              <div className="space-y-6">
                <div>
                  <h3 className="text-base font-semibold text-foreground mb-4">
                    {t("options.appearance.colorScheme")}
                  </h3>
                  <ThemeSelector value={colorScheme} onChange={setColorScheme} />
                </div>

                <div className="flex items-center justify-between p-4 rounded-lg border bg-muted/10">
                  <div className="space-y-0.5">
                    <Label htmlFor="apply-theme-to-settings" className="text-base font-medium cursor-pointer">
                      {t("options.appearance.applyToSettings.label")}
                    </Label>
                    <p className="text-xs text-muted-foreground">
                      {t("options.appearance.applyToSettings.description")}
                    </p>
                  </div>
                  <Switch
                    id="apply-theme-to-settings"
                    checked={applyThemeToSettings}
                    onCheckedChange={setApplyThemeToSettings}
                  />
                </div>
              </div>
            </SettingsSection>

            <SettingsSection id="notification" icon={Bell} title={t("options.notification.title")}>
              <div className="space-y-6">
                <div>
                  <h3 className="text-base font-semibold text-foreground mb-4">{t("options.notification.type")}</h3>
                  <RadioGroup
                    value={notificationType}
                    onValueChange={(value) => setNotificationType(value as NotificationType)}
                    className="grid grid-cols-1 sm:grid-cols-2 gap-3"
                  >
                    {Object.entries(NotificationType).map(([key, value]) => (
                      <RadioCard
                        key={value}
                        id={`notification-type-${value}`}
                        value={value}
                        title={t(`notificationType.${value}` as const)}
                        description={
                          value === NotificationType.Alarm
                            ? t("notificationType.alarmDescription")
                            : value === NotificationType.None
                              ? t("notificationType.noneDescription")
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
                    <h3 className="text-base font-semibold text-foreground">{t("options.notification.alarmSound")}</h3>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={playSound}
                      className="gap-2"
                      title={t("common.preview")}
                      disabled={notificationType === NotificationType.None}
                    >
                      <Volume2 className="h-4 w-4" />
                      <span className="text-xs">{t("common.preview")}</span>
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
                        id={`alarm-sound-${value}`}
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
                  <h3 className="text-base font-semibold text-foreground">{t("options.notification.volume")}</h3>
                  <VolumeControl
                    value={volume}
                    onValueChange={setVolume}
                    disabled={notificationType === NotificationType.None}
                  />
                </div>
              </div>
            </SettingsSection>

            <SettingsSection id="about" icon={Info} title={t("options.about.title")}>
              <div className="space-y-6">
                <div className="flex items-center gap-4 p-4 rounded-lg border bg-muted/10">
                  <div className="flex items-center justify-center w-16 h-16 rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 border">
                    <Coffee className="h-8 w-8 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-foreground">{t("common.appName")}</h3>
                    <p className="text-sm text-muted-foreground">{t("options.about.version")} 2025.06.4</p>
                  </div>
                </div>

                <p className="text-sm text-muted-foreground leading-relaxed">{t("options.about.description")}</p>

                <div>
                  <h3 className="text-base font-semibold text-foreground mb-3">{t("options.about.author")}</h3>
                  <a
                    href="https://zuki.dev"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-primary hover:underline"
                  >
                    K@zuki.
                  </a>
                </div>

                <div>
                  <h3 className="text-base font-semibold text-foreground mb-3">{t("options.about.links")}</h3>
                  <div className="flex flex-wrap gap-2">
                    <a
                      href="https://github.com/corrupt952/SnackTime"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg border bg-background hover:bg-muted/50 transition-colors"
                    >
                      <Github className="h-4 w-4" />
                      {t("options.about.sourceCode")}
                      <ExternalLink className="h-3 w-3 opacity-50" />
                    </a>
                    <a
                      href="https://ko-fi.com/corrupt952"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg border bg-background hover:bg-muted/50 transition-colors"
                    >
                      <Heart className="h-4 w-4" />
                      {t("options.about.support")}
                      <ExternalLink className="h-3 w-3 opacity-50" />
                    </a>
                  </div>
                </div>

                <div>
                  <h3 className="text-base font-semibold text-foreground mb-2">{t("options.about.feedback")}</h3>
                  <p className="text-sm text-muted-foreground mb-3">{t("options.about.feedbackDescription")}</p>
                  <div className="flex flex-wrap gap-2">
                    <a
                      href="https://github.com/corrupt952/SnackTime/issues"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg border bg-background hover:bg-muted/50 transition-colors"
                    >
                      <Github className="h-4 w-4" />
                      {t("options.about.gitHubIssues")}
                      <ExternalLink className="h-3 w-3 opacity-50" />
                    </a>
                    <a
                      href="https://x.com/corrupt952"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg border bg-background hover:bg-muted/50 transition-colors"
                    >
                      <AtSign className="h-4 w-4" />
                      {t("options.about.xTwitter")}
                      <ExternalLink className="h-3 w-3 opacity-50" />
                    </a>
                    <a
                      href="https://relaybase.app/forms/3e45e7b9f03c4d84"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg border bg-background hover:bg-muted/50 transition-colors"
                    >
                      <Mail className="h-4 w-4" />
                      {t("options.about.feedbackForm")}
                      <ExternalLink className="h-3 w-3 opacity-50" />
                    </a>
                  </div>
                </div>

                <div className="p-4 rounded-lg border bg-muted/10">
                  <div className="flex items-center gap-2 mb-2">
                    <Scale className="h-4 w-4 text-muted-foreground" />
                    <h3 className="text-sm font-semibold text-foreground">{t("options.about.license")}</h3>
                  </div>
                  <p className="text-xs text-muted-foreground">{t("options.about.openSource")}</p>
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
