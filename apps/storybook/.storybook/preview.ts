import "@doctui/core/styles.css";
import type { Preview } from "@storybook/vue3-vite";

const preview: Preview = {
  parameters: {
    controls: {
      expanded: true,
    },
    options: {
      storySort: {
        order: [
          "Foundation",
          "Layout",
          "Typography",
          "Actions",
          "Inputs",
          "Navigation",
          "Data display",
          "Feedback",
          "Overlays",
          "Media",
          "Utilities",
          "Recipes",
        ],
      },
    },
  },
};

export default preview;
