import { useState, useEffect, useRef } from "react";
import { Paper, Typography, IconButton, Stack, Switch, FormControlLabel, Grow, Box } from "@mui/material";
import { PlayArrow, Pause, Refresh, Settings, ArrowBack, VolumeUp, VolumeOff, Close } from "@mui/icons-material";

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
    <Stack spacing={2} justifyContent="center" sx={{ width: "100%" }}>
      <Typography
        variant="h2"
        component="div"
        align="center"
        sx={{
          fontWeight: "bold",
          fontFamily: "monospace",
        }}
      >
        {totalSeconds <= 0 ? "Time's up!" : formatTime(totalSeconds)}
      </Typography>

      <Stack direction="row" spacing={2} justifyContent="center">
        <IconButton
          onClick={isRunning ? pauseTimer : startTimer}
          color="primary"
          sx={{
            backgroundColor: isRunning ? "warning.main" : "success.main",
            color: "white",
            "&:hover": {
              backgroundColor: isRunning ? "warning.dark" : "success.dark",
            },
          }}
        >
          {isRunning ? <Pause /> : <PlayArrow />}
        </IconButton>
        <IconButton
          onClick={resetTimer}
          color="primary"
          sx={{
            border: "1px solid",
            borderColor: "primary.main",
          }}
        >
          <Refresh />
        </IconButton>
        <IconButton
          onClick={() => setSettings((prev) => ({ ...prev, soundEnabled: !prev.soundEnabled }))}
          sx={{
            color: settings.soundEnabled ? "inherit" : "error.main",
          }}
        >
          {settings.soundEnabled ? <VolumeUp /> : <VolumeOff />}
        </IconButton>
        <IconButton onClick={() => setShowSettings(true)}>
          <Settings />
        </IconButton>
        <IconButton
          sx={{
            color: "error.main",
          }}
          onClick={closeTimer}
          color="primary"
        >
          <Close />
        </IconButton>
      </Stack>
    </Stack>
  );

  const SettingsFace = () => (
    <Box sx={{ width: "100%" }}>
      <Stack direction="row" alignItems="center" sx={{ mb: 3 }}>
        <IconButton onClick={() => setShowSettings(false)} edge="start" sx={{ mr: 2 }}>
          <ArrowBack />
        </IconButton>
        <Typography variant="h6">Settings</Typography>
      </Stack>

      <Stack spacing={3}>
        <FormControlLabel
          control={
            <Switch
              checked={settings.soundEnabled}
              onChange={(e) =>
                setSettings((prev) => ({
                  ...prev,
                  soundEnabled: e.target.checked,
                }))
              }
            />
          }
          label="Sound"
        />
      </Stack>
    </Box>
  );

  return (
    <Paper
      elevation={3}
      sx={{
        display: "flex",
        alignItems: "center",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <Grow in={!showSettings} timeout={500} style={{ transformOrigin: "0 0 0" }}>
        <Box
          sx={{
            p: 2,
            px: 4,
            display: !showSettings ? "block" : "none",
          }}
        >
          <TimerFace />
        </Box>
      </Grow>

      <Grow in={showSettings} timeout={500} style={{ transformOrigin: "0 0 0" }}>
        <Box
          sx={{
            p: 4,
            px: 8,
            display: showSettings ? "block" : "none",
          }}
        >
          <SettingsFace />
        </Box>
      </Grow>
    </Paper>
  );
};

export default Timer;
