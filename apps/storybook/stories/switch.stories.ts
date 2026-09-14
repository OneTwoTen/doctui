import { Group, Stack, Switch } from "@doctui/core";
import type { Meta, StoryObj } from "@storybook/vue3-vite";
import { h, ref } from "vue";
import { preview } from "./story-helpers";

const sizeOptions = ["xs", "sm", "md", "lg", "xl"] as const;

const meta = {
  title: "Inputs/Switch",
  component: Switch,
  args: {
    label: "Email notifications",
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
} satisfies Meta<typeof Switch>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Basic: Story = {
  render: (args) =>
    preview(() => {
      const enabled = ref(Boolean(args.modelValue));
      return h(Switch, {
        ...args,
        modelValue: enabled.value,
        "onUpdate:modelValue": (value: boolean) => (enabled.value = value),
      });
    }),
};

export const Sizes: Story = {
  render: (args) =>
    preview(() =>
      h(Group, { gap: "lg", align: "center" }, () =>
        sizeOptions.map((size) =>
          h(Switch, {
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
        h(Switch, { ...args, label: "Off", modelValue: false }),
        h(Switch, { ...args, label: "On", modelValue: true }),
        h(Switch, {
          ...args,
          label: "Required",
          modelValue: false,
          required: true,
        }),
        h(Switch, {
          ...args,
          label: "Error",
          modelValue: false,
          error: "Enable this setting to continue.",
        }),
        h(Switch, {
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
      h(Switch, {
        ...args,
        label: "Custom track and thumb",
        modelValue: true,
        styles: {
          root: { "--dui-field-switch-width": "4rem" },
          track: { borderWidth: "2px" },
          thumb: { boxShadow: "var(--dui-shadow-sm)" },
        },
      }),
    ),
};
