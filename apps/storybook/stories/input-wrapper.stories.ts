import { Button, Group, InputWrapper, Stack, Text } from "@doctui/core";
import type { Meta, StoryObj } from "@storybook/vue3-vite";
import { h, ref } from "vue";
import { preview } from "./story-helpers";

const meta = {
  title: "Inputs/InputWrapper",
  component: InputWrapper,
  args: {
    id: "custom-email",
    label: "Email",
    description: "Used for account notifications.",
    required: true,
  },
  argTypes: {
    id: { control: "text" },
    label: { control: "text" },
    description: { control: "text" },
    error: { control: "text" },
    required: { control: "boolean" },
  },
} satisfies Meta<typeof InputWrapper>;

export default meta;
type Story = StoryObj<typeof meta>;

const nativeField = (id: string, describedBy?: string) =>
  h("input", {
    id,
    type: "email",
    placeholder: "you@example.com",
    "aria-describedby": describedBy,
    style: {
      boxSizing: "border-box",
      width: "100%",
      minHeight: "2.5rem",
      padding: "0 var(--dui-spacing-sm)",
      border: "1px solid var(--dui-color-border)",
      borderRadius: "var(--dui-radius-md)",
      background: "var(--dui-color-surface)",
      color: "var(--dui-color-text)",
    },
  });

export const Default: Story = {
  render: (args) =>
    preview(() =>
      h(
        InputWrapper,
        { ...args, style: { maxWidth: "28rem" } },
        {
          default: ({ id, describedBy }: { id: string; describedBy?: string }) =>
            nativeField(id, describedBy),
        },
      ),
    ),
};

export const ErrorState: Story = {
  args: {
    error: "Enter a valid email address.",
  },
  render: (args) =>
    preview(() =>
      h(
        InputWrapper,
        { ...args, style: { maxWidth: "28rem" } },
        {
          default: ({ id, describedBy }: { id: string; describedBy?: string }) =>
            h("input", {
              ...nativeField(id, describedBy).props,
              value: "invalid-email",
              "aria-invalid": "true",
            }),
        },
      ),
    ),
};

export const AdvancedComposition: Story = {
  parameters: { controls: { disable: true } },
  render: () =>
    preview(() => {
      const value = ref("team@doctui.dev");

      return h(Stack, { gap: "md", style: { maxWidth: "30rem" } }, () => [
        h(Text, { weight: 600 }, () => "Custom newsletter field"),
        h(
          InputWrapper,
          {
            id: "newsletter-email",
            label: "Notification email",
            description:
              "InputWrapper supplies the accessible label and message relationships while the consumer owns the native control.",
          },
          {
            default: ({ id, describedBy }: { id: string; describedBy?: string }) =>
              h("input", {
                ...nativeField(id, describedBy).props,
                value: value.value,
                onInput: (event: Event) => {
                  value.value = (event.target as HTMLInputElement).value;
                },
              }),
          },
        ),
        h(Group, { gap: "sm", justify: "end" }, () => [
          h(Button, { variant: "default" }, () => "Cancel"),
          h(Button, null, () => "Save preferences"),
        ]),
      ]);
    }),
};
