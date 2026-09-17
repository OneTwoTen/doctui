import { Combobox, Stack, Text } from "@doctui/core";
import type { Meta, StoryObj } from "@storybook/vue3-vite";
import { h, ref } from "vue";
import { preview } from "./story-helpers";

const data = [
  { value: "vue", label: "Vue" },
  { value: "react", label: "React", disabled: true },
  { value: "svelte", label: "Svelte" },
  { value: "solid", label: "Solid" },
];

const meta = {
  title: "Inputs/Combobox",
  component: Combobox,
  args: {
    id: "combobox-framework",
    label: "Framework",
    description: "React is disabled to demonstrate keyboard skipping.",
    data,
    searchable: true,
    clearable: true,
    placeholder: "Choose a framework",
    size: "md",
    radius: "md",
  },
  argTypes: {
    id: { control: "text" },
    label: { control: "text" },
    description: { control: "text" },
    error: { control: "text" },
    placeholder: { control: "text" },
    nothingFound: { control: "text" },
    searchable: { control: "boolean" },
    clearable: { control: "boolean" },
    disabled: { control: "boolean" },
    required: { control: "boolean" },
    multiple: { control: "boolean" },
    data: { control: "object" },
    size: { control: "select", options: ["xs", "sm", "md", "lg", "xl"] },
    radius: {
      control: "select",
      options: ["xs", "sm", "md", "lg", "xl"],
    },
  },
  parameters: {
    docs: {
      description: {
        component:
          "Combobox is the public focus-managed listbox engine behind Select, Autocomplete and MultiSelect. Use it directly when a custom selection surface still needs doctui's keyboard and aria-activedescendant contract.",
      },
    },
  },
} satisfies Meta<typeof Combobox>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) =>
    preview(() =>
      h(Combobox, {
        ...args,
        style: { maxWidth: "28rem" },
      }),
    ),
};

export const ControlledSelection: Story = {
  parameters: { controls: { disable: true } },
  render: () =>
    preview(() => {
      const selected = ref<string | number | null>("vue");

      return h(Stack, { gap: "sm", style: { maxWidth: "28rem" } }, () => [
        h(Combobox, {
          id: "controlled-combobox",
          label: "Primary framework",
          data,
          searchable: true,
          clearable: true,
          modelValue: selected.value,
          "onUpdate:modelValue": (
            value: string | number | readonly (string | number)[] | null,
          ) => {
            if (!Array.isArray(value)) selected.value = value;
          },
        }),
        h(
          Text,
          { size: "sm", muted: true },
          () => `Selected value: ${String(selected.value ?? "none")}`,
        ),
      ]);
    }),
};
