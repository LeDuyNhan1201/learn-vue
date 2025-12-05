import { onMounted, onBeforeUnmount } from "vue";

export function useAutoScrollDuringDrag(options?: { speed?: number; threshold?: number }) {
  const speed = options?.speed ?? 50;
  const threshold = options?.threshold ?? 20;

  let frame: number | null = null;

  function stop() {
    if (frame) cancelAnimationFrame(frame);
    frame = null;
  }

  function findScrollableElement(element: HTMLElement | null): HTMLElement | null {
    while (element) {
      const style = getComputedStyle(element);

      const canScroll =
        style.overflowY === "auto" ||
        style.overflowY === "scroll" ||
        style.overflowX === "auto" ||
        style.overflowX === "scroll";

      if (canScroll) return element;
      element = element.parentElement;
    }
    return null;
  }

  function handleDragOver(e: DragEvent) {
    const target = e.target as HTMLElement | null;
    if (!target) return;

    const el = findScrollableElement(target);
    if (!el) {
      stop();
      return;
    }

    const rect = el.getBoundingClientRect();
    const x = e.clientX;
    const y = e.clientY;

    stop();

    // Scroll DOWN
    if (y > rect.bottom - threshold) {
      frame = requestAnimationFrame(function scrollDown() {
        el.scrollTop += speed;
        frame = requestAnimationFrame(scrollDown);
      });
      return;
    }

    // Scroll UP
    if (y < rect.top + threshold) {
      frame = requestAnimationFrame(function scrollUp() {
        el.scrollTop -= speed;
        frame = requestAnimationFrame(scrollUp);
      });
      return;
    }

    // Scroll RIGHT
    if (x > rect.right - threshold) {
      frame = requestAnimationFrame(function scrollRight() {
        el.scrollLeft += speed;
        frame = requestAnimationFrame(scrollRight);
      });
      return;
    }

    // Scroll LEFT
    if (x < rect.left + threshold) {
      frame = requestAnimationFrame(function scrollLeft() {
        el.scrollLeft -= speed;
        frame = requestAnimationFrame(scrollLeft);
      });
      return;
    }
  }

  onMounted(() => {
    window.addEventListener("dragover", handleDragOver);
    window.addEventListener("dragend", stop);
  });

  onBeforeUnmount(() => {
    window.removeEventListener("dragover", handleDragOver);
    window.removeEventListener("dragend", stop);
    stop();
  });
}
