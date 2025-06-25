import type { Meta, StoryObj } from "@storybook/react";
import { Switch } from "./switch";
import { Label } from "./label";

const meta: Meta<typeof Switch> = {
  title: "UI/Switch",
  component: Switch,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    checked: { control: "boolean" },
    disabled: { control: "boolean" },
    onCheckedChange: { action: "onCheckedChange" },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const SoundToggle: Story = {
  render: () => (
    <div className="flex items-center space-x-2">
      <Switch id="sound" defaultChecked />
      <Label htmlFor="sound">Sound</Label>
    </div>
  ),
};

export const SoundOff: Story = {
  render: () => (
    <div className="flex items-center space-x-2">
      <Switch id="sound" />
      <Label htmlFor="sound">Sound</Label>
    </div>
  ),
};
