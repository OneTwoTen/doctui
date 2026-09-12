import { PasswordInput, Stack } from "@doctui/core";
import type { Meta, StoryObj } from "@storybook/vue3-vite";
import { h } from "vue";
import { preview } from "./story-helpers";

const meta = { title: "Inputs/PasswordInput" } satisfies Meta;
export default meta;
type Story = StoryObj<typeof meta>;

export const Basic: Story = {
  render: () =>
    preview(() =>
      h(PasswordInput, {
        label: "Password",
        modelValue: "secret-value",
        autocomplete: "current-password",
        clearable: true,
        style: { maxWidth: "30rem" },
      }),
    ),
};

export const Sizes: Story = {
  render: () =>
    preview(() =>
      h(Stack, { gap: "sm", style: { maxWidth: "30rem" } }, () =>
        (["xs", "sm", "md", "lg", "xl"] as const).map((size) =>
          h(PasswordInput, {
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
  render: () =>
    preview(() =>
      h(Stack, { gap: "md", style: { maxWidth: "30rem" } }, () => [
        h(PasswordInput, {
          label: "Error",
          description: "Use at least 12 characters.",
          error: "Password is too short.",
          modelValue: "short",
        }),
        h(PasswordInput, {
          label: "Disabled",
          modelValue: "secret",
          disabled: true,
        }),
        h(PasswordInput, {
          label: "Read only",
          modelValue: "secret",
          readonly: true,
        }),
      ]),
    ),
};
