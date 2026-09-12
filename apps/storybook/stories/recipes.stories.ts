import { Box, Button, Flex, Group, Stack, Text, Title } from "@doctui/core";
import type { Meta, StoryObj } from "@storybook/vue3-vite";
import { h } from "vue";
import { preview } from "./story-helpers";

const meta = {
  title: "Recipes/Release checklist",
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () =>
    preview(() =>
      h(
        Box,
        {
          as: "section",
          padding: "lg",
          style: {
            background: "var(--dui-color-surface)",
            border: "1px solid var(--dui-color-border)",
            borderRadius: "var(--dui-radius-lg)",
            boxShadow: "var(--dui-shadow-sm)",
            maxWidth: "42rem",
          },
        },
        () =>
          h(Stack, { gap: "lg" }, () => [
            h(
              Flex,
              { justify: "space-between", align: "center", gap: "md" },
              () => [
                h(Stack, { gap: "xs" }, () => [
                  h(Title, { order: 2 }, () => "Release checklist"),
                  h(
                    Text,
                    { muted: true, size: "sm" },
                    () =>
                      "A realistic composition made only from exported doctui components.",
                  ),
                ]),
                h(Button, { variant: "light", size: "sm" }, () => "Preview"),
              ],
            ),
            h(
              Box,
              {
                padding: "md",
                style: {
                  background: "var(--dui-color-surface-raised)",
                  borderRadius: "var(--dui-radius-md)",
                },
              },
              () =>
                h(Stack, { gap: "sm" }, () => [
                  h(Text, { weight: 600 }, () => "Component foundation"),
                  h(
                    Text,
                    { muted: true, size: "sm" },
                    () =>
                      "Layout, typography and action APIs share the same theme contract.",
                  ),
                ]),
            ),
            h(Group, { gap: "sm", justify: "flex-end" }, () => [
              h(
                Button,
                { variant: "subtle", color: "neutral" },
                () => "Cancel",
              ),
              h(Button, { color: "success" }, () => "Mark complete"),
            ]),
          ]),
      ),
    ),
};
