<script setup lang="ts">

import {computed} from "vue";
import {ErrorMessage, Field, Form, useField, useForm} from "vee-validate";
import {statusOptions, type TaskItem, taskItemSchema, taskStatus} from "@/types/tasks.schema.ts";
import {v4 as uuidv4} from "uuid";

const statuses = statusOptions

// Form
const {handleSubmit, errors, values} = useForm<TaskItem>({
  name: "newTask",
  validateOnMount: false,
  validationSchema: taskItemSchema,
  initialValues: {
    title: "abc",
    assignees: ["abc"] as string[],
    status: taskStatus.parse({id: uuidv4(), title: "To do"}),
    startDay: "2025-01-12",
    targetDay: "2025-01-12",
    endDay: "2025-01-12",
    priority: 1,
  },
  // initialErrors: {
  //   id: "",
  //   title: " Error",
  //   assignees: "assignees Error",
  //   status: "status Error",
  //   "status.id": "status.id Error",
  //   "status.title": "status.title Error",
  //   startDay: "startDay Error",
  //   targetDay: "targetDay Error",
  //   endDay: "endDay Error",
  //   priority: "priority Error",
  // }
});

const { value: title } = useField('title')
const { value: assignees } = useField<string[]>('assignees')
const { value: status } = useField('status')
const { value: startDay } = useField('startDay')
const { value: targetDay } = useField('targetDay')
const { value: endDay } = useField('endDay')
const { value: priority } = useField('priority')

// Helper for comma-separated assignees
const assigneesString = computed({
  get: () => assignees.value.join(", "),
  set: (val: string) => {
    assignees.value = val.split(",").map((v) => v.trim()).filter(Boolean);
  },
});

const onSubmit = handleSubmit((values: TaskItem) => {
  console.log("Submit called!");
  console.log(values);
  alert(JSON.stringify(values, null, 2));
})

</script>

<template>
  <form>

    <div>
      <label for="title">Title</label>
      <input id="title" name="title" v-model="title" type="text" />
      <span>{{ errors.title }}</span>
    </div>

    <div>
      <label for="assignees">Assignees (comma separated)</label>
      <input id="assignees" name="assignees" v-model="assigneesString" type="text"/>
      <span>{{ errors.assignees }}</span>
    </div>

    <div>
      <label for="status">Status</label>
      <select id="status" name="status" v-model="status">
        <option selected value="">Select Status</option>
        <option v-for="status in statuses" :key="status.id" :value="status">{{ status.title }}</option>
      </select>
      <span>{{ errors.status }}</span>
    </div>

    <div>
      <label for="startDay">Start Day</label>
      <input id="startDay" name="startDay" v-model="startDay" type="date"/>
      <span>{{ errors.startDay }}</span>
    </div>

    <div>
      <label for="targetDay">Target Day</label>
      <input id="targetDay" name="targetDay" v-model="targetDay" type="date"/>
      <span>{{ errors.targetDay }}</span>
    </div>

    <div>
      <label for="endDay">End Day</label>
      <input id="endDay" name="endDay" v-model="endDay" type="date"/>
      <span>{{ errors.endDay }}</span>
    </div>

    <div>
      <label for="priority">Priority</label>
      <input id="priority" name="priority" v-model.number="priority" type="number" min="1"/>
      <span>{{ errors.priority }}</span>
    </div>

    <button @click="onSubmit" type="button">Create Task</button>

  </form>
</template>

<style scoped>
form {
  display: flex;
  flex-direction: column;
  border: 1px solid var(--color-border);
  padding: var(--space-6);
}

form > div {
  display: block;
  margin-bottom: var(--space-2);
}
</style>