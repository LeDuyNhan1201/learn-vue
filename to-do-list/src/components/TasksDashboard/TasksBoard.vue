<script setup lang="ts">
import {ref, watch, watchEffect} from "vue";
import type {
  StatusesResponse,
  TaskItem,
  TasksResponse,
  TaskStatus,
} from "@/types/tasks.schema.ts";
import {colDragReorder} from "@/hooks/ui/col-drag-reorder.ts";
import {taskDragReorder} from "@/hooks/ui/task-drag-reorder.ts";
import {useGetStatusesQuery, useGetTasksQuery} from "@/hooks/queries/task.query.ts";
import {formatVNDate, prettierStatus} from "@/helper/utils.ts";
import {useToast} from "primevue/usetoast";
import {useUpdateTaskStatusMutation} from "@/hooks/mutations/task.mutation.ts";

const {
  data: taskStatuses,
  isLoading: statusesLoading,
  isFetching: statusesFetching,
} = useGetStatusesQuery();

const {data, isLoading, isFetching} = useGetTasksQuery();

const statuses = ref<StatusesResponse>([]);
const tasks = ref<TasksResponse>([]);

// Group tasks by status
const tasksByStatus = ref<Record<string, TaskItem[]>>({});

function updateTasksByStatus() {
  const map: Record<string, TaskItem[]> = {};

  statuses.value.forEach((status) => {
    map[status.id!] = tasks.value.filter((task) => task.status?.id === status.id);
  });

  tasksByStatus.value = map;
}

// Sync when API fetch done
watchEffect(() => {
  if (taskStatuses.value) {
    statuses.value = [...taskStatuses.value];
  }

  if (data.value) {
    tasks.value = [...data.value];
  }
});

watch([tasks, statuses], updateTasksByStatus, {immediate: true});

const {
  highlightIndex: highlightStatusIndex,
  highlightSide: highlightStatusSide,
  onDragStart: onTitleDragStart,
  onDragEnd: onTitleDragEnd,
  detectHighlight: detectStatusHighlight,
  applyReorder: applyStatusReorder,
} = colDragReorder<TaskStatus>();

const toast = useToast();
const mutation = useUpdateTaskStatusMutation();
const {
  highlightMap: highlightTaskMap,
  onTaskDragStart: onTaskDragStart,
  onTaskDragEnd: onTaskDragEnd,
  detectTaskHighlight: detectTaskHighlight,
  applyTaskReorder: applyTaskReorder,
} = taskDragReorder(mutation, toast);

const columnHighlightClasses = (index: number, statusTitle: string) => {
  const base = prettierStatus(statusTitle);
  const isActive = highlightStatusIndex.value === index;

  return {
    [base]: true,
    [`highlight-left-${base}`]: isActive && highlightStatusSide.value === 'left',
    [`highlight-right-${base}`]: isActive && highlightStatusSide.value === 'right',
  };
};

const taskHighlightClasses = (index: number, statusId: string) => ({
  'highlight-top':
      highlightTaskMap.value[statusId]?.index === index &&
      highlightTaskMap.value[statusId]?.side === 'top',
  'highlight-bottom':
      highlightTaskMap.value[statusId]?.index === index &&
      highlightTaskMap.value[statusId]?.side === 'bottom',
});
</script>

<template>
  <div v-if="isLoading || statusesLoading">Loading...</div>

  <div
      v-else
      class="container"
  >
    <div v-if="statuses.length === 0 || tasks.length === 0">No results</div>

    <div
        v-else
        class="board-columns"
        @dragover.prevent="(event) => detectStatusHighlight(event, 'board-column')"
        @drop="() => (statuses = applyStatusReorder(statuses))"
    >
      <div
          class="board-column"
          v-for="(taskStatus, index) in statuses"
          :key="taskStatus.id"
          :class="columnHighlightClasses(index, taskStatus.title)"
          @dragover.prevent="(event) => detectTaskHighlight(event, 'board-card', taskStatus.id!)"
          @drop="() => (tasksByStatus = applyTaskReorder(tasksByStatus, taskStatus.id!))"
      >
        <div class="status-chip"
             draggable="true"
             @dragstart="(event) => onTitleDragStart(event, index)"
             @dragend="onTitleDragEnd"
        >
          <Chip :class="prettierStatus(taskStatus.title)">
            {{ taskStatus.title }}
          </Chip>
        </div>

        <div class="board-card-container">
          <div
              class="board-card"
              v-for="(task, index) in tasksByStatus[taskStatus.id!]"
              :key="task.id"
              :class="taskHighlightClasses(index, taskStatus.id!)"
              draggable="true"
              @dragstart="(event) => onTaskDragStart(event, task.id!, index, taskStatus.id!)"
              @dragend="onTaskDragEnd"
          >
            <strong>{{ task.title }}</strong>
            <!--              <p>Assignees: {{ task.assignees!.join(', ') }}</p>-->
            <p>Start: {{ formatVNDate(task.startDay) }}</p>
            <p>Target: {{ formatVNDate(task.targetDay) }}</p>
            <p>End: {{ formatVNDate(task.endDay) }}</p>
          </div>
        </div>

        <span v-if="isFetching || statusesFetching">Refreshing...</span>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.container {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: auto;
}

.board-columns {
  display: flex;
  gap: var(--s-2);
  overflow-x: auto;
  padding-bottom: var(--s-2);
  scroll-behavior: smooth;

  /* Optional: Hide vertical scrollbar if needed */
  /* overflow-y: hidden; */
}

.board-column {
  background: var(--c-surface);
  padding: var(--s-3);
  min-width: var(--w-n);
  max-width: var(--w-w);
  display: flex;
  flex-direction: column;

  border: 1px solid var(--c-border);
  transition: border 0.15s ease;

  /* Hover h3 -> highlight column */
  &:has(.status-chip:hover) {
    border-color: var(--c-primary-h);
  }

  &.status-done {
    .board-card-container {
      .board-card {
        strong {
          text-decoration: line-through;
          color: var(--c-primary-h);
        }
      }
    }
  }

  .status-chip {
    text-align: start;
    margin-bottom: var(--s-2);
    cursor: grab;
    padding: var(--s-2);
    transition: border 0.1s ease;

    chip {
      padding: var(--s-2) var(--s-3);
      font-size: 18px;
      font-weight: var(--f-bold);
    }
  }
}

.board-card-container {
  overflow-y: auto;
  scroll-behavior: smooth;
}

.board-card {
  background: var(--c-bg);
  padding: var(--s-2);
  margin-bottom: var(--s-2);
  border: 1px solid var(--c-border);
  cursor: pointer;
  transition: border 0.15s ease;

  &:hover {
    border-color: var(--c-primary-h);
  }
}

/* Highlight states */
.highlight-left {
  box-shadow: inset 4px 0 0 var(--c-primary-h);
}

.highlight-right {
  box-shadow: inset -4px 0 0 var(--c-primary-h);
}

.highlight-top {
  box-shadow: inset 0 4px 0 var(--c-primary-h);
}

.highlight-bottom {
  box-shadow: inset 0 -4px 0 var(--c-primary-h);
}
</style>
