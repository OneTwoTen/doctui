import { Stack, TextInput, Title } from "@doctui/core";
import type { Meta, StoryObj } from "@storybook/vue3-vite";
import { h, ref } from "vue";
import { preview } from "./story-helpers";

const meta = { title: "Inputs/TextInput" } satisfies Meta;
export default meta;
type Story = StoryObj<typeof meta>;

export const States: Story = {
  render: () =>
    preview(() =>
      h(Stack, { gap: "md" }, () => [
        h(Title, { order: 3 }, () => "Text input states"),
        h(TextInput, {
          label: "Name",
          placeholder: "Ada Lovelace",
          required: true,
        }),
        h(TextInput, {
          label: "Email",
          description: "Use your work address.",
          leftSection: "@",
        }),
        h(TextInput, {
          label: "Invalid value",
          error: "Enter a valid email address.",
          modelValue: "not-an-email",
        }),
        h(TextInput, {
          label: "Unavailable",
          disabled: true,
          modelValue: "Disabled",
        }),
      ]),
    ),
};

export const Controlled: Story = {
  render: () => {
    const value = ref("");
    return preview(() =>
      h(TextInput, {
        label: "Search",
        modelValue: value.value,
        "onUpdate:modelValue": (next: string) => {
          value.value = next;
        },
        rightSection: "⌕",
      }),
    );
  },
};
