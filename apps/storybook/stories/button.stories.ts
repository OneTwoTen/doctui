import { Button, Group, Stack, Title } from "@doctui/core";
import type { Meta, StoryObj } from "@storybook/vue3-vite";
import { expect, fn } from "storybook/test";
import { h } from "vue";
import { preview } from "./story-helpers";

const meta = {
  title: "Actions/Button",
  component: Button,
  args: {
    onClick: fn(),
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Variants: Story = {
  render: () =>
    preview(() =>
      h(Stack, { gap: "md" }, () => [
        h(Title, { order: 3 }, () => "Variants and semantic colors"),
        h(Group, { gap: "sm" }, () => [
          h(Button, { variant: "filled", color: "primary" }, () => "Filled"),
          h(Button, { variant: "light", color: "success" }, () => "Light"),
          h(Button, { variant: "outline", color: "warning" }, () => "Outline"),
          h(Button, { variant: "subtle", color: "danger" }, () => "Subtle"),
          h(Button, { variant: "default" }, () => "Default"),
        ]),
      ]),
    ),
};

export const States: Story = {
  render: () =>
    preview(() =>
      h(Group, { gap: "md" }, () => [
        h(Button, null, () => "Ready"),
        h(Button, { loading: true }, () => "Saving"),
        h(Button, { disabled: true }, () => "Disabled"),
        h(Button, { size: "xs", radius: "full" }, () => "Compact"),
        h(Button, { size: "xl", radius: "xl" }, () => "Large"),
      ]),
    ),
};

export const Interactive: Story = {
  render: (args) => preview(() => h(Button, args, () => "Click me")),
  play: async ({ canvas, userEvent, args }) => {
    await userEvent.click(canvas.getByRole("button", { name: "Click me" }));
    await expect(args.onClick).toHaveBeenCalledTimes(1);
  },
};
