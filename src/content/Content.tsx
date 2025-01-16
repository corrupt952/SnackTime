import { useState, useEffect, useRef } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import { Play, Pause, RotateCw, Settings, ArrowLeft, Volume2, VolumeX, X } from "lucide-react";

class Alarm {
  private readonly audioContext: AudioContext;

  constructor() {
    this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
  }

  async play() {
    try {
      await this.audioContext.resume();

      Array.from({ length: 3 }).forEach((_, index) => {
        setTimeout(() => {
          const startTime = this.audioContext.currentTime;
          const beepFrequency = 800;

          Array.from({ length: 3 }).forEach((_, beepIndex) => {
            const beep = this.createBeep(beepFrequency, startTime + beepIndex * 0.2);
            if (!beep) return;
            beep.start(startTime + beepIndex * 0.2);
            beep.stop(startTime + beepIndex * 0.2 + 0.1);
          });
        }, index * 1200);
      });
    } catch (error) {
      console.error("Error playing alarm:", error);
    }
  }

  private createBeep(frequency: number, startTime: number) {
    try {
      const oscillator = this.audioContext.createOscillator();
      const gainNode = this.audioContext.createGain();

      oscillator.frequency.value = frequency;
      gainNode.gain.setValueAtTime(0, startTime);
      gainNode.gain.linearRampToValueAtTime(0.1, startTime + 0.01);
      gainNode.gain.linearRampToValueAtTime(0, startTime + 0.1);

      oscillator.connect(gainNode);
      gainNode.connect(this.audioContext.destination);

      return oscillator;
    } catch (error) {
      console.error("Error creating beep:", error);
      return null;
    }
  }
}

const Timer = ({
  initialTime,
  soundEnabled,
  close,
}: {
  initialTime: number;
  soundEnabled: boolean;
  close: () => void;
}) => {
  const [totalSeconds, setTotalSeconds] = useState(initialTime);
  const [isRunning, setIsRunning] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [settings, setSettings] = useState({
    soundEnabled: soundEnabled,
  });

  const timerRef = useRef<number | null>(null);
  const startTimeRef = useRef<number | null>(null);
  const alarmRef = useRef<Alarm | null>(null);

  useEffect(() => {
    alarmRef.current = new Alarm();
    setIsRunning(true);
    return () => {
      if (timerRef.current) {
        window.clearInterval(timerRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (isRunning) {
      startTimeRef.current = Date.now() - (initialTime - totalSeconds) * 1000;
      timerRef.current = window.setInterval(() => {
        const elapsedSeconds = Math.floor((Date.now() - startTimeRef.current!) / 1000);
        const newTotalSeconds = initialTime - elapsedSeconds;

        setTotalSeconds(newTotalSeconds);
        if (newTotalSeconds <= 0) {
          if (settings.soundEnabled && alarmRef.current) {
            alarmRef.current.play();
          }
          setIsRunning(false);
          return;
        }
      }, 100);
    } else if (timerRef.current) {
      window.clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) {
        window.clearInterval(timerRef.current);
      }
    };
  }, [isRunning, settings.soundEnabled, initialTime]);

  const startTimer = () => setIsRunning(true);
  const pauseTimer = () => setIsRunning(false);

  const resetTimer = () => {
    setIsRunning(false);
    setTotalSeconds(initialTime);
    if (timerRef.current) {
      window.clearInterval(timerRef.current);
    }
  };

  const formatTime = (time: number) => {
    const h = String(Math.floor(time / 3600)).padStart(2, "0");
    const m = String(Math.floor(time / 60)).padStart(2, "0");
    const s = String(time % 60).padStart(2, "0");
    if (h === "00") {
      return `${m}:${s}`;
    }
    return `${h}:${m}:${s}`;
  };

  const closeTimer = () => {
    window.clearInterval(timerRef.current!);
    close();
  };

  const TimerFace = () => (
    <div className="flex flex-col items-center justify-center w-full space-y-4">
      <div className="text-6xl font-bold font-mono text-center">
        {totalSeconds <= 0 ? "Time's up!" : formatTime(totalSeconds)}
      </div>

      <div className="flex space-x-6 justify-center">
        <Button
          variant="ghost"
          size="icon"
          onClick={isRunning ? pauseTimer : startTimer}
          className={cn(
            "text-white rounded-full",
            isRunning ? "bg-yellow-500 hover:bg-yellow-600" : "bg-green-500 hover:bg-green-600",
          )}
        >
          {isRunning ? <Pause className="h-12 w-12" /> : <Play className="h-12 w-12" />}
        </Button>
        <Button variant="outline" size="icon" onClick={resetTimer} className="rounded-full">
          <RotateCw className="h-12 w-12" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setSettings((prev) => ({ ...prev, soundEnabled: !prev.soundEnabled }))}
          className={cn("rounded-full", settings.soundEnabled ? "" : "text-red-500")}
        >
          {settings.soundEnabled ? <Volume2 className="h-12 w-12" /> : <VolumeX className="h-12 w-12" />}
        </Button>
        <Button variant="ghost" size="icon" onClick={() => setShowSettings(true)} className="rounded-full">
          <Settings className="h-12 w-12" />
        </Button>
        <Button variant="ghost" size="icon" onClick={closeTimer} className="text-red-500 rounded-full">
          <X size={64} />
        </Button>
      </div>
    </div>
  );

  const SettingsFace = () => (
    <div className="w-full">
      <div className="flex items-center mb-6">
        <Button variant="ghost" size="icon" onClick={() => setShowSettings(false)} className="mr-2">
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h2 className="text-xl font-semibold">Settings</h2>
      </div>

      <div className="space-y-6">
        <div className="flex items-center space-x-2">
          <Switch
            id="sound"
            checked={settings.soundEnabled}
            onCheckedChange={(checked) =>
              setSettings((prev) => ({
                ...prev,
                soundEnabled: checked,
              }))
            }
          />
          <Label htmlFor="sound">Sound</Label>
        </div>
      </div>
    </div>
  );

  return (
    <Card className="flex items-center relative overflow-hidden px-8 py-6 rounded-none">
      <div className={cn(!showSettings ? "block" : "hidden", "transition-all duration-500 ease-in-out")}>
        <TimerFace />
      </div>

      <div className={cn(showSettings ? "block" : "hidden", "transition-all duration-500 ease-in-out")}>
        <SettingsFace />
      </div>
    </Card>
  );
};

export default Timer;
