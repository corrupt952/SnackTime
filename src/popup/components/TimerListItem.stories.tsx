import type { Meta, StoryObj } from "@storybook/react";
import { action } from "storybook/actions";
import { TimerListItem } from "./TimerListItem";
import { Duration } from "@/domain/timer/value/duration";

const meta: Meta<typeof TimerListItem> = {
  title: "Popup/TimerListItem",
  component: TimerListItem,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <div className="w-64">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const FiveMinutes: Story = {
  args: {
    duration: new Duration(300), // 5 minutes
    onStart: action("onStart"),
  },
};

export const TenMinutes: Story = {
  args: {
    duration: new Duration(600), // 10 minutes
    onStart: action("onStart"),
  },
};

export const ThirtySeconds: Story = {
  args: {
    duration: new Duration(30),
    onStart: action("onStart"),
  },
};

export const OneHour: Story = {
  args: {
    duration: new Duration(3600), // 1 hour
    onStart: action("onStart"),
  },
};

export const TwoHoursThirtyMinutes: Story = {
  args: {
    duration: new Duration(9000), // 2 hours 30 minutes
    onStart: action("onStart"),
  },
};
