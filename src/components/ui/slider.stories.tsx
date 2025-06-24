import type { Meta, StoryObj } from '@storybook/react';
import { Slider } from './slider';
import { Label } from './label';

const meta: Meta<typeof Slider> = {
  title: 'UI/Slider',
  component: Slider,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    defaultValue: {
      control: { type: 'array' },
    },
    max: {
      control: { type: 'number' },
    },
    step: {
      control: { type: 'number' },
    },
    disabled: {
      control: { type: 'boolean' },
    },
  },
  decorators: [
    (Story) => (
      <div className="w-[300px]">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const VolumeSlider: Story = {
  render: () => (
    <div className="space-y-2">
      <Label htmlFor="volume" className="text-sm font-medium">
        Volume
      </Label>
      <Slider 
        id="volume"
        defaultValue={[10]} 
        max={100} 
        step={1}
        className="w-full"
      />
    </div>
  ),
};

export const VolumeAt50: Story = {
  render: () => (
    <div className="space-y-2">
      <Label htmlFor="volume" className="text-sm font-medium">
        Volume
      </Label>
      <Slider 
        id="volume"
        defaultValue={[50]} 
        max={100} 
        step={1}
        className="w-full"
      />
    </div>
  ),
};

export const VolumeMuted: Story = {
  render: () => (
    <div className="space-y-2">
      <Label htmlFor="volume" className="text-sm font-medium">
        Volume
      </Label>
      <Slider 
        id="volume"
        defaultValue={[0]} 
        max={100} 
        step={1}
        className="w-full"
      />
    </div>
  ),
};