import { Group, Radio, Stack } from "@doctui/core";
import type { Meta, StoryObj } from "@storybook/vue3-vite";
import { h, ref } from "vue";
import { preview } from "./story-helpers";

const meta = { title: "Inputs/Radio" } satisfies Meta;
export default meta;
type Story = StoryObj<typeof meta>;

export const Basic: Story = {
  render: () =>
    preview(() => {
      const plan = ref("pro");
      return h(Group, { gap: "md" }, () =>
        ["free", "pro", "team"].map((value) =>
          h(Radio, {
            key: value,
            name: "plan-story",
            value,
            label: value[0]?.toUpperCase() + value.slice(1),
            modelValue: plan.value,
            "onUpdate:modelValue": (next: string | number) =>
              (plan.value = String(next)),
          }),
        ),
      );
    }),
};

export const Sizes: Story = {
  render: () =>
    preview(() =>
      h(Group, { gap: "lg", align: "center" }, () =>
        (["xs", "sm", "md", "lg", "xl"] as const).map((size) =>
          h(Radio, {
            key: size,
            name: "radio-size-story",
            value: size,
            label: size.toUpperCase(),
            size,
            modelValue: "md",
          }),
        ),
      ),
    ),
};

export const States: Story = {
  render: () =>
    preview(() =>
      h(Stack, { gap: "md" }, () => [
        h(Radio, { name: "state-a", value: "a", label: "Checked", modelValue: "a" }),
        h(Radio, { name: "state-b", value: "b", label: "Error", modelValue: "a", error: "Choose an available option." }),
        h(Radio, { name: "state-c", value: "c", label: "Disabled", modelValue: "c", disabled: true }),
      ]),
    ),
};
