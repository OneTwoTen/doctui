import {
  Checkbox,
  Group,
  NumberInput,
  PasswordInput,
  Radio,
  SegmentedControl,
  Stack,
  Switch,
  Text,
  Textarea,
  TextInput,
  Title,
} from "@doctui/core";
import type { Meta, StoryObj } from "@storybook/vue3-vite";
import { h, ref } from "vue";
import { preview } from "./story-helpers";

const meta = { title: "Inputs/Field contract" } satisfies Meta;
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

export const StateMatrix: Story = {
  render: () =>
    preview(() =>
      h(Stack, { gap: "lg", style: { maxWidth: "34rem" } }, () => [
        h(Title, { order: 3 }, () => "Field state matrix"),
        h(
          Text,
          { muted: true, size: "sm" },
          () =>
            "Description and error text stay connected to the native control. Root class/style remain available for layout styling.",
        ),
        h(TextInput, {
          id: "storybook-email",
          class: "storybook-field",
          style: { maxWidth: "26rem" },
          name: "email",
          autocomplete: "email",
          label: "Email",
          description: "Used for account notifications.",
          error: "Enter a valid email address.",
          modelValue: "not-an-email",
          required: true,
          "aria-describedby": "storybook-email-extra",
        }),
        h(
          "p",
          {
            id: "storybook-email-extra",
            style: { margin: 0, fontSize: "0.875rem" },
          },
          "Extra consumer-provided help text.",
        ),
        h(Textarea, {
          label: "Read-only notes",
          description: "Read-only text fields remain keyboard focusable.",
          modelValue: "This value can be copied but not edited.",
          readonly: true,
          size: "lg",
        }),
        h(NumberInput, {
          label: "Compact quantity",
          modelValue: 3,
          min: 1,
          max: 10,
          size: "sm",
        }),
        h(Stack, { gap: "sm" }, () => [
          h(Text, { weight: 600 }, () => "Native control sizes"),
          h(Group, { gap: "lg", align: "center" }, () => [
            h(Checkbox, { label: "Small", size: "sm", modelValue: true }),
            h(Checkbox, { label: "Medium", size: "md", modelValue: true }),
            h(Checkbox, { label: "Large", size: "lg", modelValue: true }),
          ]),
          h(Group, { gap: "lg", align: "center" }, () => [
            h(Radio, {
              label: "Small",
              name: "size-radio",
              value: "sm",
              modelValue: "lg",
              size: "sm",
            }),
            h(Radio, {
              label: "Large",
              name: "size-radio",
              value: "lg",
              modelValue: "lg",
              size: "lg",
            }),
          ]),
          h(Group, { gap: "lg", align: "center" }, () => [
            h(Switch, { label: "Small", size: "sm", modelValue: true }),
            h(Switch, { label: "Large", size: "lg", modelValue: true }),
            h(Switch, {
              label: "Disabled",
              size: "lg",
              modelValue: true,
              disabled: true,
            }),
          ]),
        ]),
      ]),
    ),
};

export const ComposedProfileForm: Story = {
  render: () =>
    preview(() => {
      const name = ref("Ada Lovelace");
      const age = ref<number | null>(36);
      const bio = ref("Mathematician and writer");
      const privateProfile = ref(false);
      const newsletter = ref(true);
      const visibility = ref("team");

      return h(
        Stack,
        {
          gap: "md",
          style: {
            maxWidth: "32rem",
            padding: "1rem",
            border: "1px solid var(--dui-color-border)",
            borderRadius: "var(--dui-radius-md)",
          },
        },
        () => [
          h(Title, { order: 3 }, () => "Profile settings"),
          h(TextInput, {
            label: "Display name",
            name: "display-name",
            modelValue: name.value,
            required: true,
            "onUpdate:modelValue": (value: string) => (name.value = value),
          }),
          h(NumberInput, {
            label: "Age",
            name: "age",
            modelValue: age.value,
            min: 0,
            max: 130,
            "onUpdate:modelValue": (value: number | null) =>
              (age.value = value),
          }),
          h(Textarea, {
            label: "Bio",
            name: "bio",
            modelValue: bio.value,
            rows: 4,
            "onUpdate:modelValue": (value: string) => (bio.value = value),
          }),
          h(Checkbox, {
            label: "Private profile",
            name: "private-profile",
            modelValue: privateProfile.value,
            "onUpdate:modelValue": (value: boolean) =>
              (privateProfile.value = value),
          }),
          h(Switch, {
            label: "Email newsletter",
            name: "newsletter",
            modelValue: newsletter.value,
            "onUpdate:modelValue": (value: boolean) =>
              (newsletter.value = value),
          }),
          h(Text, { weight: 600 }, () => "Profile visibility"),
          h(Group, { gap: "md" }, () =>
            ["private", "team", "public"].map((value) =>
              h(Radio, {
                name: "visibility",
                value,
                label: value[0]?.toUpperCase() + value.slice(1),
                modelValue: visibility.value,
                "onUpdate:modelValue": (next: string | number) =>
                  (visibility.value = String(next)),
              }),
            ),
          ),
        ],
      );
    }),
};
