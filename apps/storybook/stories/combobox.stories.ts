import { Autocomplete, MultiSelect, Select, Stack, Text } from "@doctui/core";
import type { Meta, StoryObj } from "@storybook/vue3-vite";
import { defineComponent, h, ref } from "vue";
import { preview } from "./story-helpers";

const meta = { title: "Inputs/Select" } satisfies Meta;
export default meta;
type Story = StoryObj<typeof meta>;

const ComboboxDemo = defineComponent({
  setup() {
    const selected = ref<string | number | null>("vue");
    const search = ref("");
    const selectedMany = ref<readonly (string | number)[]>([]);
    const data = [
      { value: "vue", label: "Vue" },
      { value: "react", label: "React" },
      { value: "svelte", label: "Svelte" },
    ];
    return () =>
      h(Stack, { gap: "md", style: { maxWidth: "28rem" } }, () => [
        h(Select, {
          label: "Framework",
          data,
          modelValue: selected.value,
          clearable: true,
          "onUpdate:modelValue": (value: string | number | null) =>
            (selected.value = value),
        }),
        h(Autocomplete, {
          label: "Search framework",
          data,
          modelValue: search.value,
          "onUpdate:modelValue": (value: string) => (search.value = value),
        }),
        h(MultiSelect, {
          label: "Compare",
          data,
          modelValue: selectedMany.value,
          clearable: true,
          "onUpdate:modelValue": (value: readonly (string | number)[]) =>
            (selectedMany.value = value),
        }),
        h(
          Text,
          { size: "sm", muted: true },
          () =>
            "Arrow keys move through options; Enter selects; Escape closes.",
        ),
      ]);
  },
});

export const Default: Story = {
  render: () => preview(() => h(ComboboxDemo)),
};
