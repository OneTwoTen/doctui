import { PasswordInput, Stack } from "@doctui/core";
import type { Meta, StoryObj } from "@storybook/vue3-vite";
import { h, ref } from "vue";
import { preview } from "./story-helpers";

const sizeOptions = ["xs", "sm", "md", "lg", "xl"] as const;

const meta = {
  title: "Inputs/PasswordInput",
  component: PasswordInput,
  args: {
    label: "Password",
    modelValue: "secret-value",
    placeholder: "Enter password",
    size: "md",
    required: false,
    disabled: false,
    readonly: false,
    clearable: true,
  },
  argTypes: {
    modelValue: { control: "text" },
    label: { control: "text" },
    description: { control: "text" },
    error: { control: "text" },
    placeholder: { control: "text" },
    size: { control: "select", options: sizeOptions },
    required: { control: "boolean" },
    disabled: { control: "boolean" },
    readonly: { control: "boolean" },
    clearable: { control: "boolean" },
    classNames: { control: "object" },
    styles: { control: "object" },
  },
} satisfies Meta<typeof PasswordInput>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Basic: Story = {
  render: (args) =>
    preview(() => {
      const value = ref(args.modelValue ?? "");
      return h(PasswordInput, {
        ...args,
        modelValue: value.value,
        autocomplete: "current-password",
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
          h(PasswordInput, {
            ...args,
            key: size,
            label: `Size ${size}`,
            size,
            modelValue: "password",
          }),
        ),
      ),
    ),
};

export const States: Story = {
  render: (args) =>
    preview(() =>
      h(Stack, { gap: "md", style: { maxWidth: "30rem" } }, () => [
        h(PasswordInput, {
          ...args,
          label: "Error",
          description: "Use at least 12 characters.",
          error: "Password is too short.",
          modelValue: "short",
        }),
        h(PasswordInput, {
          ...args,
          label: "Disabled",
          modelValue: "secret",
          disabled: true,
        }),
        h(PasswordInput, {
          ...args,
          label: "Read only",
          modelValue: "secret",
          readonly: true,
        }),
      ]),
    ),
};
