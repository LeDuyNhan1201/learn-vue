<script setup lang="ts">
import { defineProps, defineEmits } from "vue";
import {formatVNDate} from "@/helper/utils.ts";

const props = defineProps<{
  task: any;
  col: any;
  statuses: any[];
  isEditing: boolean;
}>();

const emit = defineEmits(["stop"]);

const stop = () => emit("stop");
</script>

<template>
  <!-- Editing mode -->
  <template v-if="isEditing">
    <!-- Text -->
    <input
        v-if="col.key === 'title'"
        type="text"
        v-model="task[col.key]"
        @keyup.enter="stop"
        @blur="stop"
    />

    <!-- Status dropdown -->
    <select
        v-else-if="col.key === 'status'"
        v-model="task.status"
        @change="stop"
        @blur="stop"
    >
      <option v-for="s in statuses" :value="s">{{ s.title }}</option>
    </select>

    <!-- Date fields -->
    <input
        v-else-if="['startDay', 'targetDay', 'endDay'].includes(col.key)"
        type="date"
        v-model="task[col.key]"
        @blur="stop"
    />
  </template>

  <!-- View mode -->
  <template v-else>
    <a :href="task.id + '/details'" v-if="col.key === 'title'">
      {{ task.title }}
    </a>

    <span v-else-if="col.key === 'assignees'">
      {{ task.assignees?.join(', ') }}
    </span>

    <span v-else-if="col.key === 'status'">
      {{ task.status?.title }}
    </span>

    <span v-else-if="['startDay','targetDay','endDay'].includes(col.key)">
      {{ formatVNDate(task[col.key]) }}
    </span>

    <span v-else>
      {{ task[col.key] }}
    </span>
  </template>
</template>
