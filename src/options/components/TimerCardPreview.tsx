import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { memo } from "react";
import { ColorScheme } from "@/types/enums/ColorScheme";
import TimerControls from "@/content/components/TimerControls";

interface TimerCardPreviewProps {
  className?: string;
  colorScheme?: ColorScheme;
}

const TimerCardPreview = memo(({ className, colorScheme }: TimerCardPreviewProps) => {
  const effectiveTheme =
    colorScheme === ColorScheme.System
      ? window.matchMedia("(prefers-color-scheme: dark)").matches
        ? ColorScheme.Dark
        : ColorScheme.Light
      : colorScheme;

  return (
    <div className={cn("w-full max-w-md mx-auto", className)}>
      <div className="relative rounded-lg overflow-hidden">
        <div className="text-center text-muted-foreground text-sm mb-4">Timer Card Preview</div>

        {/* Background layer simulating a webpage */}
        <div className="relative bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900 p-8 rounded-lg">
          {/* Simulated webpage content */}
          <div className="absolute inset-0 opacity-10">
            <div className="space-y-2 p-8">
              <div className="h-4 bg-current rounded w-3/4"></div>
              <div className="h-4 bg-current rounded w-1/2"></div>
              <div className="h-4 bg-current rounded w-5/6"></div>
              <div className="h-4 bg-current rounded w-2/3"></div>
            </div>
          </div>

          {/* Timer card with shadow to simulate floating */}
          <div className={cn("relative z-10", effectiveTheme)}>
            <Card className="flex items-center relative overflow-hidden px-8 py-6 rounded-none shadow-2xl border-2">
              <div className="flex flex-col items-center justify-center w-full space-y-4">
                <div className="font-bold font-mono text-center text-6xl">15:00</div>

                <div className="pointer-events-none">
                  <TimerControls
                    isRunning={false}
                    isFullscreen={false}
                    soundEnabled={true}
                    onStart={() => {}}
                    onPause={() => {}}
                    onReset={() => {}}
                    onToggleSound={() => {}}
                    onShowSettings={() => {}}
                    onToggleFullscreen={() => {}}
                    onClose={() => {}}
                  />
                </div>
              </div>
            </Card>
          </div>
        </div>

        <div className="text-center text-muted-foreground text-xs mt-4">
          This preview shows how the timer will appear on web pages
        </div>
      </div>
    </div>
  );
});

TimerCardPreview.displayName = "TimerCardPreview";

export default TimerCardPreview;
