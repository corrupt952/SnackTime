import { Card } from "@/components/ui/card";
import type { AlarmSound } from "@/domain/settings/models/settings";
import { cn } from "@/lib/utils";
import { useCallback, useEffect, useRef, useState } from "react";
import TimerControls from "./components/TimerControls";
import TimerDisplay from "./components/TimerDisplay";

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
  soundEnabled: initialSoundEnabled,
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
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(initialSoundEnabled);

  const timerRef = useRef<number | null>(null);
  const startTimeRef = useRef<number | null>(null);
  const lastUpdateTimeRef = useRef<number | null>(null);
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
      if (startTimeRef.current === null) {
        startTimeRef.current = Date.now();
        lastUpdateTimeRef.current = startTimeRef.current;
      } else if (lastUpdateTimeRef.current !== null) {
        const pausedDuration = Date.now() - lastUpdateTimeRef.current;
        startTimeRef.current += pausedDuration;
      }

      timerRef.current = window.setInterval(() => {
        const now = Date.now();
        lastUpdateTimeRef.current = now;

        const elapsedSeconds = Math.floor((now - startTimeRef.current!) / 1000);
        const newTotalSeconds = initialTime - elapsedSeconds;

        if (newTotalSeconds <= 0) {
          setTotalSeconds(0);
          setIsRunning(false);
          if (soundEnabled && alarmRef.current) {
            alarmRef.current.play();
          }
          if (timerRef.current) {
            window.clearInterval(timerRef.current);
          }
          return;
        }

        setTotalSeconds(newTotalSeconds);
      }, 50);
    } else {
      if (timerRef.current) {
        window.clearInterval(timerRef.current);
      }
    }

    return () => {
      if (timerRef.current) {
        window.clearInterval(timerRef.current);
      }
    };
  }, [isRunning, soundEnabled, initialTime]);

  const startTimer = useCallback(() => {
    if (!isRunning) {
      if (totalSeconds === initialTime) {
        startTimeRef.current = null;
      }
      setIsRunning(true);
    }
  }, [isRunning, totalSeconds, initialTime]);

  const pauseTimer = useCallback(() => {
    setIsRunning(false);
  }, []);

  const resetTimer = useCallback(() => {
    setIsRunning(false);
    setTotalSeconds(initialTime);
    startTimeRef.current = null;
    lastUpdateTimeRef.current = null;
    if (timerRef.current) {
      window.clearInterval(timerRef.current);
    }
  }, [initialTime]);

  const closeTimer = useCallback(() => {
    window.clearInterval(timerRef.current!);
    if (alarmRef.current) {
      alarmRef.current.stop();
    }
    close();
  }, [close]);

  const toggleFullscreen = useCallback(async () => {
    if (!document.fullscreenElement) {
      await cardRef.current?.requestFullscreen();
      setIsFullscreen(true);
    } else {
      await document.exitFullscreen();
      setIsFullscreen(false);
    }
  }, []);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, []);

  return (
    <Card
      ref={cardRef}
      className={cn(
        "flex items-center relative overflow-hidden px-8 py-6 border-2 bg-background",
        isFullscreen && "w-screen h-screen justify-center",
      )}
    >
      <div className="flex flex-col items-center justify-center w-full space-y-4">
        <TimerDisplay totalSeconds={totalSeconds} isFullscreen={isFullscreen} />
        <TimerControls
          isRunning={isRunning}
          isFullscreen={isFullscreen}
          soundEnabled={soundEnabled}
          onStart={startTimer}
          onPause={pauseTimer}
          onReset={resetTimer}
          onToggleSound={() => setSoundEnabled((prev) => !prev)}
          onToggleFullscreen={toggleFullscreen}
          onClose={closeTimer}
        />
      </div>
    </Card>
  );
};

export default Timer;
