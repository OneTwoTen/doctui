import "@doctui/core/styles.css";
import { DOCTUI_COMPONENT_CATEGORIES } from "@doctui/core";
import type { Preview } from "@storybook/vue3-vite";

const storyOrder = [
  "Foundation",
  ...DOCTUI_COMPONENT_CATEGORIES.map(({ label }) => label),
  "Recipes",
];

const preview: Preview = {
  parameters: {
    controls: {
      expanded: true,
    },
    options: {
      storySort: {
        order: storyOrder,
      },
    },
  },
};

export default preview;
