import { Badge, Paper, Stack, Text } from "@doctui/core";
import type { Meta, StoryObj } from "@storybook/vue3-vite";
import { h } from "vue";
import { preview } from "./story-helpers";

const meta = { title: "Data display/Badge" } satisfies Meta;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () =>
    preview(() =>
      h(
        Paper,
        {
          shadow: "sm",
          withBorder: true,
          style: { maxWidth: "24rem", padding: "var(--dui-spacing-lg)" },
        },
        () =>
          h(Stack, { gap: "sm" }, () => [
            h(Text, { weight: 600 }, () => "Deployment"),
            h(Badge, { color: "success" }, () => "Live"),
            h(
              Text,
              { size: "sm", muted: true },
              () => "Published from the static GitHub Pages workflow.",
            ),
          ]),
      ),
    ),
};
