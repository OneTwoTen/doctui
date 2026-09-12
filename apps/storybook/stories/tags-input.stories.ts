import { TagsInput } from "@doctui/core";
import type { Meta, StoryObj } from "@storybook/vue3-vite";
import { ref } from "vue";

const meta = {
  title: "Inputs/TagsInput",
  component: TagsInput,
  tags: ["autodocs"],
  args: {
    label: "Topics",
    placeholder: "Add a topic",
    clearable: true,
  },
} satisfies Meta<typeof TagsInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => ({
    components: { TagsInput },
    setup() {
      const value = ref(["Vue", "Accessibility"]);
      return { args, value };
    },
    template:
      '<TagsInput v-bind="args" v-model="value" /><p>Selected: {{ value.join(", ") }}</p>',
  }),
};
