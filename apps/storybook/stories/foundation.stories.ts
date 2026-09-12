import * as core from "@doctui/core";
import type { Meta, StoryObj } from "@storybook/vue3-vite";
import { h } from "vue";

const meta = {
  title: "Foundation/Workspace resolution",
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const CorePackage: Story = {
  render: () => ({
    setup() {
      return () =>
        h(
          "div",
          { style: "font: 14px/1.5 system-ui; padding: 24px" },
          `@doctui/core resolved successfully (${Object.keys(core).length} public exports).`,
        );
    },
  }),
};
