import { Button, Popover, Stack, Text } from "@doctui/core";
import type { Meta, StoryObj } from "@storybook/vue3-vite";
import { useArgs } from "storybook/preview-api";
import { h } from "vue";
import { preview } from "./story-helpers";

const meta = {
  title: "Overlays/Popover",
  component: Popover,
  args: {
    modelValue: false,
    ariaLabel: "Popover details",
    position: "bottom",
    closeOnEscape: true,
    closeOnClickOutside: true,
  },
  argTypes: {
    modelValue: { control: "boolean" },
    ariaLabel: { control: "text" },
    position: {
      control: "inline-radio",
      options: ["top", "right", "bottom", "left"],
    },
    closeOnEscape: { control: "boolean" },
    closeOnClickOutside: { control: "boolean" },
  },
  parameters: { layout: "centered" },
} satisfies Meta<typeof Popover>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  render: function Render(args) {
    const [currentArgs, updateArgs] = useArgs();
    const liveArgs = currentArgs as typeof args;

    return preview(() =>
      h(
        "div",
        {
          style: {
            alignItems: "center",
            display: "flex",
            justifyContent: "center",
            minHeight: "20rem",
            minWidth: "28rem",
          },
        },
        [
          h(
            Popover,
            {
              ...liveArgs,
              "onUpdate:modelValue": (value: boolean) =>
                updateArgs({ modelValue: value }),
            },
            {
              target: () => h(Button, null, () => "Toggle popover"),
              default: () =>
                h(Stack, { gap: "xs" }, () => [
                  h(Text, { weight: 600 }, () => "Contextual details"),
                  h(Text, { muted: true }, () =>
                    "Change position and dismissal behavior from Controls.",
                  ),
                ]),
            },
          ),
        ],
      ),
    );
  },
};

export const LongContent: Story = {
  args: {
    modelValue: true,
    ariaLabel: "Long popover content",
  },
  render: function Render(args) {
    const [currentArgs, updateArgs] = useArgs();
    const liveArgs = currentArgs as typeof args;

    return preview(() =>
      h(
        "div",
        {
          style: {
            alignItems: "center",
            display: "flex",
            justifyContent: "center",
            minHeight: "20rem",
            minWidth: "32rem",
          },
        },
        [
          h(
            Popover,
            {
              ...liveArgs,
              "onUpdate:modelValue": (value: boolean) =>
                updateArgs({ modelValue: value }),
            },
            {
              target: () => h(Button, null, () => "Details"),
              default: () =>
                h(Text, null, () =>
                  "This longer content verifies that the surface remains readable and constrained instead of stretching beyond the Storybook canvas.",
                ),
            },
          ),
        ],
      ),
    );
  },
};
