import type { Meta, StoryObj } from "@storybook/react";
import { SidebarNavigation } from "./sidebar-navigation";
import { Settings2, Palette, Bell, User, Shield, CreditCard } from "lucide-react";

const meta: Meta<typeof SidebarNavigation> = {
  title: "UI/SidebarNavigation",
  component: SidebarNavigation,
  parameters: {
    layout: "padded",
  },
  tags: ["autodocs"],
  argTypes: {
    activeItem: {
      control: "select",
      options: ["#general", "#appearance", "#notification", undefined],
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    items: [
      { href: "#general", label: "General", icon: Settings2 },
      { href: "#appearance", label: "Appearance", icon: Palette },
      { href: "#notification", label: "Notification", icon: Bell },
    ],
  },
};

export const WithActiveItem: Story = {
  args: {
    items: [
      { href: "#general", label: "General", icon: Settings2 },
      { href: "#appearance", label: "Appearance", icon: Palette },
      { href: "#notification", label: "Notification", icon: Bell },
    ],
    activeItem: "#appearance",
  },
};

export const ExtendedNavigation: Story = {
  args: {
    items: [
      { href: "#profile", label: "Profile", icon: User },
      { href: "#general", label: "General", icon: Settings2 },
      { href: "#appearance", label: "Appearance", icon: Palette },
      { href: "#notification", label: "Notification", icon: Bell },
      { href: "#security", label: "Security", icon: Shield },
      { href: "#billing", label: "Billing", icon: CreditCard },
    ],
    activeItem: "#notification",
  },
};

export const InLayout: Story = {
  render: () => (
    <div className="grid gap-6 lg:grid-cols-4">
      <aside className="lg:col-span-1">
        <SidebarNavigation
          items={[
            { href: "#general", label: "General", icon: Settings2 },
            { href: "#appearance", label: "Appearance", icon: Palette },
            { href: "#notification", label: "Notification", icon: Bell },
          ]}
          activeItem="#general"
        />
      </aside>
      <main className="lg:col-span-3">
        <div className="rounded-xl border bg-card p-6 shadow-sm">
          <h2 className="text-xl font-bold mb-4">Main Content Area</h2>
          <p className="text-muted-foreground">
            This shows how the sidebar navigation looks in a typical layout with main content.
          </p>
        </div>
      </main>
    </div>
  ),
};