<script setup lang="ts">

import {computed} from "vue";
import {useCreateTaskForm} from "@/hooks/form/use-create-task.form.ts";
import {useGetStatusesQuery} from "@/hooks/queries/task.query.ts";
import {type TaskStatus} from "@/types/tasks.schema.ts";
import {v4 as uuidv4} from "uuid";
import {today} from "@/helper/utils.ts";

const {data: taskStatuses} = useGetStatusesQuery();

const filteredStatuses = computed(() =>
    (taskStatuses.value ?? []).filter(
        s => s.title !== state.status!.title
    )
);

const {
  validate,
  v$,
  state,
  submitForm,
} = useCreateTaskForm({
  title: "",
  // assignees: ["test"] as string[],
  status: taskStatuses.value?.[0] ?? {
    id: uuidv4(),
    title: "To Do",
  } as TaskStatus,
  startDay: today(),
  targetDay: today(),
  endDay: today()
});

validate();

// const assigneesString = computed({
//   get: () => state.assignees.join(", "),
//   set: (val: string) => {
//     state.assignees = val.split(",").map((v) => v.trim()).filter(Boolean);
//   },
// });

async function onSubmit() {
  console.log("Submit called!");
  await submitForm()
}
</script>

<template>
  <div class="container">
    <form @submit.prevent="onSubmit">
      <h2 class="form-title">New Task</h2>

      <div :class="{ error: v$.title.$errors.length }">
        <label for="title">Title</label>
        <input id="title" name="title" v-model="state.title" type="text"/>
        <div class="input-errors" v-for="error of v$.title.$errors" :key="error.$uid">
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

      <div :class="{ error: v$.status.$errors.length }">
        <label for="status">Status</label>
        <select id="status" name="status" v-model="state.status">
          <!-- Default option -->
          <option :value="state.status">{{ state.status!.title }}</option>

          <!-- Dynamic options -->
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

      <button @click="onSubmit" type="button">Create Task</button>

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

  /* Form group */
  > div {
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

    /* Error group */
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

  /* Submit button inside form */
  button[type="button"] {
    width: 100%;
    margin-top: var(--s-1);
  }
}

</style>