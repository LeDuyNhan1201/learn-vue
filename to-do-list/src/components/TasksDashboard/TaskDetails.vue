<script setup lang="ts">

import {computed, onMounted} from "vue";
import {statusOptions, taskStatus} from "@/types/tasks.schema.ts";
import {useCreateTaskForm} from "@/hooks/form/use-create-task.form.ts";
import {v4 as uuidv4} from "uuid";

async function fetchTask(id: string): Promise<any> {
  console.log(id);
  return {
    title: "asasfafsafsasf",
    // assignees: ["asfasfasf"] as string[],
    status: taskStatus.parse({id: uuidv4(), title: "To do"}),
    startDay: "2025-01-12",
    targetDay: "2025-01-12",
    endDay: "2025-01-12"
  }
}

const statuses = statusOptions

const {
  validate,
  v$,
  state,
  methods,
} = useCreateTaskForm();

onMounted(async () => {
  const data = await fetchTask("123");
  methods.setState(data);
  await validate();
});

const filteredStatuses = computed(() =>
    statuses.filter(status => status.title !== state.status.title)
);

async function onSubmit() {
  console.log("Submit called!");
  await methods.submitForm()
}
</script>

<template>
  <div class="container">
    <form @submit.prevent="onSubmit">
      <h2 class="form-title">Details</h2>

      <div :class="{ error: v$.title.$errors.length }">
        <label for="title">Title</label>
        <input id="title" name="title" v-model="state.title" type="text"/>
        <div class="input-errors" v-for="error of v$.title.$errors" :key="error.$uid">
          <span class="error-msg">{{ error.$message }}</span>
        </div>
      </div>

      <div :class="{ error: v$.status.$errors.length }">
        <label for="status">Status</label>
        <select id="status" name="status" v-model="state.status">
          <!-- Default option (đang chọn) -->
          <option :value="state.status">{{ state.status.title }}</option>

          <!-- Các option còn lại -->
          <option
              v-for="status in filteredStatuses"
              :key="status.id"
              :value="status"
          >
            {{ status.title }}
          </option>
        </select>
        <div class="input-errors" v-for="error of v$.status.$errors" :key="error.$uid">
          <span class="error-msg">{{ error.$message }}</span>
        </div>
      </div>

      <div :class="{ error: v$.startDay.$errors.length }">
        <label for="startDay">Start Day</label>
        <input id="startDay" name="startDay" v-model="state.startDay" type="date"/>
        <div class="input-errors" v-for="error of v$.startDay.$errors" :key="error.$uid">
          <span class="error-msg">{{ error.$message }}</span>
        </div>
      </div>

      <div :class="{ error: v$.targetDay.$errors.length }">
        <label for="targetDay">Target Day</label>
        <input id="targetDay" name="targetDay" v-model="state.targetDay" type="date"/>
        <div class="input-errors" v-for="error of v$.targetDay.$errors" :key="error.$uid">
          <span class="error-msg">{{ error.$message }}</span>
        </div>
      </div>

      <div :class="{ error: v$.endDay.$errors.length }">
        <label for="endDay">End Day</label>
        <input id="endDay" name="endDay" v-model="state.endDay" type="date"/>
        <div class="input-errors" v-for="error of v$.endDay.$errors" :key="error.$uid">
          <span class="error-msg">{{ error.$message }}</span>
        </div>
      </div>

      <button @click="onSubmit" type="button">Save Task</button>

    </form>
  </div>
</template>

<style scoped>
.container {
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
}

form {
  width: 500px;
  padding: var(--space-6);
  background: var(--color-bg);
  border: 1px solid var(--color-border);
}

.form-title {
  text-align: start;
  margin-bottom: var(--space-6);
}

/* Form group */
form > div {
  display: flex;
  flex-direction: column;
  margin-bottom: var(--space-4);
}

/* Label */
label {
  font-weight: var(--font-weight-bold);
  margin-bottom: var(--space-2);
}

/* Input + Select */
input,
select {
  padding: var(--space-2) var(--space-4);
  border: 1px solid var(--color-border);
  background: var(--color-bg);
  transition: all 0.2s ease;
  outline: none;
}

input:focus,
select:focus {
  border-color: var(--color-primary-hover);
  box-shadow: var(--box-shadow-text-box);
}

/* Error state */
.error input,
.error select {
  border-color: var(--color-error-msg) !important;
  background: var(--color-error-bg);
}

.input-errors {
  margin-top: var(--space-1);
}

.error-msg {
  color: var(--color-error-msg);
}

/* Submit Button */
button[type="button"] {
  width: 100%;
  margin-top: var(--space-1);
}

</style>