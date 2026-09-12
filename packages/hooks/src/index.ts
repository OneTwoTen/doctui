import {
  type MaybeRef,
  onBeforeUnmount,
  onMounted,
  type Ref,
  ref,
  toValue,
  watch,
} from "vue";

export function useDisclosure(initial = false) {
  const opened = ref(initial);
  const open = () => {
    opened.value = true;
  };
  const close = () => {
    opened.value = false;
  };
  const toggle = () => {
    opened.value = !opened.value;
  };
  const setOpened = (value: boolean) => {
    opened.value = value;
  };
  return { opened, open, close, toggle, setOpened };
}

export function useDebouncedValue<T>(source: MaybeRef<T>, delay = 200): Ref<T> {
  const value = ref(toValue(source)) as Ref<T>;
  let timer: ReturnType<typeof setTimeout> | undefined;
  watch(
    () => toValue(source),
    (next) => {
      if (timer) clearTimeout(timer);
      timer = setTimeout(() => {
        value.value = next;
      }, delay);
    },
  );
  onBeforeUnmount(() => {
    if (timer) clearTimeout(timer);
  });
  return value;
}

export function useDebouncedCallback<T extends unknown[]>(
  callback: (...args: T) => void,
  delay = 200,
) {
  let timer: ReturnType<typeof setTimeout> | undefined;
  let latestArgs: T | undefined;
  const run = (...args: T) => {
    latestArgs = args;
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => {
      if (latestArgs) callback(...latestArgs);
      latestArgs = undefined;
      timer = undefined;
    }, delay);
  };
  run.cancel = () => {
    if (timer) clearTimeout(timer);
    timer = undefined;
    latestArgs = undefined;
  };
  onBeforeUnmount(run.cancel);
  return run;
}

export function useClipboard(timeout = 2000) {
  const copied = ref(false);
  let timer: ReturnType<typeof setTimeout> | undefined;
  const copy = async (text: string) => {
    if (typeof navigator === "undefined" || !navigator.clipboard?.writeText)
      return false;
    try {
      await navigator.clipboard.writeText(text);
      copied.value = true;
      if (timer) clearTimeout(timer);
      timer = setTimeout(() => {
        copied.value = false;
      }, timeout);
      return true;
    } catch {
      return false;
    }
  };
  onBeforeUnmount(() => {
    if (timer) clearTimeout(timer);
  });
  return { copied, copy };
}

export function useMediaQuery(query: MaybeRef<string>) {
  const matches = ref(false);
  let mediaQuery: MediaQueryList | undefined;
  const update = () => {
    matches.value = mediaQuery?.matches ?? false;
  };
  const stop = () => mediaQuery?.removeEventListener("change", update);
  onMounted(() => {
    if (!window.matchMedia) return;
    mediaQuery = window.matchMedia(toValue(query));
    update();
    mediaQuery.addEventListener("change", update);
  });
  onBeforeUnmount(stop);
  watch(
    () => toValue(query),
    (next) => {
      stop();
      if (typeof window !== "undefined" && window.matchMedia) {
        mediaQuery = window.matchMedia(next);
        update();
        mediaQuery.addEventListener("change", update);
      }
    },
  );
  return { matches, stop };
}

export function useDocumentTitle(
  title: MaybeRef<string>,
  options: { restoreOnUnmount?: boolean } = {},
) {
  const previous = typeof document !== "undefined" ? document.title : "";
  const apply = (value: string) => {
    if (typeof document !== "undefined") document.title = value;
  };
  watch(() => toValue(title), apply, { immediate: true });
  onBeforeUnmount(() => {
    if (options.restoreOnUnmount) apply(previous);
  });
}

export function useElementSize(element: Ref<HTMLElement | null | undefined>) {
  const width = ref(0);
  const height = ref(0);
  let observer: ResizeObserver | undefined;
  const stop = () => observer?.disconnect();
  onMounted(() => {
    if (typeof ResizeObserver === "undefined" || !element.value) return;
    observer = new ResizeObserver(([entry]) => {
      if (!entry) return;
      width.value = entry.contentRect.width;
      height.value = entry.contentRect.height;
    });
    observer.observe(element.value);
  });
  onBeforeUnmount(stop);
  return { width, height, stop };
}

export function useHotkeys(
  bindings: Record<string, (event: KeyboardEvent) => void>,
  target: EventTarget | undefined = typeof document === "undefined"
    ? undefined
    : document,
) {
  const normalize = (value: string) =>
    value
      .toLowerCase()
      .split("+")
      .map((part) => part.trim())
      .sort()
      .join("+");
  const onKeydown = (event: Event) => {
    const keyboardEvent = event as KeyboardEvent;
    const parts = [keyboardEvent.key];
    if (keyboardEvent.ctrlKey) parts.push("ctrl");
    if (keyboardEvent.altKey) parts.push("alt");
    if (keyboardEvent.shiftKey) parts.push("shift");
    if (keyboardEvent.metaKey) parts.push("meta");
    const handler =
      bindings[normalize(parts.join("+"))] ??
      bindings[normalize(keyboardEvent.key)];
    if (handler) handler(keyboardEvent);
  };
  onMounted(() => target?.addEventListener("keydown", onKeydown));
  onBeforeUnmount(() => target?.removeEventListener("keydown", onKeydown));
  return { stop: () => target?.removeEventListener("keydown", onKeydown) };
}

export function useLocalStorage<T>(key: string, initialValue: T) {
  const read = () => {
    if (typeof localStorage === "undefined") return initialValue;
    try {
      const stored = localStorage.getItem(key);
      return stored === null ? initialValue : (JSON.parse(stored) as T);
    } catch {
      return initialValue;
    }
  };
  const value = ref(read()) as Ref<T>;
  watch(
    value,
    (next) => {
      if (typeof localStorage !== "undefined")
        localStorage.setItem(key, JSON.stringify(next));
    },
    { deep: true },
  );
  const remove = () => {
    if (typeof localStorage !== "undefined") localStorage.removeItem(key);
    value.value = initialValue;
  };
  return { value, remove };
}
