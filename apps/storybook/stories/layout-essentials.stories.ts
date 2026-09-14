import {
  Button,
  Center,
  Container,
  Divider,
  Space,
  Stack,
  Text,
} from "@doctui/core";
import type { Meta, StoryObj } from "@storybook/vue3-vite";
import { h } from "vue";
import { preview } from "./story-helpers";

const meta = { title: "Layout/Container" } satisfies Meta;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () =>
    preview(() =>
      h(Container, { size: "md" }, () =>
        h(Stack, { gap: "md" }, () => [
          h(
            Center,
            {
              style: {
                minHeight: "6rem",
                background: "var(--dui-color-surface)",
              },
            },
            () => h(Text, null, () => "Centered content"),
          ),
          h(Divider, { label: "or" }),
          h(Button, null, () => "Continue"),
          h(Space, { size: "sm" }),
        ]),
      ),
    ),
};

export const HorizontalSpace: Story = {
  render: () =>
    preview(() =>
      h("div", null, () => [
        h(Text, { as: "span" }, () => "One"),
        h(Space, { orientation: "horizontal", size: "md" }),
        h(Text, { as: "span" }, () => "Two"),
      ]),
    ),
};
