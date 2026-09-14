import { Drawer, Stack, Text } from "@doctui/core";
import type { Meta, StoryObj } from "@storybook/vue3-vite";
import { h } from "vue";
import { preview } from "./story-helpers";

const meta = {
  title: "Overlays/Drawer",
  component: Drawer,
  args: {
    modelValue: true,
    title: "Filters",
    ariaLabel: undefined,
    position: "right",
    size: "md",
    radius: "md",
    closeOnEscape: true,
    closeOnClickOutside: true,
    withCloseButton: true,
    withOverlay: true,
    overlayProps: { color: "neutral", opacity: 0.55 },
    lockScroll: true,
    trapFocus: true,
    returnFocus: true,
    portalTarget: "body",
  },
  argTypes: {
    modelValue: { control: "boolean" },
    title: { control: "text" },
    ariaLabel: { control: "text" },
    position: {
      control: "select",
      options: ["left", "right"],
    },
    size: {
      control: "select",
      options: ["xs", "sm", "md", "lg", "xl"],
    },
    radius: {
      control: "select",
      options: ["none", "xs", "sm", "md", "lg", "xl", "full"],
    },
    closeOnEscape: { control: "boolean" },
    closeOnClickOutside: { control: "boolean" },
    withCloseButton: { control: "boolean" },
    withOverlay: { control: "boolean" },
    overlayProps: { control: "object" },
    lockScroll: { control: "boolean" },
    trapFocus: { control: "boolean" },
    returnFocus: { control: "boolean" },
    portalTarget: { control: "text" },
  },
} satisfies Meta<typeof Drawer>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  render: (args) =>
    preview(() =>
      h(
        Drawer,
        args,
        {
          default: () =>
            h(Stack, { gap: "md" }, () => [
              h(Text, null, () => "Drawer content"),
              h(
                Text,
                { size: "sm", muted: true },
                () => "Use Controls to verify position, width, radius, backdrop, dismissal and focus behavior.",
              ),
            ]),
          footer: () => h(Text, { size: "sm", muted: true }, () => "Footer slot"),
        },
      ),
    ),
};

export const CustomBackdrop: Story = {
  args: {
    size: "lg",
    overlayProps: { color: "primary", opacity: 0.35 },
  },
  render: (args) =>
    preview(() =>
      h(Drawer, args, {
        default: () => h(Text, null, () => "Backdrop props are forwarded to the shared Overlay."),
      }),
    ),
};
