import { Box, getComponentStorybookTitle, Text } from "@doctui/core";
import type { Meta, StoryObj } from "@storybook/vue3-vite";
import { h } from "vue";
import { preview } from "./story-helpers";

const meta = {
  title: getComponentStorybookTitle("Box"),
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () =>
    preview(() =>
      h(
        Box,
        {
          padding: "md",
          style: {
            background: "var(--dui-color-surface-raised)",
            border: "1px solid var(--dui-color-border)",
            borderRadius: "var(--dui-radius-md)",
          },
        },
        () => h(Text, null, () => "Box is the low-level layout container."),
      ),
    ),
};

export const SpacingTokens: Story = {
  render: () =>
    preview(() =>
      h(
        Box,
        {
          padding: "xl",
          margin: "md",
          style: {
            background: "var(--dui-color-primary-light)",
            borderRadius: "var(--dui-radius-lg)",
          },
        },
        () => "Token-based padding and margin",
      ),
    ),
};
