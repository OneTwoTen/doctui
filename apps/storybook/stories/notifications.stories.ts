import { Button, Group, Stack, Text } from "@doctui/core";
import {
  createNotifications,
  Notifications as NotificationsView,
} from "@doctui/notifications";
import type { Meta, StoryObj } from "@storybook/vue3-vite";
import { computed, defineComponent, h, onBeforeUnmount, ref } from "vue";
import { preview } from "./story-helpers";

const meta = {
  title: "Feedback/Notifications",
  parameters: {
    docs: {
      description: {
        component:
          "Notification stores own their lifecycle. Renderers preserve shared state by default, while each message is announced through an independent polite status region.",
      },
    },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

const LifecycleOwnershipDemo = defineComponent({
  setup() {
    const store = createNotifications({ limit: 3 });
    const rendererMounted = ref(true);
    const count = computed(() => store.notifications.value.length);

    onBeforeUnmount(store.clean);

    return () =>
      h(Stack, { gap: "sm", style: { maxWidth: "36rem" } }, () => [
        h(
          Text,
          { size: "sm", muted: true },
          () =>
            "Unmounting the renderer does not clear the shared store. Mount it again to render the same notification state.",
        ),
        h(Group, { gap: "sm" }, () => [
          h(
            Button,
            {
              onClick: () =>
                store.show({
                  title: "Shared notification",
                  message: "This state belongs to the store, not the renderer.",
                  color: "primary",
                  autoClose: false,
                }),
            },
            () => "Show persistent notification",
          ),
          h(
            Button,
            {
              variant: "outline",
              onClick: () => {
                rendererMounted.value = !rendererMounted.value;
              },
            },
            () =>
              rendererMounted.value ? "Unmount renderer" : "Mount renderer",
          ),
          h(
            Button,
            {
              variant: "subtle",
              onClick: store.clean,
            },
            () => "Clean store",
          ),
        ]),
        h(Text, { size: "sm" }, () => `Store notifications: ${count.value}`),
        rendererMounted.value ? h(NotificationsView, { store }) : null,
      ]);
  },
});

const AnnouncementUpdatesDemo = defineComponent({
  setup() {
    const store = createNotifications({ limit: 4 });
    const firstId = ref<string>();

    onBeforeUnmount(store.clean);

    const showPair = () => {
      store.clean();
      firstId.value = store.show({
        title: "Sync started",
        message: "Preparing your workspace.",
        color: "primary",
        autoClose: false,
      });
      store.show({
        title: "Draft saved",
        message: "Your local edits are safe.",
        color: "success",
        autoClose: false,
      });
    };

    const updateFirst = () => {
      if (!firstId.value) return;
      store.update(firstId.value, {
        title: "Sync complete",
        message: "Your workspace is up to date.",
        color: "success",
      });
    };

    return () =>
      h(Stack, { gap: "sm", style: { maxWidth: "36rem" } }, () => [
        h(
          Text,
          { size: "sm", muted: true },
          () =>
            "Each notification owns a polite, atomic status region. Updating one message does not replace the announcement contract of its siblings.",
        ),
        h(Group, { gap: "sm" }, () => [
          h(Button, { onClick: showPair }, () => "Show two notifications"),
          h(
            Button,
            { variant: "outline", onClick: updateFirst },
            () => "Update first notification",
          ),
        ]),
        h(NotificationsView, { store }),
      ]);
  },
});

const ExplicitRendererOwnershipDemo = defineComponent({
  setup() {
    const store = createNotifications();
    const rendererMounted = ref(true);
    const count = computed(() => store.notifications.value.length);

    onBeforeUnmount(store.clean);

    const show = () => {
      if (!rendererMounted.value) rendererMounted.value = true;
      store.show({
        title: "Renderer-owned state",
        message: "Unmounting this renderer explicitly cleans its store.",
        color: "warning",
        autoClose: false,
      });
    };

    return () =>
      h(Stack, { gap: "sm", style: { maxWidth: "36rem" } }, () => [
        h(
          Text,
          { size: "sm", muted: true },
          () =>
            "Use cleanOnUnmount only when the renderer exclusively owns the store lifecycle.",
        ),
        h(Group, { gap: "sm" }, () => [
          h(Button, { onClick: show }, () => "Show notification"),
          h(
            Button,
            {
              variant: "outline",
              disabled: !rendererMounted.value,
              onClick: () => {
                rendererMounted.value = false;
              },
            },
            () => "Unmount owner renderer",
          ),
        ]),
        h(Text, { size: "sm" }, () => `Store notifications: ${count.value}`),
        rendererMounted.value
          ? h(NotificationsView, { store, cleanOnUnmount: true })
          : null,
      ]);
  },
});

export const LifecycleOwnership: Story = {
  render: () => preview(() => h(LifecycleOwnershipDemo)),
};

export const AnnouncementUpdates: Story = {
  render: () => preview(() => h(AnnouncementUpdatesDemo)),
};

export const ExplicitRendererOwnership: Story = {
  render: () => preview(() => h(ExplicitRendererOwnershipDemo)),
};
