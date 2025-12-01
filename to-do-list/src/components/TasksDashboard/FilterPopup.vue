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
      header="Advance filters"
      v-model:visible="visible"
      modal
      :style="{ backgroundColor: 'var(--color-surface)' }"
  >

    <!-- Keyword -->
    <div :class="{ error: v$.keyword.$errors.length }" class="field">
      <label>Keyword</label>
      <InputText v-model="form.keyword" class="w-full" placeholder="Search tasks..." />
      <div class="input-errors" v-for="error of v$.keyword.$errors" :key="error.$uid">
        <span class="error-msg">{{ error.$message }}</span>
      </div>
    </div>

    <!-- Date Range -->
    <div class="flex gap-3 mt-3">
      <div :class="{ error: v$.fromDate.$errors.length }" class="field flex-1">
        <label>From Date</label>
        <DatePicker v-model="form.fromDate" dateFormat="yy-mm-dd" class="w-full" />
        <div class="input-errors" v-for="error of v$.fromDate.$errors" :key="error.$uid">
          <span class="error-msg">{{ error.$message }}</span>
        </div>
      </div>

      <div :class="{ error: v$.toDate.$errors.length }" class="field flex-1">
        <label>To Date</label>
        <DatePicker v-model="form.toDate" dateFormat="yy-mm-dd" class="w-full" />
        <div class="input-errors" v-for="error of v$.toDate.$errors" :key="error.$uid">
          <span class="error-msg">{{ error.$message }}</span>
        </div>
      </div>
    </div>

    <!-- Sort Section -->
    <div class="mt-4">
      <h3 class="mb-2 font-bold">Sorting</h3>

      <div v-for="(s, i) in form.sorts" :key="i" class="flex items-center gap-3 mb-2">

        <div :class="{ error: v$.sorts.$each[i].field.$errors.length }" class="flex-1">
          <Select v-model="s.field" :options="taskFields.options" placeholder="Field" />
          <div class="input-errors" v-for="error of v$.sorts.$each[i].field.$errors" :key="error.$uid">
            <span class="error-msg">{{ error.$message }}</span>
          </div>
        </div>

        <div :class="{ error: v$.sorts.$each[i].direction.$errors.length }" class="flex-1">
          <Select v-model="s.direction" :options="sortDirection.options" placeholder="Direction" />
          <div class="input-errors" v-for="error of v$.sorts.$each[i].direction.$errors" :key="error.$uid">
            <span class="error-msg">{{ error.$message }}</span>
          </div>
        </div>

        <Button icon="pi pi-trash" severity="danger" text @click="removeSort(i)" />
      </div>

      <Button label="Add Sort" icon="pi pi-plus" text @click="addSort" />
    </div>

    <!-- Footer -->
    <template #footer>
      <Button label="Cancel" text @click="visible = false" />
      <Button label="Apply" @click="applyFilters" />
    </template>

  </Dialog>
</template>

<style scoped>

</style>