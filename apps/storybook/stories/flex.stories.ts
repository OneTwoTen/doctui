import { Box, Flex, getComponentStorybookTitle } from "@doctui/core";
import type { Meta, StoryObj } from "@storybook/vue3-vite";
import { h } from "vue";
import { preview } from "./story-helpers";

const meta = {
  title: getComponentStorybookTitle("Flex"),
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

const item = (label: string) =>
  h(
    Box,
    {
      padding: "sm",
      style: {
        background: "var(--dui-color-primary-light)",
        borderRadius: "var(--dui-radius-sm)",
      },
    },
    () => label,
  );

export const Default: Story = {
  render: () =>
    preview(() =>
      h(Flex, { gap: "sm", align: "center" }, () => [item("One"), item("Two")]),
    ),
};

export const Wrapped: Story = {
  render: () =>
    preview(() =>
      h(Flex, { gap: "sm", wrap: "wrap" }, () =>
        ["One", "Two", "Three", "Four"].map(item),
      ),
    ),
};
