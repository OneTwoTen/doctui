import { Button, getComponentStorybookTitle, Group } from "@doctui/core";
import type { Meta, StoryObj } from "@storybook/vue3-vite";
import { h } from "vue";
import { preview } from "./story-helpers";

const meta = {
  title: getComponentStorybookTitle("Group"),
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () =>
    preview(() =>
      h(Group, { gap: "sm" }, () => [
        h(Button, { variant: "default" }, () => "Cancel"),
        h(Button, null, () => "Continue"),
      ]),
    ),
};

export const SpaceBetween: Story = {
  render: () =>
    preview(() =>
      h(Group, { gap: "sm", justify: "space-between" }, () => [
        h(Button, { variant: "subtle" }, () => "Back"),
        h(Button, { color: "success" }, () => "Save"),
      ]),
    ),
};
