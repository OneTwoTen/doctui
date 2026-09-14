import { Button, Drawer, Modal, Stack, Text } from "@doctui/core";
import type { Meta, StoryObj } from "@storybook/vue3-vite";
import { defineComponent, h, ref, watch } from "vue";
import { preview } from "./story-helpers";

const meta = {
  title: "Overlays/Modal",
  component: Modal,
  args: {
    modelValue: true,
    title: "Review changes",
    size: "md",
    radius: "md",
    centered: true,
    closeOnEscape: true,
    closeOnClickOutside: true,
    withCloseButton: true,
    withOverlay: true,
    overlayProps: { color: "neutral", opacity: 0.55 },
    lockScroll: true,
    trapFocus: true,
    returnFocus: true,
    portalTarget: "body",
  },
  argTypes: {
    modelValue: { control: "boolean" },
    title: { control: "text" },
    ariaLabel: { control: "text" },
    size: {
      control: "select",
      options: ["xs", "sm", "md", "lg", "xl"],
    },
    radius: {
      control: "select",
      options: ["none", "xs", "sm", "md", "lg", "xl", "full"],
    },
    centered: { control: "boolean" },
    closeOnEscape: { control: "boolean" },
    closeOnClickOutside: { control: "boolean" },
    withCloseButton: { control: "boolean" },
    withOverlay: { control: "boolean" },
    overlayProps: { control: "object" },
    lockScroll: { control: "boolean" },
    trapFocus: { control: "boolean" },
    returnFocus: { control: "boolean" },
    portalTarget: { control: "text" },
  },
} satisfies Meta<typeof Modal>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  render: (args) => {
    const Demo = defineComponent({
      setup() {
        const open = ref(args.modelValue ?? true);
        watch(
          () => args.modelValue,
          (value) => (open.value = value ?? false),
        );

        return () =>
          h(Stack, { gap: "md", style: { maxWidth: "28rem" } }, () => [
            h(
              Button,
              { onClick: () => (open.value = true) },
              () => "Open modal",
            ),
            h(
              Text,
              { size: "sm", muted: true },
              () => "Use Controls to change every public modal behavior.",
            ),
            h(
              Modal,
              {
                ...args,
                modelValue: open.value,
                "onUpdate:modelValue": (value: boolean) => (open.value = value),
              },
              {
                default: () =>
                  h(Stack, { gap: "md" }, () => [
                    h(
                      Text,
                      null,
                      () =>
                        "Resize the dialog, change its radius, backdrop, dismissal and focus behavior from Controls.",
                    ),
                    h(
                      Button,
                      { onClick: () => (open.value = false) },
                      () => "Done",
                    ),
                  ]),
                footer: () =>
                  h(Text, { size: "sm", muted: true }, () => "Footer slot"),
              },
            ),
          ]);
      },
    });

    return preview(() => h(Demo));
  },
};

export const Sizes: Story = {
  args: { modelValue: false },
  render: (args) => {
    const Demo = defineComponent({
      setup() {
        const open = ref(false);
        const size = ref<"xs" | "sm" | "md" | "lg" | "xl">("md");

        return () =>
          h(Stack, { gap: "md" }, () => [
            h(
              "div",
              { style: { display: "flex", flexWrap: "wrap", gap: "0.5rem" } },
              (["xs", "sm", "md", "lg", "xl"] as const).map((value) =>
                h(
                  Button,
                  {
                    onClick: () => {
                      size.value = value;
                      open.value = true;
                    },
                  },
                  () => `Open ${value}`,
                ),
              ),
            ),
            h(
              Modal,
              {
                ...args,
                modelValue: open.value,
                size: size.value,
                title: `${size.value.toUpperCase()} modal`,
                "onUpdate:modelValue": (value: boolean) => (open.value = value),
              },
              {
                default: () =>
                  h(
                    Text,
                    null,
                    () => "Each token maps to a different real width.",
                  ),
              },
            ),
          ]);
      },
    });

    return preview(() => h(Demo));
  },
};

export const AdvancedComposition: Story = {
  args: { modelValue: false },
  render: (args) => {
    const Demo = defineComponent({
      setup() {
        const modalOpen = ref(false);
        const drawerOpen = ref(false);

        return () =>
          h(Stack, { gap: "md" }, () => [
            h(
              Button,
              { onClick: () => (modalOpen.value = true) },
              () => "Review order",
            ),
            h(
              Modal,
              {
                ...args,
                modelValue: modalOpen.value,
                title: "Review order",
                size: "lg",
                centered: true,
                "onUpdate:modelValue": (value: boolean) =>
                  (modalOpen.value = value),
              },
              {
                default: () =>
                  h(Stack, { gap: "md" }, () => [
                    h(
                      Text,
                      null,
                      () => "3 items · Standard delivery · Total $128",
                    ),
                    h(
                      Button,
                      { onClick: () => (drawerOpen.value = true) },
                      () => "Edit delivery details",
                    ),
                    h(
                      Drawer,
                      {
                        modelValue: drawerOpen.value,
                        title: "Delivery details",
                        size: "sm",
                        "onUpdate:modelValue": (value: boolean) =>
                          (drawerOpen.value = value),
                      },
                      {
                        default: () =>
                          h(
                            Text,
                            null,
                            () =>
                              "Nested Drawer closes before its parent Modal.",
                          ),
                      },
                    ),
                  ]),
              },
            ),
          ]);
      },
    });

    return preview(() => h(Demo));
  },
};
