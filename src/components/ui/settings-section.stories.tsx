import type { Meta, StoryObj } from "@storybook/react";
import { SettingsSection } from "./settings-section";
import { Settings2, Palette, Bell } from "lucide-react";
import { Button } from "./button";

const meta: Meta<typeof SettingsSection> = {
  title: "UI/SettingsSection",
  component: SettingsSection,
  parameters: {
    layout: "padded",
  },
  tags: ["autodocs"],
  argTypes: {
    icon: {
      control: false,
    },
    title: {
      control: "text",
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    title: "General Settings",
    children: (
      <div className="space-y-4">
        <p className="text-sm text-muted-foreground">Configure your general application settings here.</p>
        <div className="flex gap-2">
          <Button>Save Changes</Button>
          <Button variant="outline">Cancel</Button>
        </div>
      </div>
    ),
  },
};

export const WithIcon: Story = {
  args: {
    icon: Settings2,
    title: "General Settings",
    children: (
      <div className="space-y-4">
        <p className="text-sm text-muted-foreground">Configure your general application settings here.</p>
      </div>
    ),
  },
};

export const MultipleExamples: Story = {
  render: () => (
    <div className="space-y-6">
      <SettingsSection icon={Settings2} title="General Settings">
        <div className="rounded-lg bg-muted/50 p-4 border border-dashed">
          <p className="text-sm text-muted-foreground">More settings coming soon...</p>
        </div>
      </SettingsSection>

      <SettingsSection icon={Palette} title="Appearance">
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">Customize the appearance of your application.</p>
          <div className="grid grid-cols-3 gap-2">
            <div className="h-20 rounded bg-primary/20" />
            <div className="h-20 rounded bg-secondary/20" />
            <div className="h-20 rounded bg-accent/20" />
          </div>
        </div>
      </SettingsSection>

      <SettingsSection icon={Bell} title="Notifications">
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">Manage your notification preferences.</p>
          <div className="space-y-2">
            <label className="flex items-center gap-2">
              <input type="checkbox" className="rounded" />
              <span className="text-sm">Enable notifications</span>
            </label>
            <label className="flex items-center gap-2">
              <input type="checkbox" className="rounded" />
              <span className="text-sm">Play sound</span>
            </label>
          </div>
        </div>
      </SettingsSection>
    </div>
  ),
};
