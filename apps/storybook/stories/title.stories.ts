import { getComponentStorybookTitle, Stack, Title } from "@doctui/core";
import type { Meta, StoryObj } from "@storybook/vue3-vite";
import { h } from "vue";
import { preview } from "./story-helpers";

const meta = {
  title: getComponentStorybookTitle("Title"),
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const HeadingLevels: Story = {
  render: () =>
    preview(() =>
      h(Stack, { gap: "sm" }, () => [
        h(Title, { order: 1 }, () => "Heading one"),
        h(Title, { order: 2 }, () => "Heading two"),
        h(Title, { order: 3 }, () => "Heading three"),
        h(Title, { order: 4 }, () => "Heading four"),
        h(Title, { order: 5 }, () => "Heading five"),
        h(Title, { order: 6 }, () => "Heading six"),
      ]),
    ),
};
