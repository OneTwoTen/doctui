import { Button, Stack, Text, TextInput } from "@doctui/core";
import { useForm } from "@doctui/form";
import {
  createNotifications,
  Notifications as NotificationsView,
} from "@doctui/notifications";
import type { Meta, StoryObj } from "@storybook/vue3-vite";
import { defineComponent, h } from "vue";
import { preview } from "./story-helpers";

const meta = { title: "Feature packages" } satisfies Meta;
export default meta;
type Story = StoryObj<typeof meta>;

const FormDemo = defineComponent({
  setup() {
    const form = useForm({
      initialValues: { email: "" },
      validate: {
        email: (value) =>
          value.includes("@") ? undefined : "Enter a valid email",
      },
    });

    return () =>
      h(Stack, { gap: "sm", style: { maxWidth: "24rem" } }, () => [
        h(Text, { size: "sm", muted: true }, () => "Vue-first form state"),
        h(TextInput, {
          label: "Email",
          modelValue: form.values.email,
          ...(form.errors.email ? { error: form.errors.email } : {}),
          "onUpdate:modelValue": (value: string) =>
            form.setFieldValue("email", value),
        }),
        h(
          Button,
          { onClick: () => form.submit(async () => undefined) },
          () => "Submit",
        ),
      ]);
  },
});

const NotificationsDemo = defineComponent({
  setup() {
    const store = createNotifications({ position: "top-end" });
    return () =>
      h(Stack, { gap: "sm", style: { minHeight: "10rem" } }, () => [
        h(
          Button,
          {
            onClick: () =>
              store.show({
                title: "Saved",
                message: "Your preferences have been updated.",
                color: "success",
                autoClose: false,
              }),
          },
          () => "Show notification",
        ),
        h(NotificationsView, { store }),
      ]);
  },
});

export const Form: Story = { render: () => preview(() => h(FormDemo)) };
export const Notifications: Story = {
  render: () => preview(() => h(NotificationsDemo)),
};
