import { Overlay, Paper, Stack, Text } from "@doctui/core";
import type { Meta, StoryObj } from "@storybook/vue3-vite";
import { h } from "vue";
import { preview } from "./story-helpers";

const meta = {
  title: "Overlays/Overlay",
  component: Overlay,
  args: {
    modelValue: true,
    color: "neutral",
    opacity: 0.55,
    closeOnClick: true,
    withBackdrop: true,
    portalTarget: "body",
  },
  argTypes: {
    modelValue: { control: "boolean" },
    color: {
      control: "select",
      options: ["primary", "neutral", "success", "warning", "danger"],
    },
    opacity: { control: { type: "range", min: 0, max: 1, step: 0.05 } },
    closeOnClick: { control: "boolean" },
    withBackdrop: { control: "boolean" },
    portalTarget: { control: "text" },
  },
} satisfies Meta<typeof Overlay>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  render: (args) =>
    preview(() =>
      h(Overlay, args, {
        default: () =>
          h(
            Paper,
            {
              shadow: "xl",
              radius: "lg",
              style: {
                margin: "2rem auto",
                maxWidth: "24rem",
                padding: "1.5rem",
              },
            },
            () =>
              h(Stack, { gap: "sm" }, () => [
                h(Text, null, () => "Overlay surface"),
                h(
                  Text,
                  { size: "sm", muted: true },
                  () =>
                    "Backdrop color and opacity are controlled independently from child content.",
                ),
              ]),
          ),
      }),
    ),
};

export const NoBackdrop: Story = {
  args: {
    withBackdrop: false,
    closeOnClick: false,
  },
  render: (args) =>
    preview(() =>
      h(Overlay, args, {
        default: () =>
          h(
            Paper,
            {
              shadow: "lg",
              style: {
                margin: "2rem auto",
                padding: "1rem",
                maxWidth: "20rem",
              },
            },
            () =>
              h(
                Text,
                null,
                () =>
                  "The layer remains mounted while the visual backdrop is disabled.",
              ),
          ),
      }),
    ),
};
