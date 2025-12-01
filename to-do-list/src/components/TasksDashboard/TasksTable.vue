<script setup lang="ts">
import {computed, ref} from "vue"
import {colDragReorder} from "@/hooks/ui/col-drag-reorder.ts";
import {useGetStatusesQuery, useSearchTasksQuery} from "@/hooks/queries/task.query.ts";
import CellView from "@/components/TasksDashboard/CellView.vue";
import FilterPopup from "@/components/TasksDashboard/FilterPopup.vue";

const {
  data: taskStatuses,
  isLoading: statusesLoading,
  isFetching: statusesFetching,
} = useGetStatusesQuery();

const {
  queries,
  filters,
  data,
  isLoading,
  isFetching,
  setPage,
} = useSearchTasksQuery({
      queries: {
        page: 1,
        size: 8,
      },
    },
    {debounceMs: 400}
);

// Sample data
const statuses = computed(() => taskStatuses.value ?? []);
const tasks = computed(() => data.value?.items ?? []);
const total = computed(() => data.value?.total ?? 0);
const totalPages = computed(() => Math.ceil(total.value / queries.size));

interface Column {
  key: string
  label: string
}

// Columns definition (draggable)
const columns = ref<Column[]>([
  {key: "title", label: "Title"},
  {key: "status", label: "Status"},
  {key: "startDay", label: "Start Day"},
  {key: "targetDay", label: "Target Day"},
  {key: "endDay", label: "End Day"},
])

const {
  highlightIndex,
  highlightSide,
  onDragStart,
  onDragEnd,
  detectHighlight,
  applyReorder
} = colDragReorder<Column>()


const editingCell = ref<{ row: number; col: string } | null>(null)

const columnHighlightClasses = (index: number) => ({
  "highlight-left": highlightIndex.value === index && highlightSide.value === "left",
  "highlight-right": highlightIndex.value === index && highlightSide.value === "right",
});

const isEditing = (row: number, col: string) => editingCell.value?.row === row && editingCell.value?.col === col;
const startEditing = (row: number, col: string) => editingCell.value = {row, col};
const stopEditing = () => (editingCell.value = null);

const show = ref<boolean>(false);
</script>

<template>
  <div class="filter-bar">
    <input
        class="search-input"
        placeholder="Search..."
    />

    <button @click="() => { show = true; console.log('Open filter popup'); }">
      Advanced Filters
    </button>
  </div>

  <FilterPopup v-model:visible="show"/>

  <div v-if="isLoading || statusesLoading">Loading...</div>

  <div v-else-if="statuses.length === 0 || tasks.length === 0">
    No results
  </div>

  <div v-else>
    <div v-if="statuses.length === 0 || tasks.length === 0">No results</div>

    <div class="table-wrapper">
      <table
          class="task-table"
          @dragover.prevent="(e) => detectHighlight(e, 'header')"
          @drop="() => (columns = applyReorder(columns))"
      >
        <thead>
        <tr>
          <th class="header"
              v-for="(col, idx) in columns"
              :key="col.key"
              draggable="true"
              @dragstart="(e) => onDragStart(e, idx)"
              @dragend="onDragEnd"
              :class="columnHighlightClasses(idx)"
          >
            {{ col.label }}
          </th>
        </tr>
        </thead>

        <tbody>
        <tr v-for="(task, row) in tasks" :key="task.id">
          <td
              v-for="(col, colIndex) in columns"
              :key="col.key"
              @click="startEditing(row, col.key)"
              :class="columnHighlightClasses(colIndex)"
          >
            <CellView
                :task="task"
                :col="col"
                :isEditing="isEditing(row, col.key)"
                :statuses="statuses"
                @stop="stopEditing"
            />
          </td>
        </tr>
        </tbody>
      </table>
    </div>

    <div class="pagination">
      <button :disabled="queries.page === 1" @click="setPage(queries.page - 1)">
        Previous
      </button>

      <span>Page {{ queries.page }} / {{ totalPages }}</span>

      <button
          :disabled="queries.page === totalPages"
          @click="setPage(queries.page + 1)"
      >
        Next
      </button>

      <!--        <select v-model.number="queries.size" @change="setSize(queries.size)">-->
      <!--          <option :value="10">10</option>-->
      <!--          <option :value="20">20</option>-->
      <!--          <option :value="50">50</option>-->
      <!--        </select>-->

      <span v-if="isFetching || statusesFetching">Refreshing...</span>
    </div>
  </div>
</template>

<style scoped>
.filter-bar {
  display: flex;
  max-height: 50px;
  flex-direction: row;
  gap: var(--space-4);
  margin-bottom: var(--space-4);
}

.search-input {
  flex: 8;
  padding: var(--space-3) var(--space-4);
  border: 1px solid var(--color-border);
  transition: all 0.2s ease;
  background: white;
}

.filter-bar > button {
  flex: 1;
}

.search-input:focus {
  border-color: var(--color-primary-hover);
  outline: none;
}

.table-wrapper {
  height: calc(var(--header-height) + var(--row-height) * 8 + var(--space-5));
}

.task-table {
  width: 100%;
  border-collapse: separate;
  border-spacing: 0; /* để sát nhau nhưng không collapse */
  overflow: auto; /* scroll if needed */
}

.task-table tbody {
  height: 100%; /* tbody fill table */
}

.task-table th {
  height: var(--header-height);
  background: var(--color-surface);
  font-weight: var(--font-weight-base);
  cursor: grab;
}

.task-table th,
.task-table td {
  text-align: start;
  padding: var(--space-4) var(--space-6);
  border: 1px solid transparent;
  border-bottom: 1px solid var(--color-border);
}

.task-table td {
  height: var(--row-height);
}

.task-table td a {
  color: var(--color-text);
}

.task-table th:hover {
  border-color: var(--color-primary-hover);
}

.highlight-left {
  box-shadow: inset 4px 0 0 var(--color-primary-hover);
}

.highlight-right {
  box-shadow: inset -4px 0 0 var(--color-primary-hover);
}

.pagination {
  margin-top: var(--space-6);
  display: flex;
  justify-content: center;
  align-items: center;
  gap: var(--space-3);
}

.pagination > span {
  font-weight: var(--font-weight-bold);
}

.pagination button {
  padding: var(--space-2) var(--space-3);
  border-radius: 6px;
  border: 1px solid var(--color-border);
  cursor: pointer;
  background: white;
}

.pagination button:hover:not(:disabled) {
  background: var(--color-surface);
  font-weight: var(--font-weight-base);
  color: var(--color-text);
}

.pagination button:disabled {
  opacity: 0.4;
  cursor: not-allowed;
  font-weight: var(--font-weight-base);
  color: var(--color-text);
}

</style>