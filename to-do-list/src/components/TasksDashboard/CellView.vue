<script setup lang="ts">
import {defineProps} from "vue";
import {formatVNDate, prettierStatus} from "@/helper/utils.ts";
import type {TaskItem} from "@/types";

const props = defineProps<{
  deleteIsPending: boolean;
  task: TaskItem;
  col: any;
  statuses: any[];
}>();

const emit = defineEmits(["delete"]);
const deleteTask = () => {
  emit("delete", props.task.id);
};
</script>

<template>
  <span v-if="col.key === 'title'">
    {{ task.title }}
  </span>

  <span v-else-if="col.key === 'assignees'">
    {{ task.assignees?.join(", ") }}
  </span>

  <Chip
      :class="prettierStatus(task.status?.title)"
      v-else-if="col.key === 'status'">
    {{ task.status?.title }}
  </Chip>

  <span v-else-if="['startDay', 'targetDay', 'endDay'].includes(col.key)">
    {{ formatVNDate(task[col.key]) }}
  </span>

  <div class="btn-group" v-else-if="col.key === 'actions'">
    <a :href="'table/' + task.id + '/edit'">
      Edit
    </a>
    <button
        :disabled="deleteIsPending"
        @click.stop="deleteTask">
      Delete
    </button>
    <a :href="task.id + '/details'">
      View
    </a>
  </div>

  <span v-else>
    {{ task[col.key] }}
  </span>
</template>

<style lang="scss" scoped>
.status-todo {
  color: var(--c-status-todo);
  font-weight: 600;
}

.status-inprogress {
  color: var(--c-status-inprogress);
  font-weight: 600;
}

.status-done {
  color: var(--c-status-done);
  font-weight: 600;
}

.btn-group {
  display: flex;
  gap: 8px;

  a,
  button {
    padding: 4px 8px;
    border: none;
    background-color: var(--c-primary);
    color: var(--c-bg);
    font-weight: var(--f-bold);
    cursor: pointer;
    border-radius: 4px;
    transition: background-color 0.2s;

    &:hover {
      background-color: var(--c-primary-h);
      font-weight: var(--f-bold);
    }
  }
}
</style>
