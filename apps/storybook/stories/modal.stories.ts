import { Button, Drawer, Group, Modal, Stack, Text } from "@doctui/core";
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
                  h(
                    Text,
                    null,
                    () =>
                      "Actions belong in the footer slot so body content and action chrome stay independent.",
                  ),
                footer: () =>
                  h(Group, { justify: "end" }, () => [
                    h(
                      Button,
                      {
                        variant: "default",
                        onClick: () => (open.value = false),
                      },
                      () => "Cancel",
                    ),
                    h(
                      Button,
                      { onClick: () => (open.value = false) },
                      () => "Save changes",
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
              Group,
              { gap: "sm" },
              () =>
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
                footer: () =>
                  h(
                    Button,
                    { onClick: () => (open.value = false) },
                    () => "Close",
                  ),
              },
            ),
          ]);
      },
    });

    return preview(() => h(Demo));
  },
};

export const DestructiveAction: Story = {
  args: { modelValue: false, size: "sm", title: "Delete workspace" },
  render: (args) => {
    const Demo = defineComponent({
      setup() {
        const open = ref(false);
        return () =>
          h(Stack, { gap: "md" }, () => [
            h(
              Button,
              { color: "danger", onClick: () => (open.value = true) },
              () => "Delete workspace",
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
                  h(Stack, { gap: "sm" }, () => [
                    h(
                      Text,
                      null,
                      () =>
                        "This permanently deletes the workspace, API keys and audit history.",
                    ),
                    h(
                      Text,
                      { size: "sm", muted: true },
                      () => "Destructive actions should be explicit and visually distinct.",
                    ),
                  ]),
                footer: () =>
                  h(Group, { justify: "end" }, () => [
                    h(
                      Button,
                      {
                        variant: "default",
                        onClick: () => (open.value = false),
                      },
                      () => "Cancel",
                    ),
                    h(
                      Button,
                      {
                        color: "danger",
                        onClick: () => (open.value = false),
                      },
                      () => "Delete permanently",
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

export const LoadingAction: Story = {
  args: { modelValue: true, size: "sm", title: "Publishing release" },
  render: (args) =>
    preview(() =>
      h(
        Modal,
        args,
        {
          default: () =>
            h(
              Text,
              null,
              () => "The primary action communicates progress and cannot be clicked twice.",
            ),
          footer: () =>
            h(Group, { justify: "end" }, () => [
              h(Button, { variant: "default", disabled: true }, () => "Cancel"),
              h(Button, { loading: true }, () => "Publishing"),
            ]),
        },
      ),
    ),
};

export const DisabledAction: Story = {
  args: { modelValue: true, size: "sm", title: "Create API key" },
  render: (args) =>
    preview(() =>
      h(Modal, args, {
        default: () =>
          h(Stack, { gap: "sm" }, () => [
            h(Text, null, () => "Complete all required fields before continuing."),
            h(
              Text,
              { size: "sm", muted: true },
              () => "Disabled primary action remains visible in its expected footer position.",
            ),
          ]),
        footer: () =>
          h(Group, { justify: "end" }, () => [
            h(Button, { variant: "default" }, () => "Cancel"),
            h(Button, { disabled: true }, () => "Create key"),
          ]),
      }),
    ),
};

export const LongContentFixedFooter: Story = {
  args: { modelValue: true, size: "sm", title: "Terms and permissions" },
  render: (args) =>
    preview(() =>
      h(Modal, args, {
        default: () =>
          h(
            Stack,
            { gap: "md" },
            () =>
              Array.from({ length: 18 }, (_, index) =>
                h(
                  Text,
                  { key: index },
                  () =>
                    `Section ${index + 1}: Review the policy text and permission details before accepting.`,
                ),
              ),
          ),
        footer: () =>
          h(Group, { justify: "end" }, () => [
            h(Button, { variant: "default" }, () => "Decline"),
            h(Button, null, () => "Accept"),
          ]),
      }),
    ),
};

export const ResponsiveActions: Story = {
  args: { modelValue: true, size: "xs", title: "Checkout" },
  render: (args) =>
    preview(() =>
      h(Modal, args, {
        default: () =>
          h(
            Text,
            null,
            () => "A narrow modal with several actions should wrap instead of overflowing.",
          ),
        footer: () =>
          h(Group, { justify: "end", wrap: true }, () => [
            h(Button, { variant: "transparent" }, () => "Back"),
            h(Button, { variant: "default" }, () => "Save draft"),
            h(Button, null, () => "Continue"),
          ]),
      }),
    ),
};

export const NoFooter: Story = {
  args: { modelValue: true, size: "sm", title: "Keyboard shortcuts" },
  render: (args) =>
    preview(() =>
      h(Modal, args, {
        default: () =>
          h(
            Text,
            null,
            () => "Informational dialogs do not render an empty footer when no actions are needed.",
          ),
      }),
    ),
};

export const CustomFooterLayout: Story = {
  args: { modelValue: true, size: "md", title: "Publish article" },
  render: (args) =>
    preview(() =>
      h(Modal, args, {
        default: () =>
          h(
            Text,
            null,
            () => "Footer content is fully composable and is not limited to action buttons.",
          ),
        footer: () =>
          h(
            "div",
            {
              style: {
                alignItems: "center",
                display: "flex",
                flex: "1 1 100%",
                flexWrap: "wrap",
                gap: "0.75rem",
                justifyContent: "space-between",
              },
            },
            [
              h(Text, { size: "sm", muted: true }, () => "Saved 2 minutes ago"),
              h(Group, { justify: "end" }, () => [
                h(Button, { variant: "default" }, () => "Preview"),
                h(Button, null, () => "Publish"),
              ]),
            ],
          ),
      }),
    ),
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
                      {
                        variant: "default",
                        onClick: () => (drawerOpen.value = true),
                      },
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
                              "Nested Drawer owns its actions and closes before its parent Modal.",
                          ),
                        footer: () =>
                          h(Group, { justify: "end" }, () => [
                            h(
                              Button,
                              {
                                variant: "default",
                                onClick: () => (drawerOpen.value = false),
                              },
                              () => "Cancel",
                            ),
                            h(
                              Button,
                              { onClick: () => (drawerOpen.value = false) },
                              () => "Apply delivery",
                            ),
                          ]),
                      },
                    ),
                  ]),
                footer: () =>
                  h(Group, { justify: "end" }, () => [
                    h(
                      Button,
                      {
                        variant: "default",
                        onClick: () => (modalOpen.value = false),
                      },
                      () => "Cancel order",
                    ),
                    h(
                      Button,
                      { onClick: () => (modalOpen.value = false) },
                      () => "Place order",
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
