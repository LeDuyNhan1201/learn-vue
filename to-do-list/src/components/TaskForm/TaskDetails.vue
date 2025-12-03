<script setup lang="ts">

import {computed, onMounted, watch} from "vue";
import {taskIdPathParam, updateTaskRequest} from "@/types/tasks.schema.ts";
import {useCreateTaskForm} from "@/hooks/form/create-task.form.ts";
import {fieldLabel, formatDate, today} from "@/helper/utils.ts";
import {useGetStatusesQuery, useGetTaskDetailsQuery} from "@/hooks/queries/task.query.ts";
import {useRoute, useRouter} from "vue-router";
import {useConfirm} from "primevue/useconfirm";
import {useDeleteTaskMutation, useUpdateTaskMutation} from "@/hooks/mutations/task.mutation.ts";
import {useToast} from "primevue/usetoast";

const confirm = useConfirm();
const toast = useToast();
const route = useRoute();
const router = useRouter();
const taskId = taskIdPathParam.parse({id: route.params.id as string});

const {data: taskStatuses} = useGetStatusesQuery();
const {
  data: selectedTask,
} = useGetTaskDetailsQuery(taskId);

const currentTask = computed(() => {
  if (!selectedTask.value || !selectedTask.value.status) return null;

  const statusId = selectedTask.value.status.id;
  const statusTitle = taskStatuses.value?.find(s => s.id === statusId)?.title || "";

  return updateTaskRequest.parse({
    ...selectedTask.value,
    startDay: formatDate(selectedTask.value.startDay!),
    targetDay: formatDate(selectedTask.value.targetDay!),
    endDay: formatDate(selectedTask.value.endDay!),
    statusId,
    status: {id: statusId, title: statusTitle},
  });
});

const {validate, v$, state, setState} = useCreateTaskForm({
  title: "",
  statusId: "",
  startDay: today(),
  targetDay: today(),
  endDay: today(),
});

// Sync form state with currentTask
onMounted(() => {
  watch(
      () => currentTask.value,
      async (task) => {
        if (task) {
          setState(task);
          await validate();
        }
      },
      {immediate: true}
  );
});

const {mutate: updateMutate, isPending: updateIsPending} = useUpdateTaskMutation(taskId);
const {mutate: deleteMutate, isPending: deleteIsPending} = useDeleteTaskMutation();

// Generic toast helper
function showToast(severity: "success" | "error", summary: string, detail: string) {
  toast.add({severity, summary, detail, life: 3000});
}

// Update task
async function onSubmit() {
  const isValid = await validate();
  if (!isValid) {
    console.log("Validation failed");
    return;
  }

  updateMutate(updateTaskRequest.parse(state), {
    onSuccess: () => showToast("success", "Done", "Task has been updated successfully"),
    onError: (error) => showToast("error", "Task Update Failed", error.message || "An error occurred"),
  });
}

// Delete task
function deleteTask() {
  confirm.require({
    message: `Are you sure you want to delete this task?`,
    header: `Task '${state.title}'`,
    icon: "",
    acceptLabel: "Yes",
    rejectLabel: "No",
    accept: () => {
      deleteMutate(taskId, {
        onSuccess: () => {
          showToast("success", "Done", "Task has been deleted successfully")
          router.push("/tasks");
        },
        onError: (error) => showToast("error", "Task Deletion Failed", error.message || "An error occurred"),
      });
    },
    reject: () => {
    },
  });
}
</script>

<template>
  <div class="container">
    <form @submit.prevent="onSubmit">
      <h2 class="form-title">Details</h2>

      <!-- Title -->
      <div :class="{ error: v$.title.$errors.length }" class="form-group">
        <label for="title">Title</label>
        <input id="title" name="title" v-model="state.title" type="text"/>
        <div class="input-errors" v-for="error in v$.title.$errors" :key="error.$uid">
          <span class="error-msg">{{ error.$message }}</span>
        </div>
      </div>

      <!-- Status -->
      <div :class="{ error: v$.statusId.$errors.length }" class="form-group">
        <label for="status">Status</label>
        <select id="status" name="statusId" v-model="state.statusId">
          <option :value="undefined">Choose...</option>
          <option v-for="status in taskStatuses" :key="status.id" :value="status.id">
            {{ status.title }}
          </option>
        </select>
        <div class="input-errors" v-for="error in v$.statusId.$errors" :key="error.$uid">
          <span class="error-msg">{{ error.$message }}</span>
        </div>
      </div>

      <!-- Dates -->
      <template v-for="field of ['startDay', 'targetDay', 'endDay']" :key="field">
        <div :class="{ error: v$[field].$errors.length }" class="form-group">
          <label :for="field">{{ fieldLabel(field) }}</label>
          <input :id="field" :name="field" v-model="state[field]" type="date"/>
          <div class="input-errors" v-for="error in v$[field].$errors" :key="error.$uid">
            <span class="error-msg">{{ error.$message }}</span>
          </div>
        </div>
      </template>

      <!-- Buttons -->
      <div class="btn-group">
        <button type="button" :disabled="updateIsPending" @click="onSubmit">Save Task</button>
        <button type="button" :disabled="deleteIsPending" @click="deleteTask">Delete Task</button>
      </div>
    </form>
  </div>
</template>

<style scoped lang="scss">
/* FORM CONTAINER */
.container {
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
}

/* FORM */
form {
  width: 500px;
  padding: var(--s-6);
  background: var(--c-bg);
  border: 1px solid var(--c-border);

  /* Form title */
  .form-title {
    text-align: start;
    margin-bottom: var(--s-6);
  }

  /* Form groups */
  .form-group {
    display: flex;
    flex-direction: column;
    margin-bottom: var(--s-4);

    label {
      font-weight: var(--f-bold);
      margin-bottom: var(--s-2);
    }

    input,
    select {
      padding: var(--s-2) var(--s-4);
      border: 1px solid var(--c-border);
      background: var(--c-bg);
      transition: 0.2s ease;
      outline: none;

      &:focus {
        border-color: var(--c-primary-h);
        box-shadow: var(--shadow-text);
      }
    }

    &.error {
      input,
      select {
        border-color: var(--c-err) !important;
        background: var(--c-err-bg);
      }

      .input-errors {
        margin-top: var(--s-1);

        .error-msg {
          color: var(--c-err);
        }
      }
    }
  }

  /* Button group */
  .btn-group {
    display: flex;
    flex-direction: row-reverse;
    gap: var(--s-3);
    margin-top: var(--s-1);

    button[type="button"] {
      flex: 1;
    }
  }
}
</style>
