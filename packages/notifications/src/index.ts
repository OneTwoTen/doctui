import "./styles.css";
import {
  computed,
  defineComponent,
  h,
  onBeforeUnmount,
  type PropType,
  ref,
} from "vue";

const DEFAULT_AUTO_CLOSE = 5000;
let fallbackNotificationId = 0;

export interface Notification {
  id: string;
  title?: string;
  message: string;
  color?: "primary" | "success" | "warning" | "danger";
  autoClose?: number | false;
  paused?: boolean;
}

export interface NotificationsOptions {
  limit?: number;
  position?: "top-start" | "top-end" | "bottom-start" | "bottom-end";
}

interface NotificationTimer {
  timeout: ReturnType<typeof setTimeout> | null;
  remaining: number;
  startedAt: number | null;
}

function createNotificationId() {
  const uuid = globalThis.crypto?.randomUUID?.();
  if (uuid) return `dui-notification-${uuid}`;

  fallbackNotificationId += 1;
  return `dui-notification-${Date.now().toString(36)}-${fallbackNotificationId.toString(36)}`;
}

export function createNotifications(options: NotificationsOptions = {}) {
  const notifications = ref<Notification[]>([]);
  const timers = new Map<string, NotificationTimer>();
  const limit = Math.max(0, options.limit ?? 5);

  const clearTimer = (id: string, preserveRemaining = false) => {
    const timer = timers.get(id);
    if (!timer) return undefined;

    if (timer.timeout !== null) clearTimeout(timer.timeout);

    const elapsed =
      preserveRemaining && timer.startedAt !== null
        ? Math.max(0, Date.now() - timer.startedAt)
        : 0;
    const remaining = preserveRemaining
      ? Math.max(0, timer.remaining - elapsed)
      : timer.remaining;

    if (preserveRemaining) {
      timers.set(id, {
        timeout: null,
        remaining,
        startedAt: null,
      });
    } else {
      timers.delete(id);
    }

    return remaining;
  };

  const hide = (id: string) => {
    clearTimer(id);
    notifications.value = notifications.value.filter((item) => item.id !== id);
  };

  const schedule = (item: Notification, duration?: number) => {
    clearTimer(item.id);
    if (typeof item.autoClose !== "number") return;

    const remaining = Math.max(0, duration ?? item.autoClose);
    if (item.paused) {
      timers.set(item.id, {
        timeout: null,
        remaining,
        startedAt: null,
      });
      return;
    }

    const timer: NotificationTimer = {
      timeout: null,
      remaining,
      startedAt: Date.now(),
    };
    timer.timeout = setTimeout(() => hide(item.id), remaining);
    timers.set(item.id, timer);
  };

  const show = (input: Omit<Notification, "id">) => {
    const id = createNotificationId();
    const item: Notification = {
      ...input,
      autoClose: input.autoClose ?? DEFAULT_AUTO_CLOSE,
      id,
    };
    const next = [...notifications.value, item];
    const retained = limit === 0 ? [] : next.slice(-limit);
    const retainedIds = new Set(
      retained.map(({ id: retainedId }) => retainedId),
    );

    for (const candidate of next) {
      if (!retainedIds.has(candidate.id)) clearTimer(candidate.id);
    }

    notifications.value = retained;
    if (retainedIds.has(id)) schedule(item);
    return id;
  };

  const update = (id: string, patch: Partial<Omit<Notification, "id">>) => {
    const current = notifications.value.find((item) => item.id === id);
    if (!current) return;

    const updatesAutoClose = Object.hasOwn(patch, "autoClose");
    const updatesPaused = Object.hasOwn(patch, "paused");
    const next: Notification = {
      ...current,
      ...patch,
      autoClose: updatesAutoClose
        ? (patch.autoClose ?? DEFAULT_AUTO_CLOSE)
        : current.autoClose,
      paused: updatesPaused ? Boolean(patch.paused) : current.paused,
    };

    if (updatesAutoClose) {
      notifications.value = notifications.value.map((item) =>
        item.id === id ? next : item,
      );
      schedule(next);
      return;
    }

    const pausedChanged =
      updatesPaused && Boolean(current.paused) !== Boolean(next.paused);
    if (pausedChanged && next.paused) {
      const remaining = clearTimer(id, true);
      if (remaining === undefined && typeof next.autoClose === "number") {
        timers.set(id, {
          timeout: null,
          remaining: next.autoClose,
          startedAt: null,
        });
      }
      notifications.value = notifications.value.map((item) =>
        item.id === id ? next : item,
      );
      return;
    }

    if (pausedChanged && !next.paused) {
      const remaining = timers.get(id)?.remaining;
      notifications.value = notifications.value.map((item) =>
        item.id === id ? next : item,
      );
      schedule(next, remaining);
      return;
    }

    notifications.value = notifications.value.map((item) =>
      item.id === id ? next : item,
    );
  };

  const clean = () => {
    for (const timer of timers.values()) {
      if (timer.timeout !== null) clearTimeout(timer.timeout);
    }
    timers.clear();
    notifications.value = [];
  };

  const pause = (id: string) => update(id, { paused: true });
  const resume = (id: string) => update(id, { paused: false });

  return { notifications, show, update, hide, clean, pause, resume };
}

export const Notifications = defineComponent({
  name: "DuiNotifications",
  props: {
    store: {
      type: Object as PropType<ReturnType<typeof createNotifications>>,
      required: true,
    },
    position: {
      type: String as PropType<NotificationsOptions["position"]>,
      default: "top-end",
    },
    cleanOnUnmount: {
      type: Boolean,
      default: false,
    },
  },
  setup(props) {
    const live = computed(() => props.store.notifications.value);
    onBeforeUnmount(() => {
      if (props.cleanOnUnmount) props.store.clean();
    });

    return () =>
      h(
        "div",
        {
          class: ["dui-Notifications", `dui-Notifications--${props.position}`],
        },
        live.value.map((item) =>
          h(
            "div",
            {
              key: item.id,
              class: "dui-Notification",
              "data-color": item.color,
              onMouseenter: () => props.store.pause(item.id),
              onMouseleave: () => props.store.resume(item.id),
            },
            [
              h(
                "div",
                {
                  class: "dui-Notification__status",
                  role: "status",
                  "aria-live": "polite",
                  "aria-atomic": "true",
                },
                [
                  item.title ? h("strong", null, item.title) : null,
                  h("span", null, item.message),
                ],
              ),
              h(
                "button",
                {
                  type: "button",
                  "aria-label": item.title
                    ? `Dismiss ${item.title} notification`
                    : `Dismiss notification: ${item.message}`,
                  onClick: () => props.store.hide(item.id),
                },
                "×",
              ),
            ],
          ),
        ),
      );
  },
});
