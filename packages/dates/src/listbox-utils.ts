export function listboxKeydown(
  event: KeyboardEvent,
  index: number,
  count: number,
  focus: (index: number) => void,
): void {
  let next: number | null = null;

  switch (event.key) {
    case "ArrowRight":
    case "ArrowDown":
      next = Math.min(count - 1, index + 1);
      break;
    case "ArrowLeft":
    case "ArrowUp":
      next = Math.max(0, index - 1);
      break;
    case "Home":
      next = 0;
      break;
    case "End":
      next = count - 1;
      break;
    default:
      return;
  }

  event.preventDefault();
  focus(next);
}
