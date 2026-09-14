import { Button, Drawer, Group, Stack, Text } from "@doctui/core";
import type { Meta, StoryObj } from "@storybook/vue3-vite";
import { useArgs } from "storybook/preview-api";
import { h } from "vue";
import { preview } from "./story-helpers";

const meta = {
  title: "Overlays/Drawer",
  component: Drawer,
  args: {
    modelValue: false,
    title: "Filters",
    ariaLabel: "Filters drawer",
    position: "right",
    size: "md",
    radius: "md",
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
    position: {
      control: "inline-radio",
      options: ["left", "right"],
    },
    size: {
      control: "select",
      options: ["xs", "sm", "md", "lg", "xl"],
    },
    radius: {
      control: "select",
      options: ["none", "xs", "sm", "md", "lg", "xl", "full"],
    },
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
} satisfies Meta<typeof Drawer>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  render: function Render(args) {
    const [currentArgs, updateArgs] = useArgs();
    const liveArgs = currentArgs as typeof args;

    return preview(() =>
      h(Stack, { gap: "md" }, () => [
        h(
          Button,
          { onClick: () => updateArgs({ modelValue: true }) },
          () => "Open drawer",
        ),
        h(
          Drawer,
          {
            ...liveArgs,
            "onUpdate:modelValue": (value: boolean) =>
              updateArgs({ modelValue: value }),
          },
          {
            default: () =>
              h(Stack, { gap: "md" }, () => [
                h(Text, null, () => "Drawer content"),
                h(
                  Text,
                  { size: "sm", muted: true },
                  () =>
                    "Use Controls to verify position, width, radius, backdrop, dismissal and focus behavior.",
                ),
              ]),
            footer: () =>
              h(Group, { justify: "flex-end" }, () => [
                h(
                  Button,
                  {
                    variant: "default",
                    onClick: () => updateArgs({ modelValue: false }),
                  },
                  () => "Cancel",
                ),
                h(
                  Button,
                  { onClick: () => updateArgs({ modelValue: false }) },
                  () => "Apply",
                ),
              ]),
          },
        ),
      ]),
    );
  },
};

export const Open: Story = {
  args: { modelValue: true },
  render: function Render(args) {
    const [currentArgs, updateArgs] = useArgs();
    const liveArgs = currentArgs as typeof args;

    return preview(() =>
      h(
        Drawer,
        {
          ...liveArgs,
          "onUpdate:modelValue": (value: boolean) =>
            updateArgs({ modelValue: value }),
        },
        {
          default: () =>
            h(
              Text,
              null,
              () =>
                "This story starts open so geometry and footer changes are visible immediately.",
            ),
          footer: () =>
            h(Group, { justify: "flex-end" }, () => [
              h(
                Button,
                { onClick: () => updateArgs({ modelValue: false }) },
                () => "Done",
              ),
            ]),
        },
      ),
    );
  },
};

export const ApplyFilters: Story = {
  args: { modelValue: true, size: "sm", title: "Product filters" },
  render: (args) =>
    preview(() =>
      h(Drawer, args, {
        default: () =>
          h(Stack, { gap: "lg" }, () => [
            h(Stack, { gap: "xs" }, () => [
              h(Text, null, () => "Availability"),
              h(Text, { size: "sm", muted: true }, () => "In stock · Preorder"),
            ]),
            h(Stack, { gap: "xs" }, () => [
              h(Text, null, () => "Price"),
              h(Text, { size: "sm", muted: true }, () => "$20 – $250"),
            ]),
            h(Stack, { gap: "xs" }, () => [
              h(Text, null, () => "Shipping"),
              h(
                Text,
                { size: "sm", muted: true },
                () => "Free delivery selected",
              ),
            ]),
          ]),
        footer: () =>
          h(Group, { justify: "flex-end" }, () => [
            h(Button, { variant: "transparent" }, () => "Clear all"),
            h(Button, { variant: "default" }, () => "Cancel"),
            h(Button, null, () => "Show 128 items"),
          ]),
      }),
    ),
};

