import type { Meta, StoryObj } from "@storybook/react";
import { PresetTimerEditor } from "./PresetTimerEditor";
import { useState } from "react";
import { PresetTimer } from "@/domain/settings/models/settings";

const meta = {
  title: "Options/PresetTimerEditor",
  component: PresetTimerEditor,
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
} satisfies Meta<typeof PresetTimerEditor>;

export default meta;
type Story = StoryObj<typeof meta>;

const PresetTimerEditorWrapper = () => {
  const [presets, setPresets] = useState<PresetTimer[]>([
    { minutes: 1 },
    { minutes: 3 },
    { minutes: 5 },
    { minutes: 10 },
  ]);

  return <PresetTimerEditor presets={presets} onChange={setPresets} />;
};

export const Default: Story = {
  render: () => <PresetTimerEditorWrapper />,
};

export const PomodoroPresets: Story = {
  args: {
    presets: [{ minutes: 25 }, { minutes: 5 }, { minutes: 15 }, { minutes: 30 }],
    onChange: (presets) => console.log("Presets changed:", presets),
  },
};

export const StudyPresets: Story = {
  args: {
    presets: [{ minutes: 45 }, { minutes: 10 }, { minutes: 60 }, { minutes: 90 }],
    onChange: (presets) => console.log("Presets changed:", presets),
  },
};

export const ExercisePresets: Story = {
  args: {
    presets: [{ minutes: 1 }, { minutes: 3 }, { minutes: 5 }, { minutes: 10 }],
    onChange: (presets) => console.log("Presets changed:", presets),
  },
};

export const LightTheme: Story = {
  render: () => <PresetTimerEditorWrapper />,
  decorators: [
    (Story) => (
      <div className="w-[600px] p-6 bg-background light">
        <Story />
      </div>
    ),
  ],
};

export const DarkTheme: Story = {
  render: () => <PresetTimerEditorWrapper />,
  decorators: [
    (Story) => (
      <div className="w-[600px] p-6 bg-background dark">
        <Story />
      </div>
    ),
  ],
};
