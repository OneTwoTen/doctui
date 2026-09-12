import { afterEach, describe, expect, it, vi } from "vitest";
import { createNotifications } from "./index";

afterEach(() => vi.useRealTimers());

describe("@doctui/notifications", () => {
  it("shows, updates, hides and cleans notifications", () => {
    const store = createNotifications({ limit: 2 });
    const first = store.show({ title: "Saved", message: "Done" });
    const second = store.show({ message: "Queued" });
    store.show({ message: "Newest" });
    expect(store.notifications.value.map(({ id }) => id)).toEqual([
      second,
      expect.any(String),
    ]);
    store.update(second, { message: "Updated" });
    expect(
      store.notifications.value.find(({ id }) => id === second)?.message,
    ).toBe("Updated");
    store.hide(first);
    store.clean();
    expect(store.notifications.value).toEqual([]);
  });

  it("auto closes and pauses timers while paused", () => {
    vi.useFakeTimers();
    const store = createNotifications();
    const id = store.show({ message: "Temporary", autoClose: 1000 });
    vi.advanceTimersByTime(500);
    store.pause(id);
    vi.advanceTimersByTime(1000);
    expect(store.notifications.value).toHaveLength(1);
    store.resume(id);
    vi.advanceTimersByTime(1000);
    expect(store.notifications.value).toHaveLength(0);
  });
});
