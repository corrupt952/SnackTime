import { TimerPosition } from "@/domain/settings/models/settings";
import { cn } from "@/lib/utils";
import { Coffee } from "lucide-react";

interface TimerPositionSelectorProps {
  value: TimerPosition;
  onChange: (value: TimerPosition) => void;
}

export function TimerPositionSelector({ value, onChange }: TimerPositionSelectorProps) {
  const positions: { id: TimerPosition; className: string }[] = [
    { id: "top-left", className: "top-2 left-2" },
    { id: "top-right", className: "top-2 right-2" },
    { id: "bottom-left", className: "bottom-2 left-2" },
    { id: "bottom-right", className: "bottom-2 right-2" },
    { id: "center", className: "top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" },
  ];

  return (
    <div className="w-full max-w-lg mx-auto">
      {/* Browser-like container */}
      <div className="rounded-lg border bg-muted/30 overflow-hidden">
        {/* Browser header */}
        <div className="flex items-center gap-2 px-3 py-2 bg-muted/50 border-b">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-red-500/50" />
            <div className="w-3 h-3 rounded-full bg-yellow-500/50" />
            <div className="w-3 h-3 rounded-full bg-green-500/50" />
          </div>
          <div className="flex-1 px-3">
            <div className="h-6 bg-background/50 rounded flex items-center px-2 text-xs text-muted-foreground">
              example.com
            </div>
          </div>
        </div>

        {/* Web page content area */}
        <div className="relative bg-background/50 h-64 p-4">
          {/* Dummy content */}
          <div className="space-y-2">
            <div className="h-4 bg-muted/30 rounded w-3/4" />
            <div className="h-3 bg-muted/20 rounded w-full" />
            <div className="h-3 bg-muted/20 rounded w-5/6" />
            <div className="h-3 bg-muted/20 rounded w-4/6" />
          </div>

          {/* Position indicators */}
          {positions.map((position) => (
            <button
              key={position.id}
              id={`position-${position.id}`}
              onClick={() => onChange(position.id)}
              className={cn(
                "absolute rounded-lg transition-all duration-200",
                "hover:scale-110 hover:shadow-lg",
                "focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
                position.className,
              )}
              aria-label={`Position: ${position.id}`}
            >
              {/* Mini timer preview */}
              <div
                className={cn(
                  "px-3 py-2 rounded-lg flex items-center gap-2 text-sm font-medium",
                  value === position.id
                    ? "bg-primary text-primary-foreground shadow-md scale-105"
                    : "bg-background border-2 border-muted hover:border-muted-foreground/50",
                )}
              >
                <Coffee className="h-4 w-4" />
                <span>05:00</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Position label */}
      <p className="text-center mt-3 text-sm text-muted-foreground">
        Click to select timer position:{" "}
        <span className="font-medium text-foreground capitalize">{value.replace("-", " ")}</span>
      </p>
    </div>
  );
}
