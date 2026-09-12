import { Group, Stack, Switch } from "@doctui/core";
import type { Meta, StoryObj } from "@storybook/vue3-vite";
import { h, ref } from "vue";
import { preview } from "./story-helpers";

const meta = { title: "Inputs/Switch" } satisfies Meta;
export default meta;
type Story = StoryObj<typeof meta>;

export const Basic: Story = {
  render: () =>
    preview(() => {
      const enabled = ref(true);
      return h(Switch, {
        label: "Email notifications",
        modelValue: enabled.value,
        "onUpdate:modelValue": (value: boolean) => (enabled.value = value),
      });
    }),
};

export const Sizes: Story = {
  render: () =>
    preview(() =>
      h(Group, { gap: "lg", align: "center" }, () =>
        (["xs", "sm", "md", "lg", "xl"] as const).map((size) =>
          h(Switch, {
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
  render: () =>
    preview(() =>
      h(Stack, { gap: "md" }, () => [
        h(Switch, { label: "Off", modelValue: false }),
        h(Switch, { label: "On", modelValue: true }),
        h(Switch, { label: "Required", modelValue: false, required: true }),
        h(Switch, { label: "Error", modelValue: false, error: "Enable this setting to continue." }),
        h(Switch, { label: "Disabled", modelValue: true, disabled: true }),
      ]),
    ),
};

export const Customization: Story = {
  render: () =>
    preview(() =>
      h(Switch, {
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
