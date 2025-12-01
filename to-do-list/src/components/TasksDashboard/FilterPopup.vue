<script setup lang="ts">

import {useAdvanceFilterForm} from "@/hooks/form/use-advance-filters-form.ts";
import {sortDirection, taskFields} from "@/types/tasks.schema.ts";

const visible = defineModel<boolean | undefined>('visible')

const {
  form,
  v$,
  submit,
  addSort,
  removeSort,
  reset
} = useAdvanceFilterForm();

function applyFilters() {
  submit((data) => {
    console.log("Applied filters:", data);
    visible.value = false; // close dialog
  });
}

</script>

<template>
  <Dialog
      v-model:visible="visible"
      modal
      class="filter-popup"
  >
    <div class="filter-form">

      <!-- Header -->
      <h2 class="filter-title">Advance Filters</h2>

      <!-- Keyword -->
      <div class="form-group" :class="{ error: v$.keyword.$errors.length }">
        <label>Keyword</label>
        <InputText v-model="form.keyword" placeholder="Search tasks..." />
        <div class="input-errors" v-for="error of v$.keyword.$errors" :key="error.$uid">
          <span class="error-msg">{{ error.$message }}</span>
        </div>
      </div>

      <!-- Date Range -->
      <div class="form-row">
        <div class="form-group" :class="{ error: v$.fromDate.$errors.length }">
          <label>From Date</label>
          <DatePicker v-model="form.fromDate" dateFormat="yy-mm-dd" />
          <div class="input-errors" v-for="error of v$.fromDate.$errors" :key="error.$uid">
            <span class="error-msg">{{ error.$message }}</span>
          </div>
        </div>

        <div class="form-group" :class="{ error: v$.toDate.$errors.length }">
          <label>To Date</label>
          <DatePicker v-model="form.toDate" dateFormat="yy-mm-dd" />
          <div class="input-errors" v-for="error of v$.toDate.$errors" :key="error.$uid">
            <span class="error-msg">{{ error.$message }}</span>
          </div>
        </div>
      </div>

      <!-- Sort Section -->
      <div class="sort-section">
        <h3>Sorting</h3>
        <div v-for="(s, i) in form.sorts" :key="i" class="sort-item">

          <div class="form-group" :class="{ error: v$.sorts.$each[i].field.$errors.length }">
            <Select v-model="s.field" :options="taskFields.options" placeholder="Field"/>
            <div class="input-errors" v-for="error of v$.sorts.$each[i].field.$errors" :key="error.$uid">
              <span class="error-msg">{{ error.$message }}</span>
            </div>
          </div>

          <div class="form-group" :class="{ error: v$.sorts.$each[i].direction.$errors.length }">
            <Select v-model="s.direction" :options="sortDirection.options" placeholder="Direction"/>
            <div class="input-errors" v-for="error of v$.sorts.$each[i].direction.$errors" :key="error.$uid">
              <span class="error-msg">{{ error.$message }}</span>
            </div>
          </div>

          <button type="button" @click="removeSort(i)" class="sort-remove">Remove</button>
        </div>

        <button type="button" @click="addSort" class="sort-add">Add</button>
      </div>

      <!-- Footer -->
      <div class="filter-footer">
        <button type="button" @click="visible = false">Close</button>
        <button type="button" @click="applyFilters">Apply</button>
      </div>

    </div>
  </Dialog>
</template>

<style scoped lang="scss">
.filter-popup {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: var(--s-4);

  .filter-form {
    width: 360px;
    background: var(--c-surface);
    border: 1px solid var(--c-border);
    border-radius: var(--r-md);
    padding: var(--s-6);
    display: flex;
    flex-direction: column;
    gap: var(--s-4);

    .filter-title {
      font-size: var(--f-size-lg);
      font-weight: var(--f-bold);
      margin-bottom: var(--s-4);
    }

    .form-group {
      display: flex;
      flex-direction: column;
      gap: var(--s-1);

      label {
        font-weight: var(--f-bold);
      }

      input,
      select,
      :deep(.p-inputtext),
      :deep(.p-dropdown),
      :deep(.p-calendar .p-inputtext) {
        width: 100%;
        padding: var(--s-2) var(--s-4);
        border: 1px solid var(--c-border);
        border-radius: var(--r-sm);
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
        select,
        :deep(.p-inputtext),
        :deep(.p-dropdown),
        :deep(.p-calendar .p-inputtext) {
          border-color: var(--c-err) !important;
          background: var(--c-err-bg) !important;
        }

        .input-errors {
          margin-top: var(--s-1);
          .error-msg {
            color: var(--c-err);
            font-size: 0.85rem;
          }
        }
      }
    }

    .form-row {
      display: flex;
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
        align-items: flex-start;

        .form-group {
          flex: 1;
        }

        .sort-remove {
          padding: var(--s-2) var(--s-3);
          border-radius: var(--r-sm);
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
        border-radius: var(--r-sm);
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

      button {
        padding: var(--s-2) var(--s-4);
        border-radius: var(--r-sm);
        cursor: pointer;
        transition: all 0.2s ease;

        &:hover {
          background-color: var(--c-primary-h);
          color: white;
        }
      }
    }
  }
}
</style>
