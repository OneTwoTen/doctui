import { Box, getComponentStorybookTitle, Stack } from "@doctui/core";
import type { Meta, StoryObj } from "@storybook/vue3-vite";
import { h } from "vue";
import { preview } from "./story-helpers";

const meta = {
  title: getComponentStorybookTitle("Stack"),
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () =>
    preview(() =>
      h(Stack, { gap: "sm" }, () =>
        ["First", "Second", "Third"].map((label) =>
          h(
            Box,
            {
              padding: "sm",
              style: {
                background: "var(--dui-color-surface-raised)",
                border: "1px solid var(--dui-color-border)",
                borderRadius: "var(--dui-radius-sm)",
              },
            },
            () => label,
          ),
        ),
      ),
    ),
};
