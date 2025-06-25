import type { Meta, StoryObj } from "@storybook/react";
import { RadioCard } from "./radio-card";
import { RadioGroup } from "./radio-group";
import { Sun, Moon, Monitor, Bell, BellOff, Volume2 } from "lucide-react";
import { useState } from "react";

const meta: Meta<typeof RadioCard> = {
  title: "UI/RadioCard",
  component: RadioCard,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    icon: {
      control: false,
    },
    isSelected: {
      control: "boolean",
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    value: "option1",
    title: "Option 1",
    description: "This is the first option",
  },
};

export const WithIcon: Story = {
  args: {
    value: "light",
    title: "Light",
    description: "Always light theme",
    icon: Sun,
  },
};

export const Selected: Story = {
  args: {
    value: "dark",
    title: "Dark",
    description: "Always dark theme",
    icon: Moon,
    isSelected: true,
  },
};

export const InRadioGroup: Story = {
  render: () => {
    const [value, setValue] = useState("light");

    return (
      <RadioGroup value={value} onValueChange={setValue} className="grid grid-cols-1 gap-3 w-80">
        <RadioCard
          value="light"
          title="Light"
          description="Always light theme"
          icon={Sun}
          isSelected={value === "light"}
        />
        <RadioCard
          value="dark"
          title="Dark"
          description="Always dark theme"
          icon={Moon}
          isSelected={value === "dark"}
        />
        <RadioCard
          value="system"
          title="System"
          description="Match system preference"
          icon={Monitor}
          isSelected={value === "system"}
        />
      </RadioGroup>
    );
  },
};

export const MultiColumnLayout: Story = {
  render: () => {
    const [colorScheme, setColorScheme] = useState("system");
    const [notification, setNotification] = useState("alarm");

    return (
      <div className="space-y-8 w-full max-w-2xl">
        <div>
          <h3 className="text-base font-semibold mb-4">Color Scheme</h3>
          <RadioGroup
            value={colorScheme}
            onValueChange={setColorScheme}
            className="grid grid-cols-3 gap-3"
          >
            <RadioCard
              value="light"
              title="Light"
              description="Always light"
              icon={Sun}
              isSelected={colorScheme === "light"}
            />
            <RadioCard
              value="dark"
              title="Dark"
              description="Always dark"
              icon={Moon}
              isSelected={colorScheme === "dark"}
            />
            <RadioCard
              value="system"
              title="System"
              description="Auto"
              icon={Monitor}
              isSelected={colorScheme === "system"}
            />
          </RadioGroup>
        </div>

        <div>
          <h3 className="text-base font-semibold mb-4">Notification Type</h3>
          <RadioGroup
            value={notification}
            onValueChange={setNotification}
            className="grid grid-cols-2 gap-3"
          >
            <RadioCard
              value="alarm"
              title="Alarm"
              description="Play sound notification"
              icon={Bell}
              isSelected={notification === "alarm"}
            />
            <RadioCard
              value="none"
              title="None"
              description="Silent mode"
              icon={BellOff}
              isSelected={notification === "none"}
            />
          </RadioGroup>
        </div>
      </div>
    );
  },
};

export const CompactVariant: Story = {
  render: () => {
    const [sound, setSound] = useState("Simple");

    return (
      <RadioGroup value={sound} onValueChange={setSound} className="grid grid-cols-2 gap-3 w-96">
        {["Simple", "Piano", "Vibraphone", "SteelDrums"].map((value) => (
          <RadioCard
            key={value}
            value={value}
            title={value}
            icon={Volume2}
            isSelected={sound === value}
            className="p-3"
          />
        ))}
      </RadioGroup>
    );
  },
};