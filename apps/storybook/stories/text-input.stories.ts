import { Stack, TextInput } from "@doctui/core";
import type { Meta, StoryObj } from "@storybook/vue3-vite";
import { h, ref } from "vue";
import { preview } from "./story-helpers";

const sizeOptions = ["xs", "sm", "md", "lg", "xl"] as const;

const meta = {
  title: "Inputs/TextInput",
  component: TextInput,
  args: {
    label: "Email",
    description: "Used for account notifications.",
    modelValue: "ada@example.com",
    placeholder: "name@example.com",
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
} satisfies Meta<typeof TextInput>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Basic: Story = {
  render: (args) =>
    preview(() => {
      const value = ref(args.modelValue ?? "");
      return h(TextInput, {
        ...args,
        modelValue: value.value,
        name: "email",
        autocomplete: "email",
        "onUpdate:modelValue": (next: string) => (value.value = next),
      });
    }),
};

export const Sizes: Story = {
  render: (args) =>
    preview(() =>
      h(Stack, { gap: "sm", style: { maxWidth: "30rem" } }, () =>
        sizeOptions.map((size) =>
          h(TextInput, {
            ...args,
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
  render: (args) =>
    preview(() =>
      h(Stack, { gap: "md", style: { maxWidth: "30rem" } }, () => [
        h(TextInput, { ...args, label: "Default", modelValue: "Editable" }),
        h(TextInput, {
          ...args,
          label: "Error",
          description: "Description remains connected.",
          error: "This value is invalid.",
          modelValue: "Invalid",
        }),
        h(TextInput, {
          ...args,
          label: "Disabled",
          modelValue: "Disabled",
          disabled: true,
        }),
        h(TextInput, {
          ...args,
          label: "Read only",
          modelValue: "Focusable",
          readonly: true,
        }),
      ]),
    ),
};

export const Customization: Story = {
  render: (args) =>
    preview(() =>
      h(TextInput, {
        ...args,
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
