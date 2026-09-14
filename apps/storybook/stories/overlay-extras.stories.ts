import { Button, Menu, Popover, Stack, Text, Tooltip } from "@doctui/core";
import type { Meta, StoryObj } from "@storybook/vue3-vite";
import { defineComponent, h, ref } from "vue";
import { preview } from "./story-helpers";

const meta = {
  title: "Overlays/Compositions",
  parameters: { controls: { disable: true } },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

const NestedInteractionDemo = defineComponent({
  setup() {
    const popoverOpen = ref(false);
    const menuOpen = ref(false);

    return () =>
      h(Stack, { gap: "md", style: { minHeight: "18rem" } }, () => [
        h(
          Text,
          null,
          () =>
            "Composition stories intentionally disable Controls. Use the dedicated Drawer, Menu, Popover and Tooltip stories to edit component props.",
        ),
        h(
          Popover,
          {
            modelValue: popoverOpen.value,
            "onUpdate:modelValue": (value: boolean) => {
              popoverOpen.value = value;
              if (!value) menuOpen.value = false;
            },
          },
          {
            target: () => h(Button, null, () => "Open workspace actions"),
            default: () =>
              h(Stack, { gap: "sm" }, () => [
                h(Text, { weight: 600 }, () => "Workspace actions"),
                h(
                  Menu,
                  {
                    modelValue: menuOpen.value,
                    data: [
                      { value: "share", label: "Share" },
                      { value: "export", label: "Export" },
                      { value: "delete", label: "Delete", disabled: true },
                    ],
                    "onUpdate:modelValue": (value: boolean) =>
                      (menuOpen.value = value),
                  },
                  { target: () => h(Button, null, () => "More actions") },
                ),
                h(Tooltip, { label: "Keyboard-accessible helper" }, () =>
                  h(Button, null, () => "Help"),
                ),
              ]),
          },
        ),
      ]);
  },
});

export const PopoverMenuTooltip: Story = {
  render: () => preview(() => h(NestedInteractionDemo)),
};
