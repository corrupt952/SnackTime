import type { Meta, StoryObj } from '@storybook/react';
import { RadioGroup, RadioGroupItem } from './radio-group';
import { Label } from './label';

const meta: Meta<typeof RadioGroup> = {
  title: 'UI/RadioGroup',
  component: RadioGroup,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const ColorScheme: Story = {
  render: () => (
    <div className="space-y-2">
      <Label className="text-sm font-medium">Color Scheme</Label>
      <RadioGroup defaultValue="system" className="grid gap-2">
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="system" id="system" />
          <Label htmlFor="system" className="font-normal">System</Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="light" id="light" />
          <Label htmlFor="light" className="font-normal">Light</Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="dark" id="dark" />
          <Label htmlFor="dark" className="font-normal">Dark</Label>
        </div>
      </RadioGroup>
    </div>
  ),
};

export const NotificationType: Story = {
  render: () => (
    <div className="space-y-2">
      <Label className="text-sm font-medium">Notification Type</Label>
      <RadioGroup defaultValue="alarm" className="grid gap-2">
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="alarm" id="alarm" />
          <Label htmlFor="alarm" className="font-normal">Alarm</Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="notification" id="notification" />
          <Label htmlFor="notification" className="font-normal">Notification</Label>
        </div>
      </RadioGroup>
    </div>
  ),
};

export const AlarmSound: Story = {
  render: () => (
    <div className="space-y-2">
      <Label className="text-sm font-medium">Alarm Sound</Label>
      <RadioGroup defaultValue="Simple" className="grid gap-2">
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="Simple" id="simple" />
          <Label htmlFor="simple" className="font-normal">Simple</Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="Piano" id="piano" />
          <Label htmlFor="piano" className="font-normal">Piano</Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="Vibraphone" id="vibraphone" />
          <Label htmlFor="vibraphone" className="font-normal">Vibraphone</Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="SteelDrums" id="steeldrums" />
          <Label htmlFor="steeldrums" className="font-normal">Steel Drums</Label>
        </div>
      </RadioGroup>
    </div>
  ),
};