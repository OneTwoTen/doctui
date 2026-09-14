import {
  Autocomplete,
  Group,
  MultiSelect,
  Select,
  Stack,
  Text,
  Title,
} from "@doctui/core";
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
  title: "Inputs/Select",
  component: Select,
  args: {
    id: "framework",
    label: "Framework",
    data,
    modelValue: "vue",
    clearable: true,
    disabled: false,
    required: false,
    size: "md",
    radius: "md",
  },
  argTypes: {
    id: { control: "text" },
    label: { control: "text" },
    description: { control: "text" },
    error: { control: "text" },
    placeholder: { control: "text" },
    ariaLabel: { control: "text" },
    nothingFound: { control: "text" },
    modelValue: { control: "text" },
    clearable: { control: "boolean" },
    disabled: { control: "boolean" },
    required: { control: "boolean" },
    size: { control: "select", options: ["xs", "sm", "md", "lg", "xl"] },
    radius: {
      control: "select",
      options: ["xs", "sm", "md", "lg", "xl"],
    },
    data: { control: "object" },
  },
  parameters: {
    docs: {
      description: {
        component:
          "Select, Autocomplete and MultiSelect share the same focus-managed Combobox engine. Focus stays on the native input while aria-activedescendant tracks the active enabled option.",
      },
    },
  },
} satisfies Meta<typeof Select>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) =>
    preview(() =>
      h(Select, {
        ...args,
        style: { maxWidth: "28rem" },
      }),
    ),
};

export const KeyboardAndFilteringMatrix: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Keep DOM focus on each combobox input. Arrow keys, Home and End update aria-activedescendant while skipping disabled options; filtering never leaves a stale active descendant; Escape closes without moving input focus.",
      },
    },
  },
  render: () =>
    preview(() => {
      const framework = ref<string | number | null>(null);
      const search = ref("");
      const selectedMany = ref<readonly (string | number)[]>(["vue"]);

      return h(Stack, { gap: "lg", style: { maxWidth: "34rem" } }, () => [
        h(Title, { order: 3 }, () => "Combobox keyboard matrix"),
        h(
          Text,
          { size: "sm", muted: true },
          () =>
            "React is disabled. Try Arrow keys, Home/End and filtering down to a single result.",
        ),
        h(Select, {
          id: "keyboard-select",
          label: "Single selection",
          description: "The disabled option is skipped by keyboard navigation.",
          data,
          modelValue: framework.value,
          clearable: true,
          "onUpdate:modelValue": (value: string | number | null) =>
            (framework.value = value),
        }),
        h(Autocomplete, {
          id: "keyboard-autocomplete",
          label: "Filter frameworks",
          data,
          modelValue: search.value,
          clearable: true,
          nothingFound: "No framework matches",
          "onUpdate:modelValue": (value: string) => (search.value = value),
        }),
        h(MultiSelect, {
          id: "keyboard-multi",
          label: "Compare frameworks",
          description:
            "Backspace removes the last value when the query is empty.",
          data,
          modelValue: selectedMany.value,
          clearable: true,
          "onUpdate:modelValue": (value: readonly (string | number)[]) =>
            (selectedMany.value = value),
        }),
      ]);
    }),
};

export const AccessibleNameAndEmptyStates: Story = {
  render: () =>
    preview(() =>
      h(Stack, { gap: "md", style: { maxWidth: "30rem" } }, () => [
        h(Select, {
          id: "visible-label-select",
          label: "Visible label",
          data,
          modelValue: null,
        }),
        h(Select, {
          id: "aria-only-select",
          ariaLabel: "Framework without visible label",
          placeholder: "ARIA-labelled control",
          data,
          modelValue: null,
        }),
        h(Autocomplete, {
          id: "empty-autocomplete",
          label: "Empty result",
          data,
          modelValue: "",
          nothingFound: "No matching framework",
        }),
      ]),
    ),
};

export const AdvancedProjectFilters: Story = {
  render: () =>
    preview(() => {
      const framework = ref<string | number | null>("vue");
      const compare = ref<readonly (string | number)[]>(["vue", "svelte"]);

      return h(Stack, { gap: "lg", style: { maxWidth: "48rem" } }, () => [
        h(Title, { order: 3 }, () => "Project filters"),
        h(
          Text,
          { muted: true },
          () =>
            "A realistic composition keeps single and multi-value filters on the same interaction contract.",
        ),
        h(Group, { gap: "lg", align: "flex-start" }, () => [
          h(Select, {
            id: "project-framework",
            label: "Primary framework",
            data,
            modelValue: framework.value,
            clearable: true,
            "onUpdate:modelValue": (value: string | number | null) =>
              (framework.value = value),
          }),
          h(MultiSelect, {
            id: "project-compare",
            label: "Compare with",
            data,
            modelValue: compare.value,
            clearable: true,
            "onUpdate:modelValue": (value: readonly (string | number)[]) =>
              (compare.value = value),
          }),
        ]),
      ]);
    }),
};
