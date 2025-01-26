import { cn } from "@/lib/utils";
import { memo } from "react";
import { Duration } from "@/domain/timer/value/duration";

interface TimerDisplayProps {
  totalSeconds: number;
  isFullscreen: boolean;
}

const TimerDisplay = memo(({ totalSeconds, isFullscreen }: TimerDisplayProps) => {
  const formatTime = (time: number) => {
    const duration = new Duration(time);
    return duration.toFormatted();
  };

  return (
    <div className={cn("font-bold font-mono text-center", isFullscreen ? "text-[12rem]" : "text-6xl")}>
      {totalSeconds <= 0 ? "Time's up!" : formatTime(totalSeconds)}
    </div>
  );
});

TimerDisplay.displayName = "TimerDisplay";

export default TimerDisplay;
