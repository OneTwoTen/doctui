import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { mount } from "@vue/test-utils";
import { afterEach, describe, expect, it, vi } from "vitest";
import { nextTick } from "vue";
import { createNotifications, Notifications } from "./index";

afterEach(() => vi.useRealTimers());

describe("@doctui/notifications store", () => {
  it("shows, updates, hides and cleans notifications idempotently", () => {
    const store = createNotifications({ limit: 2 });
    const first = store.show({
      title: "Saved",
      message: "Done",
      autoClose: false,
    });
    const second = store.show({ message: "Queued", autoClose: false });
    const third = store.show({ message: "Newest", autoClose: false });

    expect(store.notifications.value.map(({ id }) => id)).toEqual([
      second,
      third,
    ]);

    store.update(second, { message: "Updated" });
    expect(
      store.notifications.value.find(({ id }) => id === second)?.message,
    ).toBe("Updated");

    store.hide(first);
    store.hide(first);
    store.clean();
    store.clean();
    expect(store.notifications.value).toEqual([]);
  });

  it("clears the timer of a notification evicted by the limit", () => {
    vi.useFakeTimers();
    const store = createNotifications({ limit: 1 });

    store.show({ message: "Will be evicted", autoClose: 1000 });
    expect(vi.getTimerCount()).toBe(1);

    store.show({ message: "Retained", autoClose: false });
    expect(vi.getTimerCount()).toBe(0);

    vi.advanceTimersByTime(1000);
    expect(store.notifications.value.map(({ message }) => message)).toEqual([
      "Retained",
    ]);
  });

  it("preserves the remaining auto-close duration across pause and resume", () => {
    vi.useFakeTimers();
    const store = createNotifications();
    const id = store.show({ message: "Temporary", autoClose: 1000 });

    vi.advanceTimersByTime(400);
    store.pause(id);
    vi.advanceTimersByTime(2000);
    expect(store.notifications.value).toHaveLength(1);

    store.resume(id);
    vi.advanceTimersByTime(599);
    expect(store.notifications.value).toHaveLength(1);
    vi.advanceTimersByTime(1);
    expect(store.notifications.value).toHaveLength(0);
  });

  it("keeps elapsed time for content updates and restarts from a manually updated autoClose", () => {
    vi.useFakeTimers();
    const store = createNotifications();
    const contentId = store.show({ message: "Original", autoClose: 1000 });

    vi.advanceTimersByTime(400);
    store.update(contentId, { message: "Updated content" });
    vi.advanceTimersByTime(599);
    expect(store.notifications.value).toHaveLength(1);
    vi.advanceTimersByTime(1);
    expect(store.notifications.value).toHaveLength(0);

    const activeId = store.show({ message: "Active", autoClose: 1000 });
    vi.advanceTimersByTime(400);
    store.update(activeId, { autoClose: 800 });
    vi.advanceTimersByTime(799);
    expect(store.notifications.value).toHaveLength(1);
    vi.advanceTimersByTime(1);
    expect(store.notifications.value).toHaveLength(0);

    const pausedId = store.show({ message: "Paused", autoClose: 1000 });
    vi.advanceTimersByTime(400);
    store.pause(pausedId);
    store.update(pausedId, { autoClose: 300 });
    vi.advanceTimersByTime(1000);
    expect(store.notifications.value).toHaveLength(1);

    store.resume(pausedId);
    vi.advanceTimersByTime(299);
    expect(store.notifications.value).toHaveLength(1);
    vi.advanceTimersByTime(1);
    expect(store.notifications.value).toHaveLength(0);
  });

  it("creates unique runtime-safe notification ids", () => {
    const store = createNotifications({ limit: 100 });
    const ids = Array.from({ length: 100 }, (_, index) =>
      store.show({ message: `Message ${index}`, autoClose: false }),
    );

    expect(new Set(ids).size).toBe(ids.length);
    expect(ids.every((id) => id.startsWith("dui-notification-"))).toBe(true);
    store.clean();
  });
});

describe("Notifications renderer", () => {
  it("does not clean a shared store when one renderer unmounts unless ownership is explicit", async () => {
    const store = createNotifications();
    store.show({ message: "Shared state", autoClose: false });

    const first = mount(Notifications, { props: { store } });
    const second = mount(Notifications, { props: { store } });

    first.unmount();
    expect(store.notifications.value).toHaveLength(1);
    expect(second.text()).toContain("Shared state");

    const owner = mount(Notifications, {
      props: { store, cleanOnUnmount: true },
    });
    owner.unmount();
    await nextTick();

    expect(store.notifications.value).toEqual([]);
    expect(second.findAll('[role="status"]')).toHaveLength(0);
    second.unmount();
  });

  it("announces simultaneous notifications independently and keeps controls outside live regions", async () => {
    const store = createNotifications();
    const wrapper = mount(Notifications, { props: { store } });

    const first = store.show({
      title: "Saved",
      message: "Profile updated",
      autoClose: false,
    });
    store.show({ message: "Upload complete", autoClose: false });
    await nextTick();

    const statuses = wrapper.findAll('[role="status"]');
    expect(statuses).toHaveLength(2);
    expect(
      statuses.every(
        (status) =>
          status.attributes("aria-live") === "polite" &&
          status.attributes("aria-atomic") === "true",
      ),
    ).toBe(true);
    expect(statuses[0]?.text()).toContain("Saved");
    expect(statuses[1]?.text()).toContain("Upload complete");
    expect(statuses.every((status) => !status.find("button").exists())).toBe(
      true,
    );

    store.update(first, { message: "Profile and preferences updated" });
    await nextTick();
    const updatedStatuses = wrapper.findAll('[role="status"]');
    expect(updatedStatuses[0]?.text()).toContain(
      "Profile and preferences updated",
    );
    expect(updatedStatuses[1]?.text()).toContain("Upload complete");

    wrapper.unmount();
    store.clean();
  });

  it("uses a native keyboard-focusable dismiss button", async () => {
    const store = createNotifications();
    store.show({
      title: "Saved",
      message: "Changes stored",
      autoClose: false,
    });
    const wrapper = mount(Notifications, {
      attachTo: document.body,
      props: { store },
    });

    const button = wrapper.get("button");
    expect(button.element.tagName).toBe("BUTTON");
    expect(button.attributes("type")).toBe("button");
    expect(button.attributes("aria-label")).toBe("Dismiss Saved notification");

    (button.element as HTMLButtonElement).focus();
    expect(document.activeElement).toBe(button.element);
    await button.trigger("click");
    expect(store.notifications.value).toEqual([]);

    wrapper.unmount();
  });
});

describe("Notifications theme contract", () => {
  it("uses doctui tokens for notification visuals and toast stacking", async () => {
    const css = await readFile(
      resolve(process.cwd(), "packages/notifications/src/styles.css"),
      "utf8",
    );

    expect(css).toMatch(
      /\.dui-Notifications[\s\S]*z-index:\s*var\(--dui-z-index-toast\)/,
    );
    for (const token of [
      "--dui-spacing-sm",
      "--dui-spacing-md",
      "--dui-color-surface-raised",
      "--dui-color-border",
      "--dui-color-text",
      "--dui-radius-md",
      "--dui-shadow-md",
      "--dui-color-focus-ring",
    ]) {
      expect(css).toContain(`var(${token})`);
    }
    expect(css).not.toMatch(/#[0-9a-f]{3,8}\b|rgb\(/i);
  });
});
