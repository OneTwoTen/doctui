import { Group, Loader, Skeleton, Stack, Text } from "@doctui/core";
import type { Meta, StoryObj } from "@storybook/vue3-vite";
import { h } from "vue";
import { preview } from "./story-helpers";

const meta = { title: "Feedback/Skeleton" } satisfies Meta;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () =>
    preview(() =>
      h(Stack, { gap: "md", style: { maxWidth: "24rem" } }, () => [
        h(Skeleton, { height: "1.2rem", width: "60%" }),
        h(Skeleton, { height: "4rem" }),
        h(Group, { gap: "sm" }, () => [
          h(Loader, { type: "dots" }),
          h(Text, { muted: true }, () => "Loading data"),
        ]),
      ]),
    ),
};

export const Loaded: Story = {
  render: () =>
    preview(() =>
      h(Skeleton, { visible: false }, () =>
        h(Text, null, () => "Loaded content"),
      ),
    ),
};
