import type { Meta, StoryObj } from "@storybook/react";
import { TimerPositionSelector } from "./TimerPositionSelector";
import { useState } from "react";
import { TimerPosition } from "@/domain/settings/models/settings";

const meta = {
  title: "Options/TimerPositionSelector",
  component: TimerPositionSelector,
  parameters: {
    layout: "centered",
  },
  decorators: [
    (Story) => (
      <div className="w-[600px] p-6 bg-background">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof TimerPositionSelector>;

export default meta;
type Story = StoryObj<typeof meta>;

const TimerPositionSelectorWrapper = ({ initialPosition = "top-right" as TimerPosition }) => {
  const [position, setPosition] = useState<TimerPosition>(initialPosition);

  return <TimerPositionSelector value={position} onChange={setPosition} />;
};

export const Default: Story = {
  render: () => <TimerPositionSelectorWrapper />,
};

export const TopLeft: Story = {
  render: () => <TimerPositionSelectorWrapper initialPosition="top-left" />,
};

export const TopRight: Story = {
  render: () => <TimerPositionSelectorWrapper initialPosition="top-right" />,
};

export const BottomLeft: Story = {
  render: () => <TimerPositionSelectorWrapper initialPosition="bottom-left" />,
};

export const BottomRight: Story = {
  render: () => <TimerPositionSelectorWrapper initialPosition="bottom-right" />,
};

export const Center: Story = {
  render: () => <TimerPositionSelectorWrapper initialPosition="center" />,
};

export const LightTheme: Story = {
  render: () => <TimerPositionSelectorWrapper />,
  decorators: [
    (Story) => (
      <div className="w-[600px] p-6 bg-background light">
        <Story />
      </div>
    ),
  ],
};

export const DarkTheme: Story = {
  render: () => <TimerPositionSelectorWrapper />,
  decorators: [
    (Story) => (
      <div className="w-[600px] p-6 bg-background dark">
        <Story />
      </div>
    ),
  ],
};

export const LemonTheme: Story = {
  render: () => <TimerPositionSelectorWrapper />,
  decorators: [
    (Story) => (
      <div className="w-[600px] p-6 bg-background lemon">
        <Story />
      </div>
    ),
  ],
};

export const MintTheme: Story = {
  render: () => <TimerPositionSelectorWrapper />,
  decorators: [
    (Story) => (
      <div className="w-[600px] p-6 bg-background mint">
        <Story />
      </div>
    ),
  ],
};

export const RoseTheme: Story = {
  render: () => <TimerPositionSelectorWrapper />,
  decorators: [
    (Story) => (
      <div className="w-[600px] p-6 bg-background rose">
        <Story />
      </div>
    ),
  ],
};
