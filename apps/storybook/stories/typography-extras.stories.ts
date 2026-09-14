import { Code, Kbd, Stack, Text } from "@doctui/core";
import type { Meta, StoryObj } from "@storybook/vue3-vite";
import { h } from "vue";
import { preview } from "./story-helpers";

const meta = { title: "Typography/Code" } satisfies Meta;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () =>
    preview(() =>
      h(Stack, { gap: "md" }, () => [
        h(Text, null, () => ["Run ", h(Code, null, () => "bun test")]),
        h(Text, null, () => [
          "Open the command palette with ",
          h(Kbd, null, () => "⌘ K"),
        ]),
        h(
          Code,
          { block: true },
          () => 'import { Button } from "@doctui/core";',
        ),
      ]),
    ),
};
