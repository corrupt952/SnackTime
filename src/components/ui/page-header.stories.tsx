import type { Meta, StoryObj } from "@storybook/react";
import { PageHeader } from "./page-header";
import { Coffee, Settings, User, Home } from "lucide-react";

const meta: Meta<typeof PageHeader> = {
  title: "UI/PageHeader",
  component: PageHeader,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
  argTypes: {
    icon: {
      control: false,
    },
    showPulse: {
      control: "boolean",
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    title: "Page Title",
  },
};

export const WithSubtitle: Story = {
  args: {
    title: "Settings",
    subtitle: "Manage your preferences",
  },
};

export const WithIcon: Story = {
  args: {
    icon: Settings,
    title: "Settings",
    subtitle: "Manage your preferences",
  },
};

export const WithPulse: Story = {
  args: {
    icon: Coffee,
    title: "Snack Time",
    subtitle: "Timer Extension Settings",
    showPulse: true,
  },
};

export const Examples: Story = {
  render: () => (
    <div className="space-y-8">
      <PageHeader
        icon={Coffee}
        title="Snack Time"
        subtitle="Timer Extension Settings"
        showPulse={true}
      />
      
      <PageHeader
        icon={User}
        title="Profile"
        subtitle="Your account information"
      />
      
      <PageHeader
        icon={Home}
        title="Dashboard"
      />
      
      <PageHeader
        title="Simple Header"
        subtitle="No icon, just text"
      />
    </div>
  ),
};