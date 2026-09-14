import { Button, Group, Stack, TagsInput, Text } from "@doctui/core";
import type { Meta, StoryObj } from "@storybook/vue3-vite";
import { ref } from "vue";

const meta = {
  title: "Inputs/TagsInput",
  component: TagsInput,
  tags: ["autodocs"],
  args: {
    id: "topics",
    label: "Topics",
    placeholder: "Add a topic",
    clearable: true,
    separator: ",",
    maxTags: 6,
  },
  argTypes: {
    disabled: { control: "boolean" },
    readonly: { control: "boolean" },
    clearable: { control: "boolean" },
    required: { control: "boolean" },
    separator: { control: "text" },
    maxTags: { control: "number" },
    size: { control: "select", options: ["xs", "sm", "md", "lg", "xl"] },
    radius: { control: "select", options: ["xs", "sm", "md", "lg", "xl"] },
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

export const SizeMatrix: Story = {
  render: () => ({
    components: { Stack, TagsInput },
    setup() {
      const xs = ref(["Vue", "Rust"]);
      const sm = ref(["Vue", "Rust"]);
      const md = ref(["Vue", "Rust"]);
      const lg = ref(["Vue", "Rust"]);
      const xl = ref(["Vue", "Rust"]);
      return { xs, sm, md, lg, xl };
    },
    template: `
      <Stack gap="md">
        <TagsInput v-model="xs" size="xs" label="Extra small" clearable />
        <TagsInput v-model="sm" size="sm" label="Small" clearable />
        <TagsInput v-model="md" size="md" label="Medium" clearable />
        <TagsInput v-model="lg" size="lg" label="Large" clearable />
        <TagsInput v-model="xl" size="xl" label="Extra large" clearable />
      </Stack>
    `,
  }),
};

export const StateMatrix: Story = {
  render: () => ({
    components: { Stack, TagsInput, Text },
    setup() {
      const normal = ref(["Vue", "TypeScript"]);
      const limited = ref(["Vue", "Rust"]);
      return { normal, limited };
    },
    template: `
      <Stack gap="md">
        <TagsInput v-model="normal" label="Normal" description="Comma commits a tag" clearable />
        <TagsInput :model-value="['Vue']" label="Read only" readonly clearable />
        <TagsInput :model-value="['Vue']" label="Disabled" disabled clearable />
        <TagsInput v-model="limited" label="Max 2 tags" :max-tags="2" error="Maximum reached" clearable />
        <Text size="sm">Use Backspace in an empty input to remove the last tag. Click the control surface to return focus to the editor.</Text>
      </Stack>
    `,
  }),
};

export const NativeFormSubmission: Story = {
  render: () => ({
    components: { Button, Stack, TagsInput, Text },
    setup() {
      const skills = ref(["Vue", "Accessibility"]);
      const submitted = ref<string[]>([]);
      const submit = (event: Event) => {
        const form = event.currentTarget as HTMLFormElement;
        submitted.value = new FormData(form)
          .getAll("skills")
          .map((value) => String(value));
      };
      return { skills, submitted, submit };
    },
    template: `
      <form @submit.prevent="submit">
        <Stack gap="md">
          <TagsInput
            id="form-skills"
            v-model="skills"
            name="skills"
            label="Skills"
            description="Only committed tags are submitted"
            placeholder="Type a draft without committing it"
            clearable
          />
          <Group>
            <Button type="submit">Read FormData</Button>
            <Text size="sm">Submitted: {{ submitted.length ? submitted.join(', ') : 'Nothing submitted yet' }}</Text>
          </Group>
        </Stack>
      </form>
    `,
  }),
};

export const MultiCharacterSeparator: Story = {
  render: () => ({
    components: { Stack, TagsInput, Text },
    setup() {
      const value = ref(["Design"]);
      return { value };
    },
    template: `
      <Stack gap="sm">
        <TagsInput
          id="skills-pipe"
          v-model="value"
          label="Skills"
          separator="||"
          placeholder="Type Design || Vue || Rust"
          clearable
        />
        <Text size="sm">Multi-character separators are parsed from typed or pasted input. Enter always commits the current draft.</Text>
      </Stack>
    `,
  }),
};

export const AdvancedComposition: Story = {
  render: () => ({
    components: { Group, Stack, TagsInput, Text },
    setup() {
      const skills = ref(["Vue", "Accessibility"]);
      const interests = ref(["Design systems"]);
      return { skills, interests };
    },
    template: `
      <Stack gap="lg">
        <Text as="strong">Profile taxonomy</Text>
        <Group align="flex-start" gap="lg">
          <TagsInput
            id="profile-skills"
            v-model="skills"
            label="Skills"
            description="Comma-separated, up to five"
            :max-tags="5"
            clearable
          />
          <TagsInput
            id="profile-interests"
            v-model="interests"
            label="Interests"
            separator="||"
            description="Paste multiple values with ||"
            clearable
          />
        </Group>
        <Text size="sm">Skills: {{ skills.join(', ') }} · Interests: {{ interests.join(', ') }}</Text>
      </Stack>
    `,
  }),
};
