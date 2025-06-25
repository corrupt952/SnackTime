import type { Meta, StoryObj } from "@storybook/react";
import { action } from "storybook/actions";
import TimerSettings from "./TimerSettings";

const meta: Meta<typeof TimerSettings> = {
  title: "Timer/TimerSettings",
  component: TimerSettings,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <div className="w-[300px] p-4 border rounded-lg">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    soundEnabled: true,
    onToggleSound: action("onToggleSound"),
    onBack: action("onBack"),
  },
};

export const SoundDisabled: Story = {
  args: {
    soundEnabled: false,
    onToggleSound: action("onToggleSound"),
    onBack: action("onBack"),
  },
};
