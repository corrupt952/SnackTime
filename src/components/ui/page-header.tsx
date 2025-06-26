import * as React from "react";
import { cn } from "@/lib/utils";
import { type LucideIcon } from "lucide-react";

export interface PageHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  icon?: LucideIcon;
  title: string;
  subtitle?: string;
  showPulse?: boolean;
}

const PageHeader = React.forwardRef<HTMLDivElement, PageHeaderProps>(
  ({ className, icon: Icon, title, subtitle, showPulse = false, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "flex h-16 w-full items-center bg-gradient-to-r from-primary to-primary/80 px-6 text-primary-foreground shadow-lg",
          className,
        )}
        {...props}
      >
        <div className="flex items-center gap-3">
          {Icon && (
            <div className="relative">
              <Icon className="h-9 w-9" />
              {showPulse && (
                <div className="absolute -bottom-1 -right-1 h-3 w-3 animate-pulse rounded-full bg-accent" />
              )}
            </div>
          )}
          <div>
            <h1 className="text-xl font-bold">{title}</h1>
            {subtitle && <p className="text-xs opacity-90">{subtitle}</p>}
          </div>
        </div>
      </div>
    );
  },
);
PageHeader.displayName = "PageHeader";

export { PageHeader };
