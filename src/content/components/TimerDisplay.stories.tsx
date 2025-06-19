import type { Meta, StoryObj } from '@storybook/react';
import TimerDisplay from './TimerDisplay';

const meta: Meta<typeof TimerDisplay> = {
  title: 'Timer/TimerDisplay',
  component: TimerDisplay,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    totalSeconds: {
      control: { type: 'number', min: 0, max: 3600 },
    },
    isFullscreen: {
      control: { type: 'boolean' },
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    totalSeconds: 300, // 5 minutes
    isFullscreen: false,
  },
};

export const OneMinute: Story = {
  args: {
    totalSeconds: 60,
    isFullscreen: false,
  },
};

export const ThirtySeconds: Story = {
  args: {
    totalSeconds: 30,
    isFullscreen: false,
  },
};

export const TimeUp: Story = {
  args: {
    totalSeconds: 0,
    isFullscreen: false,
  },
};

export const Fullscreen: Story = {
  args: {
    totalSeconds: 300,
    isFullscreen: true,
  },
  parameters: {
    layout: 'fullscreen',
  },
};

export const FullscreenTimeUp: Story = {
  args: {
    totalSeconds: 0,
    isFullscreen: true,
  },
  parameters: {
    layout: 'fullscreen',
  },
};

export const OneHour: Story = {
  args: {
    totalSeconds: 3600, // 1 hour
    isFullscreen: false,
  },
};

export const TwoHoursThirtyMinutes: Story = {
  args: {
    totalSeconds: 9000, // 2 hours 30 minutes
    isFullscreen: false,
  },
};