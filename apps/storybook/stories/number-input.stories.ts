import { NumberInput, Stack } from "@doctui/core";
import type { Meta, StoryObj } from "@storybook/vue3-vite";
import { h, ref } from "vue";
import { preview } from "./story-helpers";

const sizeOptions = ["xs", "sm", "md", "lg", "xl"] as const;

const meta = {
  title: "Inputs/NumberInput",
  component: NumberInput,
  args: {
    label: "Seats",
    modelValue: 12,
    min: 1,
    max: 100,
    step: 1,
    size: "md",
    required: false,
    disabled: false,
    readonly: false,
  },
  argTypes: {
    modelValue: { control: "number" },
    label: { control: "text" },
    description: { control: "text" },
    error: { control: "text" },
    min: { control: "number" },
    max: { control: "number" },
    step: { control: "number" },
    size: { control: "select", options: sizeOptions },
    required: { control: "boolean" },
    disabled: { control: "boolean" },
    readonly: { control: "boolean" },
    classNames: { control: "object" },
    styles: { control: "object" },
  },
} satisfies Meta<typeof NumberInput>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Basic: Story = {
  render: (args) =>
    preview(() => {
      const value = ref<number | null>(args.modelValue ?? null);
      return h(NumberInput, {
        ...args,
        modelValue: value.value,
        name: "seats",
        "onUpdate:modelValue": (next: number | null) => (value.value = next),
      });
    }),
};

export const Sizes: Story = {
  render: (args) =>
    preview(() =>
      h(Stack, { gap: "sm", style: { maxWidth: "30rem" } }, () =>
        sizeOptions.map((size) =>
          h(NumberInput, {
            ...args,
            key: size,
            label: `Size ${size}`,
            size,
            modelValue: 24,
          }),
        ),
      ),
    ),
};

export const States: Story = {
  render: (args) =>
    preview(() =>
      h(Stack, { gap: "md", style: { maxWidth: "30rem" } }, () => [
        h(NumberInput, {
          ...args,
          label: "Error",
          error: "Outside the allowed range.",
          modelValue: 120,
        }),
        h(NumberInput, {
          ...args,
          label: "Disabled",
          modelValue: 5,
          disabled: true,
        }),
        h(NumberInput, {
          ...args,
          label: "Read only",
          modelValue: 42,
          readonly: true,
        }),
      ]),
    ),
};
