import {
  Checkbox,
  Group,
  Radio,
  SegmentedControl,
  Stack,
  Switch,
  Text,
  Title,
} from "@doctui/core";
import type { Meta, StoryObj } from "@storybook/vue3-vite";
import { h, ref } from "vue";
import { preview } from "./story-helpers";

const meta = {
  title: "Inputs/Control visuals",
  parameters: {
    docs: {
      description: {
        component:
          "Visual regression targets for Checkbox, Radio, Switch and SegmentedControl. Review the complete size scale, checked states, disabled treatment, error borders, focus rings and composed alignment together.",
      },
    },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

const sizes = ["xs", "sm", "md", "lg", "xl"] as const;

export const SizeMatrix: Story = {
  render: () =>
    preview(() =>
      h(Stack, { gap: "lg", style: { maxWidth: "64rem" } }, () => [
        h(Title, { order: 3 }, () => "Control size matrix"),
        h(
          Text,
          { muted: true, size: "sm" },
          () =>
            "Every row must visibly scale while keeping labels, native semantics and control alignment consistent.",
        ),
        ...sizes.map((size) =>
          h(Stack, { gap: "xs" }, () => [
            h(Text, { weight: 600 }, () => size.toUpperCase()),
            h(Group, { gap: "lg", align: "center" }, () => [
              h(Checkbox, {
                label: "Unchecked",
                size,
                modelValue: false,
              }),
              h(Checkbox, {
                label: "Checked",
                size,
                modelValue: true,
              }),
              h(Radio, {
                name: `visual-size-${size}`,
                value: "selected",
                modelValue: "selected",
                label: "Selected",
                size,
              }),
              h(Switch, {
                label: "Off",
                size,
                modelValue: false,
              }),
              h(Switch, {
                label: "On",
                size,
                modelValue: true,
              }),
              h(SegmentedControl, {
                ariaLabel: `${size} density example`,
                size,
                modelValue: "comfortable",
                data: [
                  { value: "compact", label: "Compact" },
                  { value: "comfortable", label: "Comfortable" },
                  { value: "spacious", label: "Spacious" },
                ],
              }),
            ]),
          ]),
        ),
      ]),
    ),
};

export const StateMatrix: Story = {
  render: () =>
    preview(() => {
      const checked = ref(true);
      const plan = ref<string | number>("pro");
      const density = ref<string | number>("comfortable");

      return h(Stack, { gap: "xl", style: { maxWidth: "54rem" } }, () => [
        h(Title, { order: 3 }, () => "Control state matrix"),
        h(Stack, { gap: "sm" }, () => [
          h(Text, { weight: 600 }, () => "Checkbox"),
          h(Group, { gap: "lg", align: "center" }, () => [
            h(Checkbox, {
              label: "Interactive",
              modelValue: checked.value,
              "onUpdate:modelValue": (value: boolean) =>
                (checked.value = value),
            }),
            h(Checkbox, { label: "Unchecked", modelValue: false }),
            h(Checkbox, {
              label: "Disabled checked",
              modelValue: true,
              disabled: true,
            }),
            h(Checkbox, {
              label: "Error state",
              modelValue: false,
              error: "This option is required",
            }),
          ]),
        ]),
        h(Stack, { gap: "sm" }, () => [
          h(Text, { weight: 600 }, () => "Radio"),
          h(Group, { gap: "lg", align: "center" }, () => [
            h(Radio, {
              name: "visual-plan",
              value: "free",
              label: "Free",
              modelValue: plan.value,
              "onUpdate:modelValue": (value: string | number) =>
                (plan.value = value),
            }),
            h(Radio, {
              name: "visual-plan",
              value: "pro",
              label: "Pro",
              modelValue: plan.value,
              "onUpdate:modelValue": (value: string | number) =>
                (plan.value = value),
            }),
            h(Radio, {
              name: "visual-plan",
              value: "team",
              label: "Team disabled",
              modelValue: plan.value,
              disabled: true,
            }),
            h(Radio, {
              name: "visual-plan-error",
              value: "error",
              label: "Error state",
              modelValue: "none",
              error: "Choose a plan",
            }),
          ]),
        ]),
        h(Stack, { gap: "sm" }, () => [
          h(Text, { weight: 600 }, () => "Switch"),
          h(Group, { gap: "lg", align: "center" }, () => [
            h(Switch, { label: "Off", modelValue: false }),
            h(Switch, { label: "On", modelValue: true }),
            h(Switch, {
              label: "Disabled on",
              modelValue: true,
              disabled: true,
            }),
            h(Switch, {
              label: "Error state",
              modelValue: false,
              error: "Required setting",
            }),
          ]),
        ]),
        h(Stack, { gap: "sm" }, () => [
          h(Text, { weight: 600 }, () => "SegmentedControl"),
          h(Group, { gap: "lg", align: "center" }, () => [
            h(SegmentedControl, {
              ariaLabel: "Interactive density",
              modelValue: density.value,
              data: [
                { value: "compact", label: "Compact" },
                { value: "comfortable", label: "Comfortable" },
                { value: "spacious", label: "Spacious", disabled: true },
              ],
              "onUpdate:modelValue": (value: string | number) =>
                (density.value = value),
            }),
            h(SegmentedControl, {
              ariaLabel: "Disabled density",
              modelValue: "comfortable",
              disabled: true,
              data: [
                { value: "compact", label: "Compact" },
                { value: "comfortable", label: "Comfortable" },
              ],
            }),
          ]),
        ]),
      ]);
    }),
};
