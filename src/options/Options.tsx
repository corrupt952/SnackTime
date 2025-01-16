import { Coffee } from "lucide-react";
import { useEffect, useState } from "react";
import { NotificationType } from "@/types/enums/NotificationType";
import { ExtensionSettings, Settings } from "@/domain/settings/models/settings";
import { ColorScheme } from "@/types/enums/ColorScheme";
import "@/styles/globals.css";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

const Options = () => {
  const [notificationType, setNotificationType] = useState<NotificationType>(NotificationType.Alarm);
  const [colorScheme, setColorScheme] = useState<ColorScheme>(ColorScheme.System);
  const [settings, setSettings] = useState<ExtensionSettings>({
    colorScheme: ColorScheme.System,
    notificationType: NotificationType.Alarm,
  });

  useEffect(() => {
    if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
      document.documentElement.classList.add("dark");
    }

    Settings.get().then((settings) => {
      setSettings(settings);
      setNotificationType(settings.notificationType);
      setColorScheme(settings.colorScheme);

      if (settings.colorScheme === ColorScheme.Dark) {
        document.documentElement.classList.add("dark");
      } else if (settings.colorScheme === ColorScheme.Light) {
        document.documentElement.classList.remove("dark");
      }
    });
  }, []);

  useEffect(() => {
    Settings.set({ notificationType });
  }, [notificationType]);

  useEffect(() => {
    Settings.set({ colorScheme });

    if (colorScheme === ColorScheme.Dark) {
      document.documentElement.classList.add("dark");
    } else if (colorScheme === ColorScheme.Light) {
      document.documentElement.classList.remove("dark");
    } else {
      if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
    }
  }, [colorScheme]);

  return (
    <div className="min-h-screen bg-background">
      <div className="w-full h-14 bg-neutral-900 text-neutral-50 px-3 flex items-center">
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
                <h3 className="text-lg font-semibold text-foreground">Alarm Sound</h3>
                <p className="text-foreground">Coming soon...</p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Options;
