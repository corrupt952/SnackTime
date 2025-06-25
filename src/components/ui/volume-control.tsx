import * as React from "react";
import { cn } from "@/lib/utils";
import { Slider } from "@/components/ui/slider";
import { Volume2 } from "lucide-react";

export interface VolumeControlProps extends React.HTMLAttributes<HTMLDivElement> {
  value: number;
  onValueChange: (value: number) => void;
  disabled?: boolean;
  showIcon?: boolean;
  showPercentage?: boolean;
}

const VolumeControl = React.forwardRef<HTMLDivElement, VolumeControlProps>(
  ({ className, value, onValueChange, disabled = false, showIcon = true, showPercentage = true, ...props }, ref) => {
    return (
      <div ref={ref} className={cn("rounded-lg bg-muted/10 p-4", className)} {...props}>
        <div className="flex items-center gap-4">
          {showIcon && <Volume2 className="h-4 w-4 flex-shrink-0 text-muted-foreground" />}
          <div className="flex-1">
            <Slider
              value={[value * 100]}
              onValueChange={(values) => onValueChange(values[0] / 100)}
              max={100}
              step={1}
              disabled={disabled}
              className="[&_[role=slider]]:transition-all [&_[role=slider]]:duration-200 [&_[role=slider]:hover]:scale-110"
            />
          </div>
          {showPercentage && (
            <div className="min-w-[3rem] text-right font-mono text-sm font-medium">{Math.round(value * 100)}%</div>
          )}
        </div>
      </div>
    );
  },
);
VolumeControl.displayName = "VolumeControl";

export { VolumeControl };
