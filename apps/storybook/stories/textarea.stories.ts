import { Stack, Textarea } from "@doctui/core";
import type { Meta, StoryObj } from "@storybook/vue3-vite";
import { h } from "vue";
import { preview } from "./story-helpers";

const meta = { title: "Inputs/Textarea" } satisfies Meta;
export default meta;
type Story = StoryObj<typeof meta>;

export const Basic: Story = {
  render: () =>
    preview(() =>
      h(Textarea, {
        label: "Notes",
        description: "Long-form supporting context.",
        modelValue: "Editable multi-line content",
        rows: 4,
        style: { maxWidth: "30rem" },
      }),
    ),
};

export const Sizes: Story = {
  render: () =>
    preview(() =>
      h(Stack, { gap: "sm", style: { maxWidth: "30rem" } }, () =>
        (["xs", "sm", "md", "lg", "xl"] as const).map((size) =>
          h(Textarea, {
            key: size,
            label: `Size ${size}`,
            size,
            rows: 2,
            modelValue: "Padding and text geometry scale together.",
          }),
        ),
      ),
    ),
};

export const States: Story = {
  render: () =>
    preview(() =>
      h(Stack, { gap: "md", style: { maxWidth: "30rem" } }, () => [
        h(Textarea, {
          label: "Error",
          description: "Supporting text remains available.",
          error: "Please shorten this note.",
          modelValue: "Invalid content",
        }),
        h(Textarea, { label: "Disabled", modelValue: "Disabled", disabled: true }),
        h(Textarea, { label: "Read only", modelValue: "Focusable and copyable", readonly: true }),
      ]),
    ),
};
