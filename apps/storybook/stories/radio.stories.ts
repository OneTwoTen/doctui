import { Group, Radio, Stack } from "@doctui/core";
import type { Meta, StoryObj } from "@storybook/vue3-vite";
import { h, ref } from "vue";
import { preview } from "./story-helpers";

const sizeOptions = ["xs", "sm", "md", "lg", "xl"] as const;

const meta = {
  title: "Inputs/Radio",
  component: Radio,
  args: {
    name: "plan-story",
    value: "pro",
    label: "Pro",
    modelValue: "pro",
    size: "md",
    required: false,
    disabled: false,
  },
  argTypes: {
    modelValue: { control: "text" },
    value: { control: "text" },
    name: { control: "text" },
    label: { control: "text" },
    description: { control: "text" },
    error: { control: "text" },
    size: { control: "select", options: sizeOptions },
    required: { control: "boolean" },
    disabled: { control: "boolean" },
    classNames: { control: "object" },
    styles: { control: "object" },
  },
} satisfies Meta<typeof Radio>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Basic: Story = {
  render: (args) =>
    preview(() => {
      const selected = ref<string | number>(args.modelValue ?? "");
      return h(Radio, {
        ...args,
        modelValue: selected.value,
        "onUpdate:modelValue": (next: string | number) => (selected.value = next),
      });
    }),
};

export const Grouped: Story = {
  render: (args) =>
    preview(() => {
      const plan = ref("pro");
      return h(Group, { gap: "md" }, () =>
        ["free", "pro", "team"].map((value) =>
          h(Radio, {
            ...args,
            key: value,
            name: "plan-group-story",
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
  render: (args) =>
    preview(() =>
      h(Group, { gap: "lg", align: "center" }, () =>
        sizeOptions.map((size) =>
          h(Radio, {
            ...args,
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
  render: (args) =>
    preview(() =>
      h(Stack, { gap: "md" }, () => [
        h(Radio, {
          ...args,
          name: "state-a",
          value: "a",
          label: "Checked",
          modelValue: "a",
        }),
        h(Radio, {
          ...args,
          name: "state-b",
          value: "b",
          label: "Error",
          modelValue: "a",
          error: "Choose an available option.",
        }),
        h(Radio, {
          ...args,
          name: "state-c",
          value: "c",
          label: "Disabled",
          modelValue: "c",
          disabled: true,
        }),
      ]),
    ),
};
