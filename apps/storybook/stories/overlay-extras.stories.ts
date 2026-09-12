import {
  Button,
  Drawer,
  Menu,
  Popover,
  Stack,
  Text,
  Tooltip,
} from "@doctui/core";
import type { Meta, StoryObj } from "@storybook/vue3-vite";
import { defineComponent, h, ref } from "vue";
import { preview } from "./story-helpers";

const meta = { title: "Overlays/Extended" } satisfies Meta;
export default meta;
type Story = StoryObj<typeof meta>;

const Demo = defineComponent({
  setup() {
    const drawerOpen = ref(false);
    const menuOpen = ref(false);
    const popoverOpen = ref(false);
    return () =>
      h(Stack, { gap: "md", style: { minHeight: "14rem" } }, () => [
        h(
          Button,
          { onClick: () => (drawerOpen.value = true) },
          () => "Open drawer",
        ),
        h(
          Menu,
          {
            modelValue: menuOpen.value,
            data: [
              { value: "edit", label: "Edit" },
              { value: "archive", label: "Archive" },
              { value: "delete", label: "Delete", disabled: true },
            ],
            "onUpdate:modelValue": (value: boolean) => (menuOpen.value = value),
          },
          { target: () => h(Button, null, () => "Actions") },
        ),
        h(
          Popover,
          {
            modelValue: popoverOpen.value,
            "onUpdate:modelValue": (value: boolean) =>
              (popoverOpen.value = value),
          },
          {
            target: () => h(Button, null, () => "Show details"),
            default: () => h(Text, null, () => "Contextual content"),
          },
        ),
        h(Tooltip, { label: "Non-critical helper text" }, () =>
          h(Button, null, () => "Hover or focus"),
        ),
        h(
          Drawer,
          {
            modelValue: drawerOpen.value,
            title: "Filters",
            "onUpdate:modelValue": (value: boolean) =>
              (drawerOpen.value = value),
          },
          { default: () => h(Text, null, () => "Drawer content") },
        ),
      ]);
  },
});

export const Default: Story = { render: () => preview(() => h(Demo)) };
