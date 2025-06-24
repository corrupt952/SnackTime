import type { Meta, StoryObj } from '@storybook/react';
import { Label } from './label';

const meta: Meta<typeof Label> = {
  title: 'UI/Label',
  component: Label,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const FormLabel: Story = {
  args: {
    children: 'Sound',
    htmlFor: 'sound',
  },
};

export const SectionLabel: Story = {
  render: () => (
    <Label className="text-sm font-medium">
      Color Scheme
    </Label>
  ),
};

export const RadioLabel: Story = {
  render: () => (
    <Label htmlFor="system" className="font-normal">
      System
    </Label>
  ),
};