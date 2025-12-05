<script setup lang="ts">
import { defineProps } from "vue";
import { formatVNDate } from "@/helper/utils.ts";

const props = defineProps<{
  task: any;
  col: any;
  statuses: any[];
}>();
</script>

<template>
  <a
    :href="task.id + '/details'"
    v-if="col.key === 'title'"
  >
    {{ task.title }}
  </a>

  <span v-else-if="col.key === 'assignees'">
    {{ task.assignees?.join(", ") }}
  </span>

  <span v-else-if="col.key === 'status'">
    {{ task.status?.title }}
  </span>

  <span v-else-if="['startDay', 'targetDay', 'endDay'].includes(col.key)">
    {{ formatVNDate(task[col.key]) }}
  </span>

  <span v-else>
    {{ task[col.key] }}
  </span>
</template>
