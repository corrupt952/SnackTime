import type { Meta, StoryObj } from "@storybook/react";
import { TimerPositionSelector } from "./TimerPositionSelector";
import { useState } from "react";
import type { TimerPosition } from "@/domain/settings/models/settings";

const meta: Meta<typeof TimerPositionSelector> = {
  title: "Options/TimerPositionSelector",
  component: TimerPositionSelector,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <div className="w-full max-w-4xl p-8">
        <Story />
      </div>
    ),
  ],
  argTypes: {
    value: {
      control: { type: "select" },
      options: ["top-left", "top-right", "bottom-left", "bottom-right", "center"],
      description: "Currently selected timer position",
    },
    onChange: {
      action: "onChange",
      description: "Callback when position is changed",
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

// Interactive story with state management
const InteractiveTemplate = () => {
  const [position, setPosition] = useState<TimerPosition>("top-right");

  return (
    <div>
      <h3 className="text-lg font-semibold mb-4">Interactive Timer Position Selector</h3>
      <TimerPositionSelector value={position} onChange={setPosition} />
      <div className="mt-4 p-4 bg-muted rounded-lg">
        <p className="text-sm text-muted-foreground">
          Current selection: <span className="font-medium text-foreground">{position}</span>
        </p>
      </div>
    </div>
  );
};

export const Default: Story = {
  args: {
    value: "top-right",
  },
};

export const TopLeft: Story = {
  args: {
    value: "top-left",
  },
};

export const TopRight: Story = {
  args: {
    value: "top-right",
  },
};

export const BottomLeft: Story = {
  args: {
    value: "bottom-left",
  },
};

export const BottomRight: Story = {
  args: {
    value: "bottom-right",
  },
};

export const Center: Story = {
  args: {
    value: "center",
  },
};

export const Interactive: Story = {
  render: () => <InteractiveTemplate />,
  parameters: {
    docs: {
      description: {
        story: "Interactive example showing position selection with state management",
      },
    },
  },
};

export const InDarkMode: Story = {
  args: {
    value: "top-right",
  },
  parameters: {
    backgrounds: { default: "dark" },
  },
  decorators: [
    (Story) => {
      document.documentElement.classList.add("dark");
      return (
        <div className="w-full max-w-4xl p-8">
          <Story />
        </div>
      );
    },
  ],
};

export const WithDescription: Story = {
  args: {
    value: "center",
  },
  decorators: [
    (Story) => (
      <div className="w-full max-w-4xl p-8">
        <div className="space-y-4">
          <div>
            <h3 className="text-base font-semibold text-foreground mb-2">Timer Position</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Choose where the timer appears on web pages. You can still drag it to any position after it appears.
            </p>
          </div>
          <Story />
        </div>
      </div>
    ),
  ],
};
