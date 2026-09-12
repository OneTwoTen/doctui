import "./styles.css";
import {
  computed,
  defineComponent,
  h,
  onBeforeUnmount,
  type PropType,
  ref,
} from "vue";

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

export function createNotifications(options: NotificationsOptions = {}) {
  const notifications = ref<Notification[]>([]);
  const timers = new Map<string, ReturnType<typeof setTimeout>>();
  const limit = options.limit ?? 5;
  const hide = (id: string) => {
    const timer = timers.get(id);
    if (timer) clearTimeout(timer);
    timers.delete(id);
    notifications.value = notifications.value.filter((item) => item.id !== id);
  };
  const schedule = (item: Notification) => {
    if (item.autoClose === false || item.paused || item.autoClose === undefined)
      return;
    timers.set(
      item.id,
      setTimeout(() => hide(item.id), item.autoClose),
    );
  };
  const show = (input: Omit<Notification, "id">) => {
    const id = `dui-notification-${Math.random().toString(36).slice(2)}`;
    const item = { autoClose: 5000, ...input, id };
    notifications.value = [...notifications.value, item].slice(-limit);
    schedule(item);
    return id;
  };
  const update = (id: string, patch: Partial<Omit<Notification, "id">>) => {
    notifications.value = notifications.value.map((item) =>
      item.id === id ? { ...item, ...patch } : item,
    );
    const item = notifications.value.find(({ id: itemId }) => itemId === id);
    if (item) {
      const timer = timers.get(id);
      if (timer) clearTimeout(timer);
      timers.delete(id);
      schedule(item);
    }
  };
  const clean = () => {
    for (const { id } of notifications.value) {
      hide(id);
    }
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
  },
  setup(props) {
    const live = computed(() => props.store.notifications.value);
    onBeforeUnmount(props.store.clean);
    return () =>
      h(
        "div",
        {
          class: ["dui-Notifications", `dui-Notifications--${props.position}`],
          "aria-live": "polite",
          "aria-atomic": "false",
        },
        live.value.map((item) =>
          h(
            "div",
            {
              key: item.id,
              role: "status",
              class: "dui-Notification",
              "data-color": item.color,
              onMouseenter: () => props.store.pause(item.id),
              onMouseleave: () => props.store.resume(item.id),
            },
            [
              item.title ? h("strong", null, item.title) : null,
              h("span", null, item.message),
              h(
                "button",
                {
                  type: "button",
                  "aria-label": "Dismiss notification",
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
