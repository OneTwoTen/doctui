import { Checkbox, Group, Stack } from "@doctui/core";
import type { Meta, StoryObj } from "@storybook/vue3-vite";
import { h, ref } from "vue";
import { preview } from "./story-helpers";

const meta = { title: "Inputs/Checkbox" } satisfies Meta;
export default meta;
type Story = StoryObj<typeof meta>;

export const Basic: Story = {
  render: () =>
    preview(() => {
      const checked = ref(true);
      return h(Checkbox, {
        label: "Accept terms",
        modelValue: checked.value,
        "onUpdate:modelValue": (value: boolean) => (checked.value = value),
      });
    }),
};

export const Sizes: Story = {
  render: () =>
    preview(() =>
      h(Group, { gap: "lg", align: "center" }, () =>
        (["xs", "sm", "md", "lg", "xl"] as const).map((size) =>
          h(Checkbox, {
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
        h(Checkbox, { label: "Unchecked", modelValue: false }),
        h(Checkbox, { label: "Checked", modelValue: true }),
        h(Checkbox, { label: "Required", modelValue: false, required: true }),
        h(Checkbox, { label: "Error", modelValue: false, error: "Please accept this option." }),
        h(Checkbox, { label: "Disabled", modelValue: true, disabled: true }),
      ]),
    ),
};

export const Customization: Story = {
  render: () =>
    preview(() =>
      h(Checkbox, {
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
