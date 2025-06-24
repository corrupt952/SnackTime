import type { Preview } from '@storybook/react-vite'
import "../src/styles/globals.css";
import "./chrome-mock";

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
       color: /(background|color)$/i,
       date: /Date$/i,
      },
    },
  },
};

export default preview;