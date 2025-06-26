import type { Meta, StoryObj } from "@storybook/react";
import { VolumeControl } from "./volume-control";
import { useState } from "react";

const meta: Meta<typeof VolumeControl> = {
  title: "UI/VolumeControl",
  component: VolumeControl,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    value: {
      control: { type: "range", min: 0, max: 1, step: 0.01 },
    },
    disabled: {
      control: "boolean",
    },
    showIcon: {
      control: "boolean",
    },
    showPercentage: {
      control: "boolean",
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => {
    const [volume, setVolume] = useState(0.5);
    return (
      <div className="w-96">
        <VolumeControl value={volume} onValueChange={setVolume} />
      </div>
    );
  },
};

export const Disabled: Story = {
  render: () => {
    const [volume, setVolume] = useState(0.3);
    return (
      <div className="w-96">
        <VolumeControl value={volume} onValueChange={setVolume} disabled />
      </div>
    );
  },
};

export const WithoutIcon: Story = {
  render: () => {
    const [volume, setVolume] = useState(0.7);
    return (
      <div className="w-96">
        <VolumeControl value={volume} onValueChange={setVolume} showIcon={false} />
      </div>
    );
  },
};

export const WithoutPercentage: Story = {
  render: () => {
    const [volume, setVolume] = useState(0.4);
    return (
      <div className="w-96">
        <VolumeControl value={volume} onValueChange={setVolume} showPercentage={false} />
      </div>
    );
  },
};

export const Minimal: Story = {
  render: () => {
    const [volume, setVolume] = useState(0.6);
    return (
      <div className="w-96">
        <VolumeControl value={volume} onValueChange={setVolume} showIcon={false} showPercentage={false} />
      </div>
    );
  },
};

export const InContext: Story = {
  render: () => {
    const [volume, setVolume] = useState(0.1);
    const [isEnabled, setIsEnabled] = useState(true);

    return (
      <div className="w-96 space-y-4">
        <div className="flex items-center justify-between p-4 rounded-lg border bg-muted/10">
          <label className="text-sm font-medium">Enable Sound</label>
          <input
            type="checkbox"
            checked={isEnabled}
            onChange={(e) => setIsEnabled(e.target.checked)}
            className="rounded"
          />
        </div>

        <div className={`space-y-2 transition-opacity duration-300 ${!isEnabled ? "opacity-50" : ""}`}>
          <h3 className="text-base font-semibold">Volume</h3>
          <VolumeControl value={volume} onValueChange={setVolume} disabled={!isEnabled} />
        </div>
      </div>
    );
  },
};
