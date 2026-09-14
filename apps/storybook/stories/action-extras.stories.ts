import { ActionIcon, Group, Text, UnstyledButton } from "@doctui/core";
import type { Meta, StoryObj } from "@storybook/vue3-vite";
import { h } from "vue";
import { preview } from "./story-helpers";

const meta = { title: "Actions/ActionIcon" } satisfies Meta;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () =>
    preview(() =>
      h(Group, { gap: "md" }, () => [
        h(ActionIcon, { ariaLabel: "Close" }, () => "×"),
        h(
          ActionIcon,
          { ariaLabel: "Favorite", color: "danger", variant: "light" },
          () => "♥",
        ),
        h(UnstyledButton, null, () =>
          h(Text, { size: "sm" }, () => "Custom action"),
        ),
      ]),
    ),
};
