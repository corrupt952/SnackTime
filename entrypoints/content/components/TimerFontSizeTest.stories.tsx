import type { Decorator, Meta, StoryObj } from "@storybook/react";
import { useEffect } from "react";
import { action } from "storybook/actions";
import TimerControls from "./TimerControls";
import TimerDisplay from "./TimerDisplay";

/**
 * Verifies that timer components render at a consistent size
 * regardless of the host page's root font-size.
 *
 * Fix: Tailwind CSS variables (--spacing, --text-6xl) are now overridden
 * with fixed px values in the Shadow DOM. The host element's fontSize is
 * set to "16px" instead of "2rem", and the arbitrary value text-[12rem]
 * was changed to text-[192px].
 *
 * NOTE: View each story individually (not in Docs view) to see the difference,
 * since Docs renders all stories on the same page and only one root font-size can apply.
 *
 * Expected behavior: All stories should now render at the same size.
 */

/**
 * Same CSS variable overrides applied in content/index.tsx for the Shadow DOM.
 * Replicated here so Storybook can verify the fix works.
 */
const remOverrideStyle = {
  "--spacing": "4px",
  "--text-sm": "14px",
  "--text-sm--line-height": "1.43",
  "--text-6xl": "60px",
  "--text-6xl--line-height": "1",
} as React.CSSProperties;

const withRootFontSize = (px: number): Decorator => {
  return (Story) => {
    useEffect(() => {
      const original = document.documentElement.style.fontSize;
      document.documentElement.style.fontSize = `${px}px`;
      return () => {
        document.documentElement.style.fontSize = original;
      };
    }, []);

    return (
      <div>
        <div
          style={{
            marginBottom: 16,
            padding: "8px 12px",
            background: "#f5f5f5",
            borderRadius: 6,
            fontSize: 14,
            fontFamily: "monospace",
            lineHeight: 1.6,
          }}
        >
          <div>
            html font-size: <strong>{px}px</strong>
          </div>
          <div>
            1rem = {px}px | text-6xl (3.75rem) = {3.75 * px}px | h-12 (3rem) = {3 * px}px
          </div>
        </div>
        {/* Apply the same CSS variable overrides that content/index.tsx injects into Shadow DOM */}
        <div style={remOverrideStyle}>
          <Story />
        </div>
      </div>
    );
  };
};

const TimerComposite = () => (
  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
    <TimerDisplay totalSeconds={300} isFullscreen={false} />
    <TimerControls
      isRunning={false}
      isFullscreen={false}
      soundEnabled={true}
      onStart={action("onStart")}
      onPause={action("onPause")}
      onReset={action("onReset")}
      onToggleSound={action("onToggleSound")}
      onToggleFullscreen={action("onToggleFullscreen")}
      onClose={action("onClose")}
    />
  </div>
);

const meta: Meta<typeof TimerComposite> = {
  title: "Timer/FontSizeInheritance",
  component: TimerComposite,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const RootFontSize10px: Story = {
  name: "10px (62.5% reset)",
  decorators: [withRootFontSize(10)],
};

export const RootFontSize12px: Story = {
  name: "12px",
  decorators: [withRootFontSize(12)],
};

export const RootFontSize14px: Story = {
  name: "14px",
  decorators: [withRootFontSize(14)],
};

export const RootFontSize16px: Story = {
  name: "16px (browser default)",
  decorators: [withRootFontSize(16)],
};

export const RootFontSize20px: Story = {
  name: "20px",
  decorators: [withRootFontSize(20)],
};

export const RootFontSize24px: Story = {
  name: "24px",
  decorators: [withRootFontSize(24)],
};
