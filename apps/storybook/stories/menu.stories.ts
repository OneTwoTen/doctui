import { Button, Menu, Text } from "@doctui/core";
import type { Meta, StoryObj } from "@storybook/vue3-vite";
import { useArgs } from "storybook/preview-api";
import { fn } from "storybook/test";
import { h } from "vue";
import { preview } from "./story-helpers";

const defaultData = [
  { value: "edit", label: "Edit" },
  { value: "duplicate", label: "Duplicate" },
  { value: "archive", label: "Archive" },
  { value: "delete", label: "Delete", disabled: true },
];

const meta = {
  title: "Overlays/Menu",
  component: Menu,
  args: {
    modelValue: false,
    data: defaultData,
    closeOnClickOutside: true,
    onSelect: fn(),
  },
  argTypes: {
    modelValue: { control: "boolean" },
    data: { control: "object" },
    closeOnClickOutside: { control: "boolean" },
  },
  parameters: { layout: "centered" },
} satisfies Meta<typeof Menu>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  render: function Render(args) {
    const [currentArgs, updateArgs] = useArgs();
    const liveArgs = currentArgs as typeof args;

    return preview(() =>
      h(
        "div",
        { style: { minHeight: "14rem", minWidth: "18rem" } },
        [
          h(
            Menu,
            {
              ...liveArgs,
              "onUpdate:modelValue": (value: boolean) =>
                updateArgs({ modelValue: value }),
            },
            { target: () => h(Button, null, () => "Actions") },
          ),
        ],
      ),
    );
  },
};

export const KeyboardAndDisabled: Story = {
  args: { modelValue: true },
  render: function Render(args) {
    const [currentArgs, updateArgs] = useArgs();
    const liveArgs = currentArgs as typeof args;

    return preview(() =>
      h("div", { style: { minHeight: "16rem", minWidth: "22rem" } }, [
        h(Text, { muted: true }, () =>
          "Use ArrowUp/ArrowDown, Home/End, Enter/Space and Escape. Disabled items are skipped.",
        ),
        h(
          "div",
          { style: { marginTop: "1rem" } },
          h(
            Menu,
            {
              ...liveArgs,
              "onUpdate:modelValue": (value: boolean) =>
                updateArgs({ modelValue: value }),
            },
            { target: () => h(Button, null, () => "Keyboard menu") },
          ),
        ),
      ]),
    );
  },
};
