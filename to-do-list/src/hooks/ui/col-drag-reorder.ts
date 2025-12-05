import { ref } from "vue";

export function colDragReorder<T>() {
  const dragIndex = ref<number>(-1);
  const highlightIndex = ref<number>(-1);
  const highlightSide = ref<"left" | "right" | null>(null);

  function onDragStart(event: DragEvent, index: number) {
    dragIndex.value = index;

    // Hide default ghost image
    const img = new Image();
    img.src = "";
    event.dataTransfer?.setDragImage(img, 0, 0);
  }

  function onDragEnd() {
    dragIndex.value = -1;
    highlightIndex.value = -1;
    highlightSide.value = null;
  }

  function detectHighlight(event: DragEvent, selector: string) {
    if (dragIndex.value === -1) return;

    const elements = document.getElementsByClassName(selector) as HTMLCollectionOf<HTMLElement>;
    const x = event.clientX;

    for (let i = 0; i < elements.length; i++) {
      const rect = elements[i]!.getBoundingClientRect();
      const mid = rect.left + rect.width / 2;

      if (x < mid) {
        highlightIndex.value = i;
        highlightSide.value = "left";
        return;
      }
    }

    // Out of bounds → highlight right of last element
    highlightIndex.value = elements.length - 1;
    highlightSide.value = "right";
  }

  function applyReorder(list: T[]) {
    if (dragIndex.value === -1 || highlightIndex.value === -1 || !highlightSide.value) return list;

    const from = dragIndex.value;
    let to = highlightIndex.value;

    const arr = [...list];
    const moved = arr.splice(from, 1)[0]!;

    // adjust target index
    if (highlightSide.value === "right" && from >= to) to++;
    else if (highlightSide.value === "left" && from < to) to--;

    if (to < 0) to = 0;
    if (to > arr.length) to = arr.length;

    arr.splice(to, 0, moved);
    onDragEnd();
    return arr;
  }

  return {
    highlightIndex,
    highlightSide,
    onDragStart,
    onDragEnd,
    detectHighlight,
    applyReorder,
  };
}
