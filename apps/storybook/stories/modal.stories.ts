import { Button, Modal, Stack, Text } from "@doctui/core";
import type { Meta, StoryObj } from "@storybook/vue3-vite";
import { defineComponent, h, ref } from "vue";
import { preview } from "./story-helpers";

const meta = { title: "Overlays/Modal" } satisfies Meta;
export default meta;
type Story = StoryObj<typeof meta>;

const ModalDemo = defineComponent({
  setup() {
    const open = ref(false);
    return () =>
      h(Stack, { gap: "md", style: { maxWidth: "24rem" } }, () => [
        h(Button, { onClick: () => (open.value = true) }, () => "Open dialog"),
        h(
          Text,
          { size: "sm", muted: true },
          () => "Try Tab, Shift+Tab, Escape, or click the backdrop.",
        ),
        h(
          Modal,
          {
            modelValue: open.value,
            title: "Review changes",
            "onUpdate:modelValue": (value: boolean) => (open.value = value),
          },
          {
            default: () =>
              h(Stack, { gap: "md" }, () => [
                h(Text, null, () => "Your changes are ready to publish."),
                h(
                  Button,
                  { onClick: () => (open.value = false), color: "success" },
                  () => "Publish",
                ),
              ]),
          },
        ),
      ]);
  },
});

export const Default: Story = {
  render: () => preview(() => h(ModalDemo)),
};
