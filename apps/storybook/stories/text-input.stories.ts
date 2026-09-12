import { Stack, TextInput } from "@doctui/core";
import type { Meta, StoryObj } from "@storybook/vue3-vite";
import { h, ref } from "vue";
import { preview } from "./story-helpers";

const meta = { title: "Inputs/TextInput" } satisfies Meta;
export default meta;
type Story = StoryObj<typeof meta>;

export const Basic: Story = {
  render: () =>
    preview(() => {
      const value = ref("ada@example.com");
      return h(TextInput, {
        label: "Email",
        description: "Used for account notifications.",
        modelValue: value.value,
        clearable: true,
        name: "email",
        autocomplete: "email",
        "onUpdate:modelValue": (next: string) => (value.value = next),
      });
    }),
};

export const Sizes: Story = {
  render: () =>
    preview(() =>
      h(Stack, { gap: "sm", style: { maxWidth: "30rem" } }, () =>
        (["xs", "sm", "md", "lg", "xl"] as const).map((size) =>
          h(TextInput, {
            key: size,
            label: `Size ${size}`,
            size,
            modelValue: "Geometry scales with size",
          }),
        ),
      ),
    ),
};

export const States: Story = {
  render: () =>
    preview(() =>
      h(Stack, { gap: "md", style: { maxWidth: "30rem" } }, () => [
        h(TextInput, { label: "Default", modelValue: "Editable" }),
        h(TextInput, {
          label: "Error",
          description: "Description remains connected.",
          error: "This value is invalid.",
          modelValue: "Invalid",
        }),
        h(TextInput, {
          label: "Disabled",
          modelValue: "Disabled",
          disabled: true,
        }),
        h(TextInput, {
          label: "Read only",
          modelValue: "Focusable",
          readonly: true,
        }),
      ]),
    ),
};

export const Customization: Story = {
  render: () =>
    preview(() =>
      h(TextInput, {
        label: "Part styling",
        description:
          "class/style target the outer root; classNames/styles target parts.",
        modelValue: "Custom field",
        style: {
          maxWidth: "30rem",
          "--dui-field-control-height": "3.25rem",
        },
        classNames: {
          label: "storybook-custom-label",
          wrapper: "storybook-custom-wrapper",
          input: "storybook-custom-input",
        },
        styles: {
          wrapper: { borderWidth: "2px" },
          input: { letterSpacing: "0.02em" },
        },
      }),
    ),
};
