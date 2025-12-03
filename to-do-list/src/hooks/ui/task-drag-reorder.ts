import {ref} from "vue";
import {type DragTaskInfo, type TaskItem, updateTaskStatusRequest} from "@/types/tasks.schema.ts";
import {useUpdateTaskStatusMutation} from "@/hooks/mutations/task.mutation.ts";
import {useToast} from "primevue/usetoast";

export function taskDragReorder(mutation: ReturnType<typeof useUpdateTaskStatusMutation>, toast: ReturnType<typeof useToast>) {
    const dragTask = ref<DragTaskInfo | null>(null)
    const highlightMap = ref<Record<string, { index: number, side: "top" | "bottom" | null }>>({})
    const dragOverLastStatus = ref<string | null>(null)

    function onTaskDragStart(event: DragEvent, id: string, index: number, columnKey: string) {
        dragTask.value = {id, index, columnKey}
        dragOverLastStatus.value = dragTask.value.columnKey!

        // Disable html default drag effect
        const img = new Image()
        img.src = ""
        event.dataTransfer?.setDragImage(img, 0, 0)
    }

    function onTaskDragEnd() {
        dragTask.value = null
        highlightMap.value = {}
    }

    function detectTaskHighlight(event: DragEvent, selector: string, columnKey: string) {
        if (!dragTask.value) return

        if (dragOverLastStatus.value) {
            highlightMap.value = {}
            dragOverLastStatus.value = columnKey
        }

        const parent = event.currentTarget as HTMLElement
        const elements = parent.getElementsByClassName(selector) as HTMLCollectionOf<HTMLElement>
        const y = event.clientY

        for (let i = 0; i < elements.length; i++) {
            const rect = elements[i]!.getBoundingClientRect()
            const midY = rect.top + rect.height / 2

            if (y < midY) {
                highlightMap.value[columnKey] = {index: i, side: "top"}
                return
            }
        }

        highlightMap.value[columnKey] = {index: elements.length - 1, side: "bottom"}
    }

    function applyTaskReorder(tasksByStatus: Record<string, TaskItem[]>, targetStatus: string): Record<string, TaskItem[]> {
        if (!dragTask.value) return tasksByStatus

        const fromStatus = dragTask.value.columnKey!
        const fromIndex = dragTask.value.index!
        const highlight = highlightMap.value[targetStatus]!

        let toIndex = highlight.index

        const fromArr = [...tasksByStatus[fromStatus]!]
        const moved = fromArr.splice(fromIndex, 1)[0]!

        // Sync 'tasksByStatus' with 'fromArr'
        tasksByStatus[fromStatus] = fromArr

        const toArr = [...tasksByStatus[targetStatus]!]

        // Handle task index from old to new position
        if (fromStatus === targetStatus) {
            if (highlight.side === "bottom" && fromIndex >= toIndex) toIndex++
            if (highlight.side === "top" && fromIndex < toIndex) toIndex--

        } else {
            // Move task to last position of other status must take index + 1
            // Because this status column don't delete any task
            if (highlight.side === "bottom") toIndex++
        }

        // Handle special case of first and last position
        if (toIndex < 0) toIndex = 0
        if (toIndex > toArr.length) toIndex = toArr.length

        toArr.splice(toIndex, 0, moved)

        console.log("Moved Task ID:" + dragTask.value.id)
        console.log("From Priority:" + fromIndex)
        console.log("To Priority:" + toIndex)
        console.log("From Status:" + fromStatus)
        console.log("To Status:" + targetStatus)

        mutation.mutate(updateTaskStatusRequest.parse({
            id: dragTask.value.id,
            statusId: targetStatus,
            priority: toIndex
        }), {
            onSuccess: () => {
                console.log("Task created successfully");
                toast.add({
                    severity: "success", // success | info | warn | error | secondary | contrast
                    summary: "Done",
                    detail: "Task has been updated",
                    life: 3000, // milliseconds
                });
            },
            onError: (error) => {
                console.error("Error creating task:", error);
                toast.add({
                    severity: "error",
                    summary: "Task Update Failed",
                    detail: error.message,
                    life: 3000,
                });
            }
        })

        return {
            ...tasksByStatus,
            [targetStatus]: toArr
        }
    }

    return {
        dragTask,
        highlightMap,
        onTaskDragStart,
        onTaskDragEnd,
        detectTaskHighlight,
        applyTaskReorder
    }
}
