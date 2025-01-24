import * as React from "react";
import { Input } from "./input";
import { cn } from "@/lib/utils";

export interface TimeInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  onTimeChange?: (time: string) => void;
}

const TimeInput = React.forwardRef<HTMLInputElement, TimeInputProps>(({ className, onTimeChange, ...props }, ref) => {
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;

    if (value === "" || timeRegex.test(value)) {
      onTimeChange?.(value);
    }
  };

  return <Input type="time" className={cn("w-full", className)} onChange={handleChange} ref={ref} {...props} />;
});

TimeInput.displayName = "TimeInput";

export { TimeInput };
