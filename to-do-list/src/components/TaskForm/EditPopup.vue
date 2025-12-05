<script setup lang="ts">
import {taskIdPathParam, updateTaskRequest} from "@/types/tasks.schema.ts";
import {computed, onMounted, ref, watch} from "vue";
import {fieldLabel, formatDate, today} from "@/helper/utils.ts";
import {useToast} from "primevue/usetoast";
import {useGetStatusesQuery, useGetTaskDetailsQuery} from "@/hooks/queries/task.query.ts";
import {useTaskForm} from "@/hooks/form/create-task.form.ts";
import {useUpdateTaskMutation} from "@/hooks/mutations/task.mutation.ts";
import {useRoute, useRouter} from "vue-router";

const route = useRoute();
const router = useRouter();
const visible = ref(true);

watch(visible, (v) => {
  if (!v) onClose();
});

function onClose() {
  router.push("/tasks");
}

const toast = useToast();
const taskId = computed(() => {
  return taskIdPathParam.parse({id: route.params.id as string});
});

const {data: taskStatuses} = useGetStatusesQuery();
const {data: selectedTask} = useGetTaskDetailsQuery(() => taskId.value, {
  enabled: computed(() => visible.value === true),
});

const currentTask = computed(() => {
  if (!selectedTask.value || !selectedTask.value.status) return null;

  const statusId = selectedTask.value.status.id;
  const statusTitle = taskStatuses.value?.find((s) => s.id === statusId)?.title || "";

  return updateTaskRequest.parse({
    ...selectedTask.value,
    startDay: formatDate(selectedTask.value.startDay!),
    targetDay: formatDate(selectedTask.value.targetDay!),
    endDay: formatDate(selectedTask.value.endDay!),
    statusId,
    status: {id: statusId, title: statusTitle},
  });
});

const {validate, v$, state, setState} = useTaskForm({
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
      {immediate: true},
  );
});

const {mutate: updateMutate, isPending: updateIsPending} = useUpdateTaskMutation();

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

  updateMutate(
      {
        taskId: taskId.value,
        body: updateTaskRequest.parse(state),
      },
      {
        onSuccess: () => {
          showToast("success", "Done", "Task has been updated successfully");
          onClose();
        },
        onError: (error) =>
            showToast("error", "Task Update Failed", error.message || "An error occurred"),
      },
  );
}
</script>

<template>
  <Dialog
      @hide="onClose"
      v-model:visible="visible"
      modal
      class="container"
  >
    <form @submit.prevent="onSubmit">
      <!-- Header -->
      <h2 class="form-title">Editing...</h2>

      <!-- Title -->
      <div
          :class="{ error: v$.title.$errors.length }"
          class="form-group"
      >
        <label for="title">Title</label>
        <input
            id="title"
            name="title"
            v-model="state.title"
            type="text"
        />
        <div
            class="input-errors"
            v-for="error in v$.title.$errors"
            :key="error.$uid"
        >
          <span class="error-msg">{{ error.$message }}</span>
        </div>
      </div>

      <!-- Status -->
      <div
          :class="{ error: v$.statusId.$errors.length }"
          class="form-group"
      >
        <label for="status">Status</label>
        <select
            id="status"
            name="statusId"
            v-model="state.statusId"
        >
          <option :value="undefined">Choose...</option>
          <option
              v-for="status in taskStatuses"
              :key="status.id"
              :value="status.id"
          >
            {{ status.title }}
          </option>
        </select>
        <div
            class="input-errors"
            v-for="error in v$.statusId.$errors"
            :key="error.$uid"
        >
          <span class="error-msg">{{ error.$message }}</span>
        </div>
      </div>

      <!-- Dates -->
      <template
          v-for="field of ['startDay', 'targetDay', 'endDay']"
          :key="field"
      >
        <div
            :class="{ error: v$[field].$errors.length }"
            class="form-group"
        >
          <label :for="field">{{ fieldLabel(field) }}</label>
          <input
              :id="field"
              :name="field"
              v-model="state[field]"
              type="date"
          />
          <div
              class="input-errors"
              v-for="error in v$[field].$errors"
              :key="error.$uid"
          >
            <span class="error-msg">{{ error.$message }}</span>
          </div>
        </div>
      </template>

      <!-- Buttons -->
      <button
          type="button"
          :disabled="updateIsPending"
          @click="onSubmit"
      >
        Save Task
      </button>
    </form>
  </Dialog>
</template>

<style scoped lang="scss">
.container {
  form {
    width: 500px;
    background: var(--c-surface);

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

    button[type="button"] {
      width: 100%;
      padding: var(--s-2) var(--s-4);
      background: var(--c-primary);
      color: white;
      cursor: pointer;
      transition: all 0.2s ease;

      &:hover {
        background: var(--c-primary-h);
        font-weight: var(--f-weight);
      }
    }
  }
}
</style>
