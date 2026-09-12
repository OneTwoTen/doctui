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
} from "@doctui/core";
import type { Meta, StoryObj } from "@storybook/vue3-vite";
import { h, ref } from "vue";
import { preview } from "./story-helpers";

const meta = { title: "Inputs/Controls" } satisfies Meta;
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

export const KeyboardAndDisabledMatrix: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "SegmentedControl follows the radio-group keyboard model: Tab enters at one enabled option; Arrow keys, Home and End move and select while skipping disabled options; Enter and Space select the focused option. Native Checkbox, Radio and Switch keep browser keyboard semantics.",
      },
    },
  },
  render: () =>
    preview(() => {
      const view = ref<string | number | undefined>(undefined);
      const invalidView = ref<string | number>("missing");
      const enabled = ref(false);
      const plan = ref<string | number>("free");
      const data = [
        { value: "list", label: "List", disabled: true },
        { value: "grid", label: "Grid" },
        { value: "board", label: "Board" },
        { value: "table", label: "Table", disabled: true },
      ];

      return h(Stack, { gap: "lg", style: { maxWidth: "38rem" } }, () => [
        h(Stack, { gap: "xs" }, () => [
          h(Text, { weight: 600 }, () => "No initial selection"),
          h(SegmentedControl, {
            ariaLabel: "View without initial selection",
            data,
            ...(view.value === undefined ? {} : { modelValue: view.value }),
            "onUpdate:modelValue": (value: string | number) =>
              (view.value = value),
          }),
          h(Text, { size: "sm", muted: true }, () =>
            `Selected: ${String(view.value ?? "none")}`,
          ),
        ]),
        h(Stack, { gap: "xs" }, () => [
          h(Text, { weight: 600 }, () => "Invalid controlled value"),
          h(SegmentedControl, {
            ariaLabel: "View with invalid controlled value",
            data,
            modelValue: invalidView.value,
            "onUpdate:modelValue": (value: string | number) =>
              (invalidView.value = value),
          }),
        ]),
        h(Stack, { gap: "xs" }, () => [
          h(Text, { weight: 600 }, () => "Disabled group"),
          h(SegmentedControl, {
            ariaLabel: "Disabled view picker",
            data,
            modelValue: "grid",
            disabled: true,
          }),
        ]),
        h(Group, { gap: "lg" }, () => [
          h(Checkbox, {
            label: "Checkbox",
            size: "sm",
            modelValue: enabled.value,
            "onUpdate:modelValue": (value: boolean) => (enabled.value = value),
          }),
          h(Switch, {
            label: "Disabled switch",
            size: "lg",
            disabled: true,
            modelValue: true,
          }),
        ]),
        h(Group, { gap: "md" }, () => [
          h(Radio, {
            name: "keyboard-matrix-plan",
            value: "free",
            label: "Free",
            modelValue: plan.value,
            "onUpdate:modelValue": (value: string | number) =>
              (plan.value = value),
          }),
          h(Radio, {
            name: "keyboard-matrix-plan",
            value: "team",
            label: "Team (disabled)",
            disabled: true,
            modelValue: plan.value,
            "onUpdate:modelValue": (value: string | number) =>
              (plan.value = value),
          }),
          h(Radio, {
            name: "keyboard-matrix-plan",
            value: "pro",
            label: "Pro",
            modelValue: plan.value,
            "onUpdate:modelValue": (value: string | number) =>
              (plan.value = value),
          }),
        ]),
      ]);
    }),
};

export const AdvancedComposition: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "A compact preferences panel demonstrates native boolean controls and a radio-like SegmentedControl sharing controlled state without replacing browser semantics where native controls are sufficient.",
      },
    },
  },
  render: () =>
    preview(() => {
      const notifications = ref(true);
      const digest = ref(false);
      const density = ref<string | number>("comfortable");
      const visibility = ref<string | number>("team");

      return h(Stack, { gap: "lg", style: { maxWidth: "34rem" } }, () => [
        h(Text, { as: "h3", weight: 600 }, () => "Workspace preferences"),
        h(Group, { gap: "lg" }, () => [
          h(Switch, {
            label: "Notifications",
            modelValue: notifications.value,
            "onUpdate:modelValue": (value: boolean) =>
              (notifications.value = value),
          }),
          h(Checkbox, {
            label: "Weekly digest",
            modelValue: digest.value,
            "onUpdate:modelValue": (value: boolean) => (digest.value = value),
          }),
        ]),
        h(Stack, { gap: "xs" }, () => [
          h(Text, { weight: 600 }, () => "Density"),
          h(SegmentedControl, {
            ariaLabel: "Interface density",
            data: [
              { value: "compact", label: "Compact" },
              { value: "comfortable", label: "Comfortable" },
              { value: "spacious", label: "Spacious" },
            ],
            modelValue: density.value,
            "onUpdate:modelValue": (value: string | number) =>
              (density.value = value),
          }),
        ]),
        h(Stack, { gap: "xs" }, () => [
          h(Text, { weight: 600 }, () => "Default visibility"),
          h(Group, { gap: "md" }, () =>
            ["private", "team", "public"].map((value) =>
              h(Radio, {
                name: "workspace-visibility",
                value,
                label: value.charAt(0).toUpperCase() + value.slice(1),
                modelValue: visibility.value,
                "onUpdate:modelValue": (next: string | number) =>
                  (visibility.value = next),
              }),
            ),
          ),
        ]),
      ]);
    }),
};
