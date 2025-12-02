<script setup lang="ts">

import {useAdvanceFilterForm} from "@/hooks/form/use-advance-filters-form.ts";
import {type AdvanceFilterTaskRequest, sortDirection, taskFields} from "@/types/tasks.schema.ts";
import {watch} from "vue";

const visible = defineModel<boolean | undefined>('visible')

const {
  state,
  v$,
  submitForm,
  addSort,
  removeSort,
  setState,
  reset
} = useAdvanceFilterForm();

async function applyFilters() {
  await submitForm()
  emit("update:filters", { ...state })
  visible.value = false;
}

function resetFilters() {
  reset()
  state.sorts = []
  emit("update:filters", { ...state })
}

const props = defineProps<{ filters: AdvanceFilterTaskRequest }>()
const emit = defineEmits<{ (e: "update:filters", v: AdvanceFilterTaskRequest): void }>()
watch(
    () => props.filters.keyword,
    (val) => state.keyword = val ?? "",
    {immediate: true, deep: true}
)
</script>

<template>
  <Dialog
      v-model:visible="visible"
      modal
      class="container"
  >
    <form @submit.prevent="applyFilters">

      <!-- Header -->
      <h2 class="form-title">Advance Filters</h2>

      <!-- Keyword -->
      <div class="form-group" :class="{ error: v$.keyword.$errors.length }">
        <label for="keyword">Keyword</label>
        <input id="keyword" name="keyword" type="text" v-model="state.keyword" placeholder="Search tasks..."/>
        <div class="input-errors" v-for="error of v$.keyword.$errors" :key="error.$uid">
          <span class="error-msg">{{ error.$message }}</span>
        </div>
      </div>

      <!-- Date Range -->
      <div class="form-row">
        <div class="form-group" :class="{ error: v$.fromDate.$errors.length }">
          <label for="fromDate">From date</label>
          <input id="fromDate" name="fromDate" v-model="state.fromDate" type="date"/>
          <div class="input-errors" v-for="error of v$.fromDate.$errors" :key="error.$uid">
            <span class="error-msg">{{ error.$message }}</span>
          </div>
        </div>

        <div class="form-group" :class="{ error: v$.toDate.$errors.length }">
          <label for="toDate">To date</label>
          <input id="toDate" name="toDate" v-model="state.toDate" type="date"/>
          <div class="input-errors" v-for="error of v$.toDate.$errors" :key="error.$uid">
            <span class="error-msg">{{ error.$message }}</span>
          </div>
        </div>
      </div>

      <!-- Sort Section -->
      <div class="sort-section">
        <h3>Sorting</h3>
        <div v-for="(s, i) in state.sorts" :key="i" class="sort-item">

          <div class="form-group" :class="{ error: v$.sorts.$errors.length }">
            <label for="field">Field</label>
            <select id="field" name="field" v-model="s.field">
              <!-- Default option -->
              <option value="">Choose...</option>

              <!-- Dynamic options -->
              <option
                  v-for="field in taskFields.options"
                  :key="field"
                  :value="field"
              >
                {{ field }}
              </option>
            </select>
            <div class="input-errors" v-for="error of v$.sorts.$errors" :key="error.$uid">
              <span class="error-msg">{{ error.$message }}</span>
            </div>
          </div>

          <div class="form-group" :class="{ error: v$.sorts.$errors.length }">
            <label for="direction">Direction</label>
            <select id="direction" name="direction" v-model="s.direction">
              <!-- Default option -->
              <option value="">Choose...</option>

              <!-- Dynamic options -->
              <option
                  v-for="direction in sortDirection.options"
                  :key="direction"
                  :value="direction"
              >
                {{ direction }}
              </option>
            </select>
            <div class="input-errors" v-for="error of v$.sorts.$errors" :key="error.$uid">
              <span class="error-msg">{{ error.$message }}</span>
            </div>
          </div>

          <button type="button" @click="removeSort(i)" class="sort-remove">Remove</button>
        </div>

        <button type="button" @click="addSort" class="sort-add">Add</button>
      </div>

      <!-- Footer -->
      <div class="filter-footer">
<!--        <button type="button" @click="visible = false">Close</button>-->
        <button type="button" @click="resetFilters">Clear</button>
        <button type="button" @click="applyFilters">Apply</button>
      </div>

    </form>
  </Dialog>
</template>

<style scoped lang="scss">
.container {
  form {
    width: 360px;
    display: flex;
    flex-direction: column;
    gap: var(--s-4);
    background-color: var(--c-surface);

    button {
      &:hover {
        font-weight: var(--f-weight);
      }
    }

    .form-title {
      font-size: var(--f-size-lg);
      font-weight: var(--f-bold);
      margin-bottom: var(--s-4);
    }

    .form-group {
      display: flex;
      flex: 1;
      flex-direction: column;
      gap: var(--s-1);

      label {
        font-weight: var(--f-bold);
      }

      input,
      select {
        width: 100%;
        padding: var(--s-2) var(--s-4);
        border: 1px solid var(--c-border);
        background: var(--c-bg);
        outline: none;
        transition: all 0.2s ease;

        &:focus {
          border-color: var(--c-primary-h);
          box-shadow: var(--shadow-text);
        }
      }

      &.error {
        input,
        select {
          border-color: var(--c-err);
          background: var(--c-err-bg);
        }

        .input-errors {
          margin-top: var(--s-1);
        }
      }
    }

    .form-row {
      display: flex;
      flex-direction: row;
      gap: var(--s-3);
    }

    .sort-section {
      display: flex;
      flex-direction: column;
      gap: var(--s-3);

      h3 {
        font-weight: var(--f-bold);
        margin-bottom: var(--s-2);
      }

      .sort-item {
        display: flex;
        gap: var(--s-3);
        align-items: end;

        .form-group {
          flex: 1;
        }

        .sort-remove {
          padding: var(--s-2) var(--s-3);
          border: 1px solid var(--c-border);
          background: var(--c-bg);
          cursor: pointer;
          transition: all 0.2s ease;

          &:hover {
            background: var(--c-primary-h);
            color: white;
          }
        }
      }

      .sort-add {
        padding: var(--s-2) var(--s-4);
        background: var(--c-primary);
        color: white;
        cursor: pointer;
        transition: all 0.2s ease;

        &:hover {
          background: var(--c-primary-h);
        }
      }
    }

    .filter-footer {
      display: flex;
      justify-content: flex-end;
      gap: var(--s-3);
    }
  }
}
</style>
