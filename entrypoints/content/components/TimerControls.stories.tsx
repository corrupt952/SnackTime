import type { Meta, StoryObj } from "@storybook/react";
import { action } from "storybook/actions";
import TimerControls from "./TimerControls";

const meta: Meta<typeof TimerControls> = {
  title: "Timer/TimerControls",
  component: TimerControls,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    isRunning: { control: "boolean" },
    isFullscreen: { control: "boolean" },
    soundEnabled: { control: "boolean" },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

const defaultArgs = {
  onStart: action("onStart"),
  onPause: action("onPause"),
  onReset: action("onReset"),
  onToggleSound: action("onToggleSound"),
  onShowSettings: action("onShowSettings"),
  onToggleFullscreen: action("onToggleFullscreen"),
  onClose: action("onClose"),
};

export const Default: Story = {
  args: {
    ...defaultArgs,
    isRunning: false,
    isFullscreen: false,
    soundEnabled: true,
  },
};

export const Running: Story = {
  args: {
    ...defaultArgs,
    isRunning: true,
    isFullscreen: false,
    soundEnabled: true,
  },
};

export const Paused: Story = {
  args: {
    ...defaultArgs,
    isRunning: false,
    isFullscreen: false,
    soundEnabled: true,
  },
};

export const SoundDisabled: Story = {
  args: {
    ...defaultArgs,
    isRunning: false,
    isFullscreen: false,
    soundEnabled: false,
  },
};

export const Fullscreen: Story = {
  args: {
    ...defaultArgs,
    isRunning: true,
    isFullscreen: true,
    soundEnabled: true,
  },
  parameters: {
    layout: "fullscreen",
  },
};

export const FullscreenPaused: Story = {
  args: {
    ...defaultArgs,
    isRunning: false,
    isFullscreen: true,
    soundEnabled: true,
  },
  parameters: {
    layout: "fullscreen",
  },
};

export const FullscreenSoundDisabled: Story = {
  args: {
    ...defaultArgs,
    isRunning: true,
    isFullscreen: true,
    soundEnabled: false,
  },
  parameters: {
    layout: "fullscreen",
  },
};
