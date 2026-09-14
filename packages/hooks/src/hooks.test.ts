import { describe, expect, it, vi } from "vitest";
import { nextTick, ref } from "vue";
import {
  useDebouncedCallback,
  useDebouncedValue,
  useDisclosure,
  useLocalStorage,
} from "./index";

describe("@doctui/hooks", () => {
  it("provides predictable disclosure state transitions", () => {
    const disclosure = useDisclosure();
    expect(disclosure.opened.value).toBe(false);
    disclosure.open();
    expect(disclosure.opened.value).toBe(true);
    disclosure.toggle();
    expect(disclosure.opened.value).toBe(false);
    disclosure.setOpened(true);
    disclosure.close();
    expect(disclosure.opened.value).toBe(false);
  });

  it("debounces reactive values and callbacks with cancellation", async () => {
    vi.useFakeTimers();
    const source = ref("before");
    const debounced = useDebouncedValue(source, 100);
    const callback = vi.fn();
    const run = useDebouncedCallback(callback, 100);
    source.value = "after";
    run("first");
    run("second");
    await nextTick();
    expect(debounced.value).toBe("before");
    vi.advanceTimersByTime(100);
    expect(debounced.value).toBe("after");
    expect(callback).toHaveBeenCalledOnce();
    expect(callback).toHaveBeenCalledWith("second");
    run.cancel();
    vi.useRealTimers();
  });

  it("reads and persists local storage without requiring it during import", async () => {
    localStorage.setItem("doctui-test", JSON.stringify({ count: 1 }));
    const state = useLocalStorage("doctui-test", { count: 0 });
    expect(state.value.value).toEqual({ count: 1 });
    state.value.value = { count: 2 };
    await nextTick();
    expect(JSON.parse(localStorage.getItem("doctui-test") ?? "null")).toEqual({
      count: 2,
    });
    state.remove();
    expect(localStorage.getItem("doctui-test")).toBeNull();
  });
});
