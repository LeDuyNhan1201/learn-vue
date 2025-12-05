<script setup lang="ts">
import { useTaskForm } from "@/hooks/form/create-task.form.ts";
import { useGetStatusesQuery } from "@/hooks/queries/task.query.ts";
import { createTaskRequest } from "@/types/tasks.schema.ts";
import { fieldLabel, today } from "@/helper/utils.ts";
import { useCreateTaskMutation } from "@/hooks/mutations/task.mutation.ts";
import { useToast } from "primevue/usetoast";
import { useRouter } from "vue-router";

const { data: taskStatuses } = useGetStatusesQuery();

const { v$, state, validate } = useTaskForm({
  title: "",
  // assignees: ["test"] as string[],
  statusId: "",
  startDay: today(),
  targetDay: today(),
  endDay: today(),
});

// const assigneesString = computed({
//   get: () => state.assignees.join(", "),
//   set: (val: string) => {
//     state.assignees = val.split(",").map((v) => v.trim()).filter(Boolean);
//   },
// });

const { mutate, isPending } = useCreateTaskMutation();

const toast = useToast();

const router = useRouter();

async function onSubmit() {
  const isValid = await validate();
  if (!isValid) {
    console.log("Validation failed");
    return;
  }
  mutate(createTaskRequest.parse(state), {
    onSuccess: () => {
      toast.add({
        severity: "success",
        summary: "Done",
        detail: "Task has been created successfully",
        life: 3000,
      });

      router.push("/tasks");
    },
    onError: (error) => {
      toast.add({
        severity: "error",
        summary: "Task Creation Failed",
        detail: error.message || "An error occurred while creating the task.",
        life: 3000,
      });
    },
  });
}
</script>

<template>
  <div class="container">
    <form @submit.prevent="onSubmit">
      <h2 class="form-title">New Task</h2>

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
          v-for="error of v$.title.$errors"
          :key="error.$uid"
        >
          <span class="error-msg">{{ error.$message }}</span>
        </div>
      </div>

      <!--      <div :class="{ error: v$.assignees.$errors.length }">-->
      <!--        <label for="assignees">Assignees (comma separated)</label>-->
      <!--        <input id="assignees" name="assignees" v-model="assigneesString" type="text"/>-->
      <!--        <div class="input-errors" v-for="error of v$.assignees.$errors" :key="error.$uid">-->
      <!--          <span class="error-msg">{{ error.$message }}</span>-->
      <!--        </div>-->
      <!--      </div>-->

      <!-- Status -->
      <div
        :class="{ error: v$.statusId.$errors.length }"
        class="form-group"
      >
        <label for="status">Status</label>
        <select
          id="status"
          name="status"
          v-model="state.statusId"
        >
          <option value="">Choose...</option>
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

      <button
        type="button"
        :disabled="isPending"
        @click="onSubmit"
      >
        Create Task
      </button>
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

  button {
    width: 100%;
  }
}
</style>