export const LoadingAction: Story = {
  args: { modelValue: true, size: "sm", title: "Update profile" },
  render: (args) =>
    preview(() =>
      h(Drawer, args, {
        default: () =>
          h(
            Text,
            null,
            () =>
              "Saving state stays in the persistent footer while content remains scrollable.",
          ),
        footer: () =>
          h(Group, { justify: "flex-end" }, () => [
            h(Button, { variant: "default", disabled: true }, () => "Cancel"),
            h(Button, { loading: true }, () => "Saving"),
          ]),
      }),
    ),
};

export const LongContentFixedFooter: Story = {
  args: { modelValue: true, size: "sm", title: "Activity details" },
  render: (args) =>
    preview(() =>
      h(Drawer, args, {
        default: () =>
          h(Stack, { gap: "md" }, () =>
            Array.from({ length: 22 }, (_, index) =>
              h(
                Text,
                { key: index },
                () =>
                  `Activity ${index + 1}: A detailed audit entry that makes the drawer body taller than the viewport.`,
              ),
            ),
          ),
        footer: () =>
          h(Group, { justify: "flex-end" }, () => [
            h(Button, { variant: "default" }, () => "Export"),
            h(Button, null, () => "Done"),
          ]),
      }),
    ),
};

export const ResponsiveActions: Story = {
  args: { modelValue: true, size: "xs", title: "Invite member" },
  render: (args) =>
    preview(() =>
      h(Drawer, args, {
        default: () =>
          h(
            Text,
            null,
            () =>
              "Several footer actions wrap in a narrow drawer instead of overflowing.",
          ),
        footer: () =>
          h(Group, { justify: "flex-end", wrap: true }, () => [
            h(Button, { variant: "transparent" }, () => "Copy link"),
            h(Button, { variant: "default" }, () => "Cancel"),
            h(Button, null, () => "Send invite"),
          ]),
      }),
    ),
};

export const NoFooter: Story = {
  args: { modelValue: true, size: "sm", title: "Release notes" },
  render: (args) =>
    preview(() =>
      h(Drawer, args, {
        default: () =>
          h(Stack, { gap: "md" }, () => [
            h(Text, null, () => "Version 0.2.0"),
            h(
              Text,
              { size: "sm", muted: true },
              () => "Read-only drawers do not render an empty footer region.",
            ),
          ]),
      }),
    ),
};

export const LeftPosition: Story = {
  args: {
    modelValue: true,
    position: "left",
    size: "sm",
    title: "Navigation",
  },
  render: (args) =>
    preview(() =>
      h(Drawer, args, {
        default: () =>
          h(
            Text,
            null,
            () =>
              "Footer actions use the same layout contract on left-positioned drawers.",
          ),
        footer: () =>
          h(Group, { justify: "flex-end" }, () => [
            h(Button, { variant: "default" }, () => "Close"),
            h(Button, null, () => "Open section"),
          ]),
      }),
    ),
};

export const CustomBackdrop: Story = {
  args: {
    modelValue: true,
    size: "lg",
    title: "Custom backdrop",
    overlayProps: { color: "primary", opacity: 0.35 },
  },
  render: (args) =>
    preview(() =>
      h(Drawer, args, {
        default: () =>
          h(
            Text,
            null,
            () => "Backdrop props are forwarded to the shared Overlay.",
          ),
        footer: () =>
          h(Group, { justify: "flex-end" }, () => [
            h(Button, { variant: "default" }, () => "Cancel"),
            h(Button, null, () => "Confirm"),
          ]),
      }),
    ),
};

export const DestructiveAction: Story = {
  args: { modelValue: true, size: "sm", title: "Remove integration" },
  render: (args) =>
    preview(() =>
      h(Drawer, args, {
        default: () =>
          h(
            Text,
            null,
            () =>
              "Removing this integration stops future synchronization jobs.",
          ),
        footer: () =>
          h(Group, { justify: "flex-end" }, () => [
            h(Button, { variant: "default" }, () => "Keep integration"),
            h(Button, { color: "danger" }, () => "Remove"),
          ]),
      }),
    ),
};
