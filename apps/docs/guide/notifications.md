<script setup lang="ts">
import { Button, Group, Stack, Text } from "@doctui/core";
import {
  Notifications,
  createNotifications,
} from "@doctui/notifications";

const notifications = createNotifications({
  limit: 4,
});

let uploadId: ReturnType<typeof notifications.show> | undefined;

function showSaved() {
  notifications.show({
    title: "Saved",
    message: "Your changes are ready.",
    color: "success",
  });
}

function showWarning() {
  notifications.show({
    title: "Review required",
    message: "Two fields still need attention.",
    color: "warning",
  });
}

function startUpload() {
  uploadId = notifications.show({
    title: "Uploading",
    message: "The notification stays visible until it is updated.",
    autoClose: false,
  });
}

function completeUpload() {
  if (!uploadId) return;
  notifications.update(uploadId, {
    title: "Upload complete",
    message: "The file is ready.",
    color: "success",
    autoClose: 3000,
  });
  uploadId = undefined;
}
</script>

# Notifications

`@doctui/notifications` separates notification state from its renderer. The
store owns notification state and timers; `<Notifications>` only renders that
state unless lifecycle ownership is explicitly delegated to it.

<div class="docs-preview docs-preview--stack" data-docs-preview="notifications-basic">
  <Group gap="sm">
    <Button color="success" @click="showSaved">Show success</Button>
    <Button color="warning" variant="light" @click="showWarning">Show warning</Button>
    <Button variant="outline" @click="notifications.clean()">Clear all</Button>
  </Group>
  <Text size="sm" muted>Use the dismiss button on a notification to verify native keyboard and pointer behavior.</Text>
  <Notifications :store="notifications" />
</div>

```ts
import { Notifications, createNotifications } from "@doctui/notifications";

const notifications = createNotifications({ limit: 4 });
notifications.show({
  title: "Saved",
  message: "Your changes are ready.",
  color: "success",
});
```

Render one active `<Notifications :store="notifications" />` near the
application root. A renderer can unmount during a route or layout transition
without clearing the shared store, so another renderer can continue using the
same state.

## Lifecycle ownership

Call `notifications.clean()` when the application or feature that owns the
store is disposed. `hide()` and `clean()` are idempotent, and notifications
removed by the `limit` are detached from their auto-close timers immediately.

If a renderer exclusively owns its store, opt into cleanup on unmount:

```vue
<Notifications :store="notifications" clean-on-unmount />
```

Do not enable `cleanOnUnmount` on a renderer that shares its store with another
active route or renderer because that explicitly transfers cleanup ownership to
that renderer.

## Auto-close timing and updates

Hovering a notification pauses its auto-close timer. Resuming continues from
the remaining duration rather than starting the full duration again.

`update(id, { message })`, title changes, and color changes preserve the current
countdown. Updating `autoClose` intentionally starts a new duration from the
update; if the notification is paused, that new duration starts when it is
resumed. Set `autoClose: false` to disable automatic dismissal. Setting
`autoClose: undefined` restores the default 5000 ms duration.

<div class="docs-preview docs-preview--stack" data-docs-preview="notifications-update">
  <Group gap="sm">
    <Button @click="startUpload">Start persistent upload</Button>
    <Button color="success" variant="light" @click="completeUpload">Complete upload</Button>
  </Group>
  <Text size="sm" muted>Start creates a persistent notification; Complete updates that same notification and starts a 3-second close timer.</Text>
</div>

```ts
const id = notifications.show({
  message: "Uploading…",
  autoClose: false,
});

notifications.update(id, {
  message: "Upload complete",
  autoClose: 3000,
});
```

## Announcements and dismissal

Each visible notification has its own polite, atomic `status` live region.
This keeps simultaneous notifications independent and makes message/title
updates announce the updated notification instead of the entire stack. The
dismiss control is outside the live region so its label is not mixed into the
status announcement.

Dismiss controls are native buttons and therefore keep standard keyboard focus
and Enter/Space activation behavior. Their accessible label includes the title
when one is available. Avoid rendering the same store through multiple visible
renderers at the same time unless the duplicate visual and screen-reader
announcements are intentional.
