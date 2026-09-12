import { NumberInput, Stack } from "@doctui/core";
import type { Meta, StoryObj } from "@storybook/vue3-vite";
import { h, ref } from "vue";
import { preview } from "./story-helpers";

const meta = { title: "Inputs/NumberInput" } satisfies Meta;
export default meta;
type Story = StoryObj<typeof meta>;

export const Basic: Story = {
  render: () =>
    preview(() => {
      const value = ref<number | null>(12);
      return h(NumberInput, {
        label: "Seats",
        modelValue: value.value,
        min: 1,
        max: 100,
        name: "seats",
        "onUpdate:modelValue": (next: number | null) => (value.value = next),
      });
    }),
};

export const Sizes: Story = {
  render: () =>
    preview(() =>
      h(Stack, { gap: "sm", style: { maxWidth: "30rem" } }, () =>
        (["xs", "sm", "md", "lg", "xl"] as const).map((size) =>
          h(NumberInput, {
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
  render: () =>
    preview(() =>
      h(Stack, { gap: "md", style: { maxWidth: "30rem" } }, () => [
        h(NumberInput, { label: "Error", error: "Outside the allowed range.", modelValue: 120 }),
        h(NumberInput, { label: "Disabled", modelValue: 5, disabled: true }),
        h(NumberInput, { label: "Read only", modelValue: 42, readonly: true }),
      ]),
    ),
};
