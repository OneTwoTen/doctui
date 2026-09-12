import { Stack, Textarea } from "@doctui/core";
import type { Meta, StoryObj } from "@storybook/vue3-vite";
import { h, ref } from "vue";
import { preview } from "./story-helpers";

const sizeOptions = ["xs", "sm", "md", "lg", "xl"] as const;

const meta = {
  title: "Inputs/Textarea",
  component: Textarea,
  args: {
    label: "Notes",
    description: "Long-form supporting context.",
    modelValue: "Editable multi-line content",
    placeholder: "Add context",
    rows: 4,
    size: "md",
    required: false,
    disabled: false,
    readonly: false,
  },
  argTypes: {
    modelValue: { control: "text" },
    label: { control: "text" },
    description: { control: "text" },
    error: { control: "text" },
    placeholder: { control: "text" },
    rows: { control: { type: "number", min: 1 } },
    size: { control: "select", options: sizeOptions },
    required: { control: "boolean" },
    disabled: { control: "boolean" },
    readonly: { control: "boolean" },
    classNames: { control: "object" },
    styles: { control: "object" },
  },
} satisfies Meta<typeof Textarea>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Basic: Story = {
  render: (args) =>
    preview(() => {
      const value = ref(args.modelValue ?? "");
      return h(Textarea, {
        ...args,
        modelValue: value.value,
        style: { maxWidth: "30rem" },
        "onUpdate:modelValue": (next: string) => (value.value = next),
      });
    }),
};

export const Sizes: Story = {
  render: (args) =>
    preview(() =>
      h(Stack, { gap: "sm", style: { maxWidth: "30rem" } }, () =>
        sizeOptions.map((size) =>
          h(Textarea, {
            ...args,
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
  render: (args) =>
    preview(() =>
      h(Stack, { gap: "md", style: { maxWidth: "30rem" } }, () => [
        h(Textarea, {
          ...args,
          label: "Error",
          description: "Supporting text remains available.",
          error: "Please shorten this note.",
          modelValue: "Invalid content",
        }),
        h(Textarea, {
          ...args,
          label: "Disabled",
          modelValue: "Disabled",
          disabled: true,
        }),
        h(Textarea, {
          ...args,
          label: "Read only",
          modelValue: "Focusable and copyable",
          readonly: true,
        }),
      ]),
    ),
};
