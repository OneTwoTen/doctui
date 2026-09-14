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
          () =>
            "Launch every Drawer size from either edge; width changes are token-backed.",
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
                h(
                  Button,
                  { onClick: () => (open.value = false) },
                  () => "Close",
                ),
              ]),
          },
        ),
      ]);
  },
});

const MenuKeyboardDemo = defineComponent({
  setup() {
    const open = ref(false);
    const selected = ref("Nothing selected");
    return () =>
      h(Stack, { gap: "md", style: { minHeight: "15rem" } }, () => [
        h(
          Text,
          null,
          () =>
            "Focus the trigger. ArrowDown/ArrowUp, Enter or Space opens the menu. Arrow keys, Home and End move focus and skip the disabled item. Escape restores trigger focus.",
        ),
        h(
          Menu,
          {
            modelValue: open.value,
            data: [
              { value: "rename", label: "Rename" },
              { value: "duplicate", label: "Duplicate" },
              { value: "locked", label: "Locked action", disabled: true },
              { value: "archive", label: "Archive" },
            ],
            "onUpdate:modelValue": (value: boolean) => (open.value = value),
            onSelect: (value: string) => (selected.value = `Selected: ${value}`),
          },
          { target: () => h(Button, null, () => "Document actions") },
        ),
        h(Text, { muted: true }, () => selected.value),
      ]);
  },
});

const PopoverPositionsDemo = defineComponent({
  setup() {
    const open = ref<string | null>(null);
    const positions = ["top", "right", "bottom", "left"] as const;
    return () =>
      h(Stack, { gap: "md", style: { minHeight: "18rem" } }, () => [
        h(
          Text,
          null,
          () =>
            "Each trigger exposes aria-expanded/aria-controls. Escape closes the active panel and restores focus to its trigger.",
        ),
        h(
          "div",
          { style: { display: "flex", flexWrap: "wrap", gap: "3rem" } },
          positions.map((position) =>
            h(
              Popover,
              {
                modelValue: open.value === position,
                position,
                "onUpdate:modelValue": (value: boolean) =>
                  (open.value = value ? position : null),
              },
              {
                target: () => h(Button, null, () => position),
                default: () =>
                  h(Stack, { gap: "xs" }, () => [
                    h(Text, null, () => `${position} contextual panel`),
                    h(
                      Button,
                      { onClick: () => (open.value = null) },
                      () => "Done",
                    ),
                  ]),
              },
            ),
          ),
        ),
      ]);
  },
});

const TooltipFocusDemo = defineComponent({
  setup() {
    return () =>
      h(Stack, { gap: "md" }, () => [
        h(
          Text,
          null,
          () =>
            "Tooltip works for pointer hover and keyboard focus. The description is attached to the slotted trigger, not the internal wrapper.",
        ),
        h(Tooltip, { label: "Save changes without publishing" }, () =>
          h(Button, null, () => "Save draft"),
        ),
        h(
          Tooltip,
          { label: "Composite focus remains stable while focus moves inside" },
          () =>
            h(
              "span",
              {
                style: {
                  display: "inline-flex",
                  gap: "0.5rem",
                  width: "fit-content",
                },
              },
              [
                h(Button, null, () => "Previous"),
                h(Button, null, () => "Next"),
              ],
            ),
        ),
      ]);
  },
});

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
            "Advanced composition: a Menu and Tooltip live inside a Popover. Open both layers, then press Escape to verify the Menu closes before the parent Popover.",
        ),
        h(
          Popover,
          {
            modelValue: popoverOpen.value,
            closeOnClickOutside: true,
            "onUpdate:modelValue": (value: boolean) => {
              popoverOpen.value = value;
              if (!value) menuOpen.value = false;
            },
          },
          {
            target: () => h(Button, null, () => "Open workspace actions"),
            default: () =>
              h(Stack, { gap: "sm" }, () => [
                h(Text, null, () => "Workspace actions"),
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

export const Default: Story = { render: () => preview(() => h(Demo)) };

export const DrawerGeometry: Story = {
  render: () => preview(() => h(DrawerGeometryDemo)),
};

export const MenuKeyboard: Story = {
  render: () => preview(() => h(MenuKeyboardDemo)),
};

export const PopoverPositions: Story = {
  render: () => preview(() => h(PopoverPositionsDemo)),
};

export const TooltipFocus: Story = {
  render: () => preview(() => h(TooltipFocusDemo)),
};

export const NestedInteractions: Story = {
  render: () => preview(() => h(NestedInteractionDemo)),
};
