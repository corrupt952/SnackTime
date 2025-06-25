import * as React from "react";
import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";
import { type LucideIcon } from "lucide-react";

export interface SettingsSectionProps extends React.HTMLAttributes<HTMLElement> {
  icon?: LucideIcon;
  title: string;
  children: React.ReactNode;
}

const SettingsSection = React.forwardRef<HTMLElement, SettingsSectionProps>(
  ({ className, icon: Icon, title, children, ...props }, ref) => {
    return (
      <section ref={ref} className={cn("rounded-xl border bg-card p-6 shadow-sm", className)} {...props}>
        <div className="mb-4 flex items-center gap-2">
          {Icon && <Icon className="h-5 w-5 text-primary" />}
          <h2 className="text-xl font-bold text-foreground">{title}</h2>
        </div>
        <Separator className="mb-6" />
        {children}
      </section>
    );
  },
);
SettingsSection.displayName = "SettingsSection";

export { SettingsSection };
