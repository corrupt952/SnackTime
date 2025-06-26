import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Maximize, Minimize, Pause, Play, RotateCw, Settings as SettingsIcon, Volume2, VolumeX, X } from "lucide-react";
import { memo } from "react";

interface TimerControlsProps {
  isRunning: boolean;
  isFullscreen: boolean;
  soundEnabled: boolean;
  onStart: () => void;
  onPause: () => void;
  onReset: () => void;
  onToggleSound: () => void;
  onShowSettings: () => void;
  onToggleFullscreen: () => void;
  onClose: () => void;
}

const TimerControls = memo(
  ({
    isRunning,
    isFullscreen,
    soundEnabled,
    onStart,
    onPause,
    onReset,
    onToggleSound,
    onShowSettings,
    onToggleFullscreen,
    onClose,
  }: TimerControlsProps) => {
    return (
      <div className={cn("flex space-x-6 justify-center", isFullscreen && "mt-12")}>
        <Button
          variant="ghost"
          size="icon"
          onClick={isRunning ? onPause : onStart}
          className={cn(
            "rounded-full",
            isRunning ? "bg-accent hover:bg-accent/90 text-accent-foreground" : "bg-primary hover:bg-primary/90 text-primary-foreground",
            isFullscreen && "scale-150",
          )}
        >
          {isRunning ? <Pause className="h-12 w-12" /> : <Play className="h-12 w-12" />}
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={onReset}
          className={cn("rounded-full", isFullscreen && "scale-150")}
        >
          <RotateCw className="h-12 w-12" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={onToggleSound}
          className={cn("rounded-full", soundEnabled ? "" : "text-destructive", isFullscreen && "scale-150")}
        >
          {soundEnabled ? <Volume2 className="h-12 w-12" /> : <VolumeX className="h-12 w-12" />}
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={onShowSettings}
          className={cn("rounded-full", isFullscreen && "scale-150")}
        >
          <SettingsIcon className="h-12 w-12" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={onToggleFullscreen}
          className={cn("rounded-full", isFullscreen && "scale-150")}
        >
          {isFullscreen ? <Minimize className="h-12 w-12" /> : <Maximize className="h-12 w-12" />}
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
          className={cn("text-destructive rounded-full", isFullscreen && "scale-150")}
        >
          <X size={64} />
        </Button>
      </div>
    );
  },
);

TimerControls.displayName = "TimerControls";

export default TimerControls;
