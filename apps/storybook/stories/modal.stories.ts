import { Button, Drawer, Modal, Stack, Text } from "@doctui/core";
import type { Meta, StoryObj } from "@storybook/vue3-vite";
import { defineComponent, h, ref } from "vue";
import { preview } from "./story-helpers";

const meta = { title: "Overlays/Modal" } satisfies Meta;
export default meta;
type Story = StoryObj<typeof meta>;
type OverlaySize = "xs" | "sm" | "md" | "lg" | "xl";

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

const SizeAndAlignmentDemo = defineComponent({
  setup() {
    const open = ref(false);
    const size = ref<OverlaySize>("md");
    const centered = ref(true);
    const launch = (nextSize: OverlaySize, nextCentered: boolean) => {
      size.value = nextSize;
      centered.value = nextCentered;
      open.value = true;
    };

    return () =>
      h(Stack, { gap: "md", style: { maxWidth: "48rem" } }, () => [
        h(Text, null, () => "Each size changes real dialog width."),
        h(
          "div",
          { style: { display: "flex", flexWrap: "wrap", gap: "0.5rem" } },
          (["xs", "sm", "md", "lg", "xl"] as const).map((value) =>
            h(
              Button,
              { onClick: () => launch(value, true) },
              () => `Open ${value}`,
            ),
          ),
        ),
        h(
          Button,
          { onClick: () => launch("md", false) },
          () => "Open top-aligned md",
        ),
        h(
          Modal,
          {
            modelValue: open.value,
            title: `${size.value.toUpperCase()} modal`,
            size: size.value,
            centered: centered.value,
            "onUpdate:modelValue": (value: boolean) => (open.value = value),
          },
          {
            default: () =>
              h(
                Text,
                null,
                () =>
                  centered.value
                    ? "This surface is vertically centered by the shared backdrop."
                    : "This surface is aligned near the top of the backdrop.",
              ),
          },
        ),
      ]);
  },
});

const DismissalGuardDemo = defineComponent({
  setup() {
    const open = ref(false);
    return () =>
      h(Stack, { gap: "md", style: { maxWidth: "28rem" } }, () => [
        h(Button, { onClick: () => (open.value = true) }, () => "Open guarded dialog"),
        h(
          Text,
          { size: "sm", muted: true },
          () => "Escape and backdrop dismissal are disabled; use the close button.",
        ),
        h(
          Modal,
          {
            modelValue: open.value,
            title: "Unsaved editor",
            closeOnEscape: false,
            closeOnClickOutside: false,
            "onUpdate:modelValue": (value: boolean) => (open.value = value),
          },
          {
            default: () =>
              h(Text, null, () => "This pattern protects work from accidental dismissal."),
          },
        ),
      ]);
  },
});

const AdvancedCompositionDemo = defineComponent({
  setup() {
    const reviewOpen = ref(false);
    const drawerOpen = ref(false);

    return () =>
      h(Stack, { gap: "md", style: { maxWidth: "34rem" } }, () => [
        h(
          Button,
          { onClick: () => (reviewOpen.value = true) },
          () => "Review order",
        ),
        h(
          Text,
          { size: "sm", muted: true },
          () =>
            "Open the nested drawer, then press Escape: the drawer closes first and focus returns to its trigger.",
        ),
        h(
          Modal,
          {
            modelValue: reviewOpen.value,
            title: "Review order",
            size: "lg",
            centered: true,
            "onUpdate:modelValue": (value: boolean) =>
              (reviewOpen.value = value),
          },
          {
            default: () =>
              h(Stack, { gap: "md" }, () => [
                h(Text, null, () => "3 items · Standard delivery · Total $128"),
                h(
                  Button,
                  { onClick: () => (drawerOpen.value = true) },
                  () => "Edit delivery details",
                ),
                h(
                  Button,
                  { onClick: () => (reviewOpen.value = false), color: "success" },
                  () => "Confirm order",
                ),
                h(
                  Drawer,
                  {
                    modelValue: drawerOpen.value,
                    title: "Delivery details",
                    size: "sm",
                    position: "right",
                    "onUpdate:modelValue": (value: boolean) =>
                      (drawerOpen.value = value),
                  },
                  {
                    default: () =>
                      h(Stack, { gap: "md" }, () => [
                        h(Text, null, () => "Delivery window: 9:00–12:00"),
                        h(
                          Button,
                          { onClick: () => (drawerOpen.value = false) },
                          () => "Apply delivery settings",
                        ),
                      ]),
                  },
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

export const SizeAndAlignment: Story = {
  render: () => preview(() => h(SizeAndAlignmentDemo)),
};

export const DismissalGuard: Story = {
  render: () => preview(() => h(DismissalGuardDemo)),
};

export const AdvancedComposition: Story = {
  render: () => preview(() => h(AdvancedCompositionDemo)),
};
