import * as React from "react";
import { cn } from "@/lib/utils";
import { RadioGroupItem } from "@/components/ui/radio-group";
import { type LucideIcon } from "lucide-react";

export interface RadioCardProps extends React.HTMLAttributes<HTMLLabelElement> {
  value: string;
  title: string;
  description?: string;
  icon?: LucideIcon;
  isSelected?: boolean;
}

const RadioCard = React.forwardRef<HTMLLabelElement, RadioCardProps>(
  ({ className, value, title, description, icon: Icon, isSelected, id, ...props }, ref) => {
    const radioId = id || `radio-card-${value}`;
    
    return (
      <label
        ref={ref}
        htmlFor={radioId}
        className={cn(
          "relative flex cursor-pointer rounded-lg border bg-background p-4 transition-all duration-200 hover:bg-accent/50 hover:shadow-md",
          className
        )}
        {...props}
      >
        <RadioGroupItem value={value} id={radioId} className="sr-only" />
        <div className="flex w-full items-center gap-3">
          {Icon && (
            <div className="flex h-10 w-10 items-center justify-center rounded-md bg-primary/10 text-primary">
              <Icon className="h-4 w-4" />
            </div>
          )}
          <div className="flex-1">
            <p className="font-medium">{title}</p>
            {description && (
              <p className="text-xs text-muted-foreground">{description}</p>
            )}
          </div>
          {isSelected && (
            <div className="absolute right-2 top-2 h-2 w-2 rounded-full bg-primary" />
          )}
        </div>
      </label>
    );
  }
);
RadioCard.displayName = "RadioCard";

export { RadioCard };