import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { ArrowLeft } from "lucide-react";
import { memo } from "react";

interface TimerSettingsProps {
  soundEnabled: boolean;
  onToggleSound: (checked: boolean) => void;
  onBack: () => void;
}

const TimerSettings = memo(({ soundEnabled, onToggleSound, onBack }: TimerSettingsProps) => {
  return (
    <div className="w-full">
      <div className="flex items-center mb-6">
        <Button variant="ghost" size="icon" onClick={onBack} className="mr-2">
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h2 className="text-xl font-semibold">Settings</h2>
      </div>

      <div className="space-y-6">
        <div className="flex items-center space-x-2">
          <Switch id="sound" checked={soundEnabled} onCheckedChange={onToggleSound} />
          <Label htmlFor="sound">Sound</Label>
        </div>
      </div>
    </div>
  );
});

TimerSettings.displayName = "TimerSettings";

export default TimerSettings;
