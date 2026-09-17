import { Badge, Button, Grid, Paper, Stack, Text } from "@doctui/core";
import type { Meta, StoryObj } from "@storybook/vue3-vite";
import { h } from "vue";
import { preview } from "./story-helpers";

const meta = {
  title: "Layout/Grid",
  component: Grid,
  args: {
    columns: 3,
    gap: "md",
    align: "stretch",
    justify: "stretch",
  },
  argTypes: {
    columns: { control: "number" },
    gap: { control: "select", options: ["xs", "sm", "md", "lg", "xl"] },
    align: {
      control: "select",
      options: ["start", "center", "end", "stretch"],
    },
    justify: {
      control: "select",
      options: ["start", "center", "end", "stretch"],
    },
  },
} satisfies Meta<typeof Grid>;

export default meta;
type Story = StoryObj<typeof meta>;

const card = (title: string, detail: string) =>
  h(
    Paper,
    {
      withBorder: true,
      radius: "md",
      style: { padding: "var(--dui-spacing-md)" },
    },
    () =>
      h(Stack, { gap: "xs" }, () => [
        h(Text, { weight: 600 }, () => title),
        h(Text, { size: "sm", muted: true }, () => detail),
      ]),
  );

export const Default: Story = {
  render: (args) =>
    preview(() =>
      h(Grid, args, () => [
        card("Orders", "128 today"),
        card("Revenue", "$8,420"),
        card("Conversion", "4.8%"),
      ]),
    ),
};

export const AdvancedComposition: Story = {
  parameters: { controls: { disable: true } },
  render: () =>
    preview(() =>
      h(Grid, { columns: 2, gap: "lg", align: "stretch" }, () => [
        h(
          Paper,
          {
            withBorder: true,
            radius: "lg",
            style: { padding: "var(--dui-spacing-lg)" },
          },
          () =>
            h(Stack, { gap: "sm" }, () => [
              h(Badge, { color: "success" }, () => "Healthy"),
              h(Text, { weight: 600 }, () => "Production"),
              h(
                Text,
                { size: "sm", muted: true },
                () => "All services are responding normally.",
              ),
            ]),
        ),
        h(
          Paper,
          {
            withBorder: true,
            radius: "lg",
            style: { padding: "var(--dui-spacing-lg)" },
          },
          () =>
            h(Stack, { gap: "sm" }, () => [
              h(Text, { weight: 600 }, () => "Next deployment"),
              h(
                Text,
                { size: "sm", muted: true },
                () => "Review the pending release before publishing.",
              ),
              h(Button, { variant: "outline" }, () => "Review release"),
            ]),
        ),
      ]),
    ),
};
