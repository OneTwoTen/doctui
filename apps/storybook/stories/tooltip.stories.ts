import { Button, Group, Tooltip } from "@doctui/core";
import type { Meta, StoryObj } from "@storybook/vue3-vite";
import { useArgs } from "storybook/preview-api";
import { h } from "vue";
import { preview } from "./story-helpers";

const meta = {
  title: "Overlays/Tooltip",
  component: Tooltip,
  args: {
    label: "Helpful context",
    modelValue: false,
    position: "top",
  },
  argTypes: {
    label: { control: "text" },
    modelValue: { control: "boolean" },
    position: {
      control: "inline-radio",
      options: ["top", "right", "bottom", "left"],
    },
  },
  parameters: { layout: "centered" },
} satisfies Meta<typeof Tooltip>;

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
            minHeight: "16rem",
            minWidth: "26rem",
          },
        },
        [
          h(
            Tooltip,
            {
              ...liveArgs,
              "onUpdate:modelValue": (value: boolean) =>
                updateArgs({ modelValue: value }),
            },
            { default: () => h(Button, null, () => "Hover or focus") },
          ),
        ],
      ),
    );
  },
};

export const LongLabel: Story = {
  args: {
    label:
      "A longer tooltip wraps to a readable width instead of overflowing the Storybook canvas.",
    modelValue: true,
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
            minHeight: "18rem",
            minWidth: "30rem",
          },
        },
        [
          h(
            Tooltip,
            {
              ...liveArgs,
              "onUpdate:modelValue": (value: boolean) =>
                updateArgs({ modelValue: value }),
            },
            { default: () => h(Button, null, () => "Long tooltip") },
          ),
        ],
      ),
    );
  },
};

export const CompositeTrigger: Story = {
  args: { label: "Focus can move inside this composite trigger" },
  render: function Render(args) {
    const [currentArgs, updateArgs] = useArgs();
    const liveArgs = currentArgs as typeof args;

    return preview(() =>
      h(
        Tooltip,
        {
          ...liveArgs,
          "onUpdate:modelValue": (value: boolean) =>
            updateArgs({ modelValue: value }),
        },
        {
          default: () =>
            h(Group, { gap: "xs" }, () => [
              h(Button, null, () => "Previous"),
              h(Button, null, () => "Next"),
            ]),
        },
      ),
    );
  },
};
