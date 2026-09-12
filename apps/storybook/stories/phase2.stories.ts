import {
  Box,
  Button,
  DoctuiProvider,
  Flex,
  Group,
  Stack,
  Text,
  Title,
} from "@doctui/core";
import type { Meta, StoryObj } from "@storybook/vue3-vite";
import { defineComponent, h } from "vue";

const meta = {
  title: "Phase 2/Basic components",
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

function preview(renderContent: () => ReturnType<typeof h>) {
  return defineComponent({
    setup() {
      return () => h(DoctuiProvider, null, { default: renderContent });
    },
  });
}

export const Layout: Story = {
  render: () =>
    preview(() =>
      h(Stack, { gap: "lg" }, () => [
        h(Title, { order: 3 }, () => "Layout primitives"),
        h(Flex, { gap: "sm", wrap: "wrap" }, () =>
          ["Box", "Flex", "Stack", "Group"].map((label) =>
            h(
              Box,
              {
                padding: "md",
                style: {
                  background: "var(--dui-color-surface-raised)",
                  border: "1px solid var(--dui-color-border)",
                  borderRadius: "var(--dui-radius-md)",
                },
              },
              () => label,
            ),
          ),
        ),
        h(Group, { gap: "sm", justify: "space-between" }, () => [
          h(Text, null, () => "Group wraps related inline content."),
          h(Button, { variant: "light" }, () => "Action"),
        ]),
      ]),
    ),
};

export const Typography: Story = {
  render: () =>
    preview(() =>
      h(Stack, { gap: "sm" }, () => [
        h(Title, { order: 1 }, () => "Heading one"),
        h(Title, { order: 2 }, () => "Heading two"),
        h(Title, { order: 3 }, () => "Heading three"),
        h(
          Text,
          { size: "md" },
          () => "Body text follows theme typography tokens.",
        ),
        h(
          Text,
          { size: "sm", muted: true },
          () => "Muted supporting text stays semantic.",
        ),
      ]),
    ),
};

export const ButtonVariants: Story = {
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

export const ButtonStates: Story = {
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

export const AdvancedComposition: Story = {
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
                  h(Text, { weight: 600 }, () => "Phase 2 foundation"),
                  h(
                    Text,
                    { muted: true, size: "sm" },
                    () =>
                      "Layout, typography and button APIs now share the theme contract.",
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
