import { useState, useEffect, useRef } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import {
  Play,
  Pause,
  RotateCw,
  Settings as SettingsIcon,
  ArrowLeft,
  Volume2,
  VolumeX,
  X,
  Maximize,
  Minimize,
} from "lucide-react";
import type { AlarmSound } from "@/domain/settings/models/settings";

class Alarm {
  private readonly audioContext: AudioContext;
  private audioBuffer: AudioBuffer | null = null;
  private currentSource: AudioBufferSourceNode | null = null;
  private readonly gainNode: GainNode;
  private readonly sound: string;
  private readonly volume: number;

  constructor(sound: string, volume: number) {
    this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    this.gainNode = this.audioContext.createGain();
    this.gainNode.connect(this.audioContext.destination);
    this.sound = sound;
    this.volume = volume;
    this.loadSound();
  }

  private async loadSound() {
    try {
      const response = await fetch(chrome.runtime.getURL(`sounds/${this.sound}.wav`));
      const arrayBuffer = await response.arrayBuffer();
      this.audioBuffer = await this.audioContext.decodeAudioData(arrayBuffer);
    } catch (error) {
      console.error("Error loading sound:", error);
    }
  }

  async play() {
    try {
      if (!this.audioBuffer) {
        await this.loadSound();
      }

      await this.audioContext.resume();

      if (this.audioBuffer) {
        this.stop();
        const source = this.audioContext.createBufferSource();
        source.buffer = this.audioBuffer;
        this.gainNode.gain.value = this.volume;
        source.connect(this.gainNode);
        this.currentSource = source;
        source.start();
      }
    } catch (error) {
      console.error("Error playing alarm:", error);
    }
  }

  stop() {
    if (this.currentSource) {
      try {
        this.currentSource.stop();
      } catch (error) {
        console.error("Error stopping sound:", error);
      }
      this.currentSource = null;
    }
  }
}

const Timer = ({
  initialTime,
  soundEnabled,
  alarmSound,
  volume,
  close,
}: {
  initialTime: number;
  soundEnabled: boolean;
  alarmSound: AlarmSound;
  volume: number;
  close: () => void;
}) => {
  const [totalSeconds, setTotalSeconds] = useState(initialTime);
  const [isRunning, setIsRunning] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [settings, setSettings] = useState({
    soundEnabled: soundEnabled,
  });

  const timerRef = useRef<number | null>(null);
  const startTimeRef = useRef<number | null>(null);
  const alarmRef = useRef<Alarm | null>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    alarmRef.current = new Alarm(alarmSound, volume);
    setIsRunning(true);
    return () => {
      if (timerRef.current) {
        window.clearInterval(timerRef.current);
      }
      if (alarmRef.current) {
        alarmRef.current.stop();
      }
    };
  }, [alarmSound, volume]);

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
    if (alarmRef.current) {
      alarmRef.current.stop();
    }
    close();
  };

  const toggleFullscreen = async () => {
    if (!document.fullscreenElement) {
      await cardRef.current?.requestFullscreen();
      setIsFullscreen(true);
    } else {
      await document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, []);

  const TimerFace = () => (
    <div className="flex flex-col items-center justify-center w-full space-y-4">
      <div className={cn("font-bold font-mono text-center", isFullscreen ? "text-[12rem]" : "text-6xl")}>
        {totalSeconds <= 0 ? "Time's up!" : formatTime(totalSeconds)}
      </div>

      <div className={cn("flex space-x-6 justify-center", isFullscreen && "mt-12")}>
        <Button
          variant="ghost"
          size="icon"
          onClick={isRunning ? pauseTimer : startTimer}
          className={cn(
            "text-white rounded-full",
            isRunning ? "bg-yellow-500 hover:bg-yellow-600" : "bg-green-500 hover:bg-green-600",
            isFullscreen && "scale-150",
          )}
        >
          {isRunning ? <Pause className="h-12 w-12" /> : <Play className="h-12 w-12" />}
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={resetTimer}
          className={cn("rounded-full", isFullscreen && "scale-150")}
        >
          <RotateCw className="h-12 w-12" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setSettings((prev) => ({ ...prev, soundEnabled: !prev.soundEnabled }))}
          className={cn("rounded-full", settings.soundEnabled ? "" : "text-red-500", isFullscreen && "scale-150")}
        >
          {settings.soundEnabled ? <Volume2 className="h-12 w-12" /> : <VolumeX className="h-12 w-12" />}
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setShowSettings(true)}
          className={cn("rounded-full", isFullscreen && "scale-150")}
        >
          <SettingsIcon className="h-12 w-12" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleFullscreen}
          className={cn("rounded-full", isFullscreen && "scale-150")}
        >
          {isFullscreen ? <Minimize className="h-12 w-12" /> : <Maximize className="h-12 w-12" />}
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={closeTimer}
          className={cn("text-red-500 rounded-full", isFullscreen && "scale-150")}
        >
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
    <Card
      ref={cardRef}
      className={cn(
        "flex items-center relative overflow-hidden px-8 py-6 rounded-none",
        isFullscreen && "w-screen h-screen justify-center",
      )}
    >
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
