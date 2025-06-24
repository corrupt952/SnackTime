import type { Meta, StoryObj } from '@storybook/react';
import TimerCardPreview from './TimerCardPreview';
import { ColorScheme } from '@/types/enums/ColorScheme';

const meta: Meta<typeof TimerCardPreview> = {
  title: 'Options/TimerCardPreview',
  component: TimerCardPreview,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  decorators: [
    (Story, context) => {
      // Apply theme based on the story
      const theme = context.args.theme || ColorScheme.Light;
      document.documentElement.classList.remove(...Object.values(ColorScheme));
      document.documentElement.classList.add(theme);
      
      return (
        <div className="w-full min-w-[500px] p-8">
          <Story />
        </div>
      );
    },
  ],
  argTypes: {
    className: {
      control: { type: 'text' },
    },
    theme: {
      control: { type: 'select' },
      options: Object.values(ColorScheme),
      description: 'Theme for preview (not a component prop, just for Storybook)',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    theme: ColorScheme.Light,
  },
};

export const DarkTheme: Story = {
  args: {
    theme: ColorScheme.Dark,
  },
  parameters: {
    backgrounds: { default: 'dark' },
  },
};

export const LemonTheme: Story = {
  args: {
    theme: ColorScheme.Lemon,
  },
};

export const MintTheme: Story = {
  args: {
    theme: ColorScheme.Mint,
  },
};

export const RoseTheme: Story = {
  args: {
    theme: ColorScheme.Rose,
  },
};

export const WithCustomClass: Story = {
  args: {
    className: 'scale-75',
    theme: ColorScheme.Light,
  },
};