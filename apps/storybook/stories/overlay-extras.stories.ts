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
type DrawerSize = "xs" | "sm" | "md" | "lg" | "xl";
type DrawerPosition = "left" | "right";

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

const DrawerGeometryDemo = defineComponent({
  setup() {
    const open = ref(false);
    const size = ref<DrawerSize>("md");
    const position = ref<DrawerPosition>("right");

    const launch = (nextSize: DrawerSize, nextPosition: DrawerPosition) => {
      size.value = nextSize;
      position.value = nextPosition;
      open.value = true;
    };

    return () =>
      h(Stack, { gap: "md", style: { maxWidth: "48rem" } }, () => [
        h(
          Text,
          null,
          () => "Launch every Drawer size from either edge; width changes are token-backed.",
        ),
        h(
          "div",
          { style: { display: "flex", flexWrap: "wrap", gap: "0.5rem" } },
          (["xs", "sm", "md", "lg", "xl"] as const).flatMap((value) => [
            h(
              Button,
              { onClick: () => launch(value, "left") },
              () => `${value} left`,
            ),
            h(
              Button,
              { onClick: () => launch(value, "right") },
              () => `${value} right`,
            ),
          ]),
        ),
        h(
          Drawer,
          {
            modelValue: open.value,
            title: `${size.value.toUpperCase()} ${position.value} drawer`,
            size: size.value,
            position: position.value,
            "onUpdate:modelValue": (value: boolean) => (open.value = value),
          },
          {
            default: () =>
              h(Stack, { gap: "md" }, () => [
                h(
                  Text,
                  null,
                  () =>
                    "Press Escape or click the backdrop to verify the shared dismissal contract.",
                ),
                h(Button, { onClick: () => (open.value = false) }, () => "Close"),
              ]),
          },
        ),
      ]);
  },
});

export const Default: Story = { render: () => preview(() => h(Demo)) };

export const DrawerGeometry: Story = {
  render: () => preview(() => h(DrawerGeometryDemo)),
};
