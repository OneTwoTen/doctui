import { Checkbox, Group, Stack } from "@doctui/core";
import type { Meta, StoryObj } from "@storybook/vue3-vite";
import { h, ref } from "vue";
import { preview } from "./story-helpers";

const sizeOptions = ["xs", "sm", "md", "lg", "xl"] as const;

const meta = {
  title: "Inputs/Checkbox",
  component: Checkbox,
  args: {
    label: "Accept terms",
    modelValue: true,
    size: "md",
    required: false,
    disabled: false,
  },
  argTypes: {
    modelValue: { control: "boolean" },
    label: { control: "text" },
    description: { control: "text" },
    error: { control: "text" },
    size: { control: "select", options: sizeOptions },
    required: { control: "boolean" },
    disabled: { control: "boolean" },
    classNames: { control: "object" },
    styles: { control: "object" },
  },
} satisfies Meta<typeof Checkbox>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Basic: Story = {
  render: (args) =>
    preview(() => {
      const checked = ref(Boolean(args.modelValue));
      return h(Checkbox, {
        ...args,
        modelValue: checked.value,
        "onUpdate:modelValue": (value: boolean) => (checked.value = value),
      });
    }),
};

export const Sizes: Story = {
  render: (args) =>
    preview(() =>
      h(Group, { gap: "lg", align: "center" }, () =>
        sizeOptions.map((size) =>
          h(Checkbox, {
            ...args,
            key: size,
            label: size.toUpperCase(),
            size,
            modelValue: true,
          }),
        ),
      ),
    ),
};

export const States: Story = {
  render: (args) =>
    preview(() =>
      h(Stack, { gap: "md" }, () => [
        h(Checkbox, { ...args, label: "Unchecked", modelValue: false }),
        h(Checkbox, { ...args, label: "Checked", modelValue: true }),
        h(Checkbox, {
          ...args,
          label: "Required",
          modelValue: false,
          required: true,
        }),
        h(Checkbox, {
          ...args,
          label: "Error",
          modelValue: false,
          error: "Please accept this option.",
        }),
        h(Checkbox, {
          ...args,
          label: "Disabled",
          modelValue: true,
          disabled: true,
        }),
      ]),
    ),
};

export const Customization: Story = {
  render: (args) =>
    preview(() =>
      h(Checkbox, {
        ...args,
        label: "Custom indicator",
        modelValue: true,
        classNames: { indicator: "storybook-checkbox-indicator" },
        styles: {
          root: { "--dui-field-choice-size": "2rem" },
          indicator: { borderWidth: "2px" },
        },
      }),
    ),
};
