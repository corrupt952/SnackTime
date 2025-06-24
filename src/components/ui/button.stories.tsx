import type { Meta, StoryObj } from '@storybook/react';
import { Button } from './button';
import { X } from 'lucide-react';

const meta: Meta<typeof Button> = {
  title: 'UI/Button',
  component: Button,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: ['default', 'destructive', 'outline-solid', 'secondary', 'ghost', 'link'],
    },
    size: {
      control: { type: 'select' },
      options: ['default', 'sm', 'lg', 'icon'],
    },
    asChild: { control: 'boolean' },
    disabled: { control: 'boolean' },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: 'Button',
  },
};

export const Ghost: Story = {
  args: {
    variant: 'ghost',
    children: 'Ghost',
  },
};

export const Outline: Story = {
  args: {
    variant: 'outline-solid',
    children: 'Cancel',
  },
};

export const IconButton: Story = {
  args: {
    variant: 'ghost',
    size: 'icon',
    children: <X className="h-4 w-4" />,
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
    children: 'Start Timer',
  },
};

export const FullWidthGhost: Story = {
  args: {
    variant: 'ghost',
    className: 'w-full justify-end',
    children: '5:00',
  },
};