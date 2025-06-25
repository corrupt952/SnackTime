import * as React from "react";
import { cn } from "@/lib/utils";
import { type LucideIcon } from "lucide-react";

export interface SidebarNavigationItem {
  href: string;
  label: string;
  icon: LucideIcon;
}

export interface SidebarNavigationProps extends React.HTMLAttributes<HTMLElement> {
  items: SidebarNavigationItem[];
  activeItem?: string;
}

const SidebarNavigation = React.forwardRef<HTMLElement, SidebarNavigationProps>(
  ({ className, items, activeItem, ...props }, ref) => {
    return (
      <nav
        ref={ref}
        className={cn(
          "sticky top-8 space-y-1 rounded-lg border bg-card p-4 shadow-sm",
          className
        )}
        {...props}
      >
        {items.map((item) => (
          <a
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground",
              activeItem === item.href && "bg-accent text-accent-foreground"
            )}
          >
            <item.icon className="h-4 w-4" />
            {item.label}
          </a>
        ))}
      </nav>
    );
  }
);
SidebarNavigation.displayName = "SidebarNavigation";

export { SidebarNavigation };