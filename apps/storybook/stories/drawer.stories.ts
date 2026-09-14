import { Button, Drawer, Stack, Text } from "@doctui/core";
import type { Meta, StoryObj } from "@storybook/vue3-vite";
import { useArgs } from "storybook/preview-api";
import { h } from "vue";
import { preview } from "./story-helpers";

const meta = {
  title: "Overlays/Drawer",
  component: Drawer,
  args: {
    modelValue: false,
    title: "Filters",
    ariaLabel: "Filters drawer",
    position: "right",
    size: "md",
    radius: "md",
    closeOnEscape: true,
    closeOnClickOutside: true,
    withCloseButton: true,
  },
  argTypes: {
    modelValue: { control: "boolean" },
    title: { control: "text" },
    ariaLabel: { control: "text" },
    position: { control: "inline-radio", options: ["left", "right"] },
    size: {
      control: "select",
      options: ["xs", "sm", "md", "lg", "xl"],
    },
    radius: {
      control: "select",
      options: ["xs", "sm", "md", "lg", "xl", "full"],
    },
    closeOnEscape: { control: "boolean" },
    closeOnClickOutside: { control: "boolean" },
    withCloseButton: { control: "boolean" },
  },
} satisfies Meta<typeof Drawer>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  render: function Render(args) {
    const [currentArgs, updateArgs] = useArgs();
    const liveArgs = currentArgs as typeof args;

    return preview(() =>
      h(Stack, { gap: "md" }, () => [
        h(
          Button,
          { onClick: () => updateArgs({ modelValue: true }) },
          () => "Open drawer",
        ),
        h(
          Drawer,
          {
            ...liveArgs,
            "onUpdate:modelValue": (value: boolean) =>
              updateArgs({ modelValue: value }),
          },
          {
            default: () =>
              h(Stack, { gap: "md" }, () => [
                h(Text, null, () =>
                  "Use Controls to change side, size, radius and dismissal behavior.",
                ),
                h(
                  Button,
                  { onClick: () => updateArgs({ modelValue: false }) },
                  () => "Apply filters",
                ),
              ]),
          },
        ),
      ]),
    );
  },
};

export const Open: Story = {
  args: { modelValue: true },
  render: function Render(args) {
    const [currentArgs, updateArgs] = useArgs();
    const liveArgs = currentArgs as typeof args;

    return preview(() =>
      h(
        Drawer,
        {
          ...liveArgs,
          "onUpdate:modelValue": (value: boolean) =>
            updateArgs({ modelValue: value }),
        },
        {
          default: () =>
            h(Text, null, () =>
              "This story starts open so geometry changes are visible immediately.",
            ),
        },
      ),
    );
  },
};
