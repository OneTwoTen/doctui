import {
  Checkbox,
  Group,
  NumberInput,
  PasswordInput,
  Radio,
  SegmentedControl,
  Stack,
  Switch,
  Textarea,
  TextInput,
} from "@doctui/core";
import type { Meta, StoryObj } from "@storybook/vue3-vite";
import { h, ref } from "vue";
import { preview } from "./story-helpers";

const meta = { title: "Inputs/Textarea" } satisfies Meta;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () =>
    preview(() => {
      const email = ref("");
      const amount = ref<number | null>(10);
      const accepted = ref(false);
      const plan = ref("pro");
      return h(Stack, { gap: "md", style: { maxWidth: "30rem" } }, () => [
        h(TextInput, {
          label: "Email",
          modelValue: email.value,
          clearable: true,
          "onUpdate:modelValue": (value: string) => (email.value = value),
        }),
        h(Textarea, {
          label: "Notes",
          placeholder: "Add context",
          "onUpdate:modelValue": () => undefined,
        }),
        h(NumberInput, {
          label: "Seats",
          modelValue: amount.value,
          min: 1,
          max: 100,
          "onUpdate:modelValue": (value: number | null) =>
            (amount.value = value),
        }),
        h(PasswordInput, { label: "Password", clearable: true }),
        h(Group, { gap: "md" }, () => [
          h(Checkbox, {
            label: "Accept terms",
            modelValue: accepted.value,
            "onUpdate:modelValue": (value: boolean) => (accepted.value = value),
          }),
          h(Switch, {
            label: "Enabled",
            modelValue: accepted.value,
            "onUpdate:modelValue": (value: boolean) => (accepted.value = value),
          }),
        ]),
        h(Group, { gap: "sm" }, () => [
          h(Radio, {
            name: "plan",
            value: "free",
            modelValue: plan.value,
            label: "Free",
            "onUpdate:modelValue": (value: string | number) =>
              (plan.value = String(value)),
          }),
          h(Radio, {
            name: "plan",
            value: "pro",
            modelValue: plan.value,
            label: "Pro",
            "onUpdate:modelValue": (value: string | number) =>
              (plan.value = String(value)),
          }),
        ]),
        h(SegmentedControl, {
          ariaLabel: "Plan",
          data: [
            { value: "free", label: "Free" },
            { value: "pro", label: "Pro" },
          ],
          modelValue: plan.value,
          "onUpdate:modelValue": (value: string | number) =>
            (plan.value = String(value)),
        }),
      ]);
    }),
};
