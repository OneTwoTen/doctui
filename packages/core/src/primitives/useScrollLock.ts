import { onBeforeUnmount, type Ref, ref, watch } from "vue";

let lockCount = 0;
let previousOverflow = "";

export function useScrollLock(active: Ref<boolean> | boolean) {
  const state = typeof active === "boolean" ? ref(active) : active;
  let lockedByInstance = false;

  const setLocked = (locked: boolean) => {
    if (typeof document === "undefined" || locked === lockedByInstance) return;

    lockedByInstance = locked;
    if (locked) {
      if (lockCount === 0) previousOverflow = document.body.style.overflow;
      lockCount += 1;
      document.body.style.overflow = "hidden";
      return;
    }

    if (lockCount > 0) lockCount -= 1;
    if (lockCount === 0) document.body.style.overflow = previousOverflow;
  };

  watch(state, setLocked, { immediate: true });
  onBeforeUnmount(() => setLocked(false));
  return { locked: state };
}
