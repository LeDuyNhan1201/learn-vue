<script setup lang="ts">
import {computed, onActivated, onMounted, ref} from "vue";
import {colDragReorder} from "@/hooks/ui/col-drag-reorder.ts";
import {useGetStatusesQuery, useSearchTasksQuery} from "@/hooks/queries/task.query.ts";
import CellView from "@/components/TasksDashboard/CellView.vue";
import FilterPopup from "@/components/TaskForm/FilterPopup.vue";
import {type AdvanceFilterTaskRequest, taskIdPathParam, type TaskItem} from "@/types/tasks.schema.ts";
import {useConfirm} from "primevue/useconfirm";
import {useToast} from "primevue/usetoast";
import {useDeleteTaskMutation} from "@/hooks/mutations/task.mutation.ts";
import {useRouter} from "vue-router";

const confirm = useConfirm();
const toast = useToast();
const router = useRouter();
const showAdvanceFilters = ref<boolean>(false);

function showToast(severity: "success" | "error", summary: string, detail: string) {
  toast.add({severity, summary, detail, life: 3000});
}

interface Column {
  key: string;
  label: string;
}

const columns = ref<Column[]>([
  {key: "title", label: "Title"},
  {key: "status", label: "Status"},
  {key: "startDay", label: "Start Day"},
  {key: "targetDay", label: "Target Day"},
  {key: "endDay", label: "End Day"},
  {key: "actions", label: "Actions"},
]);

const {
  highlightIndex,
  highlightSide,
  onDragStart,
  onDragEnd,
  detectHighlight,
  applyReorder
} = colDragReorder<Column>();

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
  refetch,
  setPage,
  setKeyword,
  setFromDate,
  setToDate,
  setSorts,
} = useSearchTasksQuery(
    {
      queries: {
        page: 1,
        size: 7,
      },
    },
    {debounceMs: 400},
);

onMounted(() => {
  console.log("Mounted - fetching tasks");
  refetch();
});

onActivated(() => {
  console.log("Activated - fetching tasks");
  refetch();
});

const statuses = computed(() => taskStatuses.value ?? []);
const tasks = computed(() => data.value?.items ?? []);
const total = computed(() => data.value?.total ?? 0);
const totalPages = computed(() => Math.ceil(total.value / queries.size));
const setFilters = (filters: AdvanceFilterTaskRequest) => {
  setKeyword(filters.keyword ?? "");
  setFromDate(filters.fromDate ?? "");
  setToDate(filters.toDate ?? "");
  setSorts(filters.sorts ?? []);
};

const columnHighlightClasses = (index: number) => ({
  "highlight-left": highlightIndex.value === index && highlightSide.value === "left",
  "highlight-right": highlightIndex.value === index && highlightSide.value === "right",
});

function startEditing(taskId: string) {
  router.push(`/tasks/${taskId}/edit`);
}

const {mutate: deleteMutate, isPending: deleteIsPending} = useDeleteTaskMutation();

function deleteTask(task: TaskItem) {
  confirm.require({
    message: `Are you sure you want to delete this task?`,
    header: `Task '${task.title}'`,
    icon: "",
    acceptLabel: "Yes",
    rejectLabel: "No",
    accept: () => {
      deleteMutate(taskIdPathParam.parse({id: task.id}), {
        onSuccess: () => {
          showToast("success", "Done", "Task has been deleted successfully");
          refetch();
        },
        onError: (error) =>
            showToast("error", "Task Deletion Failed", error.message || "An error occurred"),
      });
    },
    reject: () => {
    },
  });
}
</script>

<template>
  <div class="filter-bar">
    <input
        v-model="filters.keyword"
        class="search-input"
        placeholder="Search..."
    />

    <button
        @click="
        () => {
          showAdvanceFilters = true;
        }
      "
    >
      Advanced Filters
    </button>
  </div>

  <FilterPopup
      :filters="filters"
      @update:filters="setFilters"
      v-model:visible="showAdvanceFilters"
  />

  <div v-if="isLoading || statusesLoading">Loading...</div>

  <div v-else-if="statuses.length === 0 || tasks.length === 0">No results</div>

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
          <th
              class="header"
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
        <tr
            v-for="(task, _) in tasks"
            :key="task.id"
        >
          <td
              v-for="(col, colIndex) in columns"
              :key="col.key"
              :class="columnHighlightClasses(colIndex)"
          >
            <CellView
                :task="task"
                :col="col"
                :statuses="statuses"
                :deleteIsPending="deleteIsPending"
                @edit="startEditing(task.id!)"
                @delete="deleteTask(task)"
            />
          </td>
        </tr>
        </tbody>
      </table>
    </div>

    <div class="pagination">
      <button
          :disabled="queries.page === 1"
          @click="() => {
            setPage(queries.page - 1)
            router.replace({
              query: {
                page: queries.page
              },
            });
          }"
      >
        Previous
      </button>

      <span>Page {{ queries.page }} / {{ totalPages }}</span>

      <button
          :disabled="queries.page === totalPages"
          @click="() => {
            setPage(queries.page + 1)
            router.replace({
              query: {
                page: queries.page
              },
            });
          }"
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

  <RouterView/>
</template>

<style scoped>
.filter-bar {
  display: flex;
  flex-direction: row;
  gap: var(--s-4);
  max-height: 50px;
  margin-bottom: var(--s-4);

  button {
    flex: 1;
  }
}

.search-input {
  flex: 8;
  padding: var(--s-3) var(--s-4);
  border: 1px solid var(--c-border);
  background: #fff;
  transition: all 0.2s ease;

  &:focus {
    border-color: var(--c-primary-h);
    outline: none;
  }
}

.table-wrapper {
  height: calc(var(--h-header) + var(--h-row) * 7 + var(--s-5));
}

.task-table {
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
  overflow: auto;

  tbody {
    height: 100%;
  }

  th {
    height: var(--h-header);
    background: var(--c-surface);
    font-weight: var(--f-weight);
    cursor: grab;

    &:hover {
      border-color: var(--c-primary-h);
    }
  }

  th,
  td {
    text-align: start;
    padding: var(--s-4) var(--s-6);
    border: 1px solid transparent;
    border-bottom: 1px solid var(--c-border);
  }

  td {
    height: var(--h-row);

    a {
      color: var(--c-text);
    }
  }
}

.highlight-left {
  box-shadow: inset 4px 0 0 var(--c-primary-h);
}

.highlight-right {
  box-shadow: inset -4px 0 0 var(--c-primary-h);
}

/* ---------------- Pagination ---------------- */
.pagination {
  margin-top: var(--s-6);
  display: flex;
  justify-content: center;
  align-items: center;
  gap: var(--s-3);

  span {
    font-weight: var(--f-bold);
  }

  button {
    padding: var(--s-2) var(--s-3);
    border-radius: var(--r-sm);
    border: 1px solid var(--c-border);
    background: #fff;
    cursor: pointer;

    &:hover:not(:disabled) {
      background: var(--c-surface);
      font-weight: var(--f-weight);
      color: var(--c-text);
    }

    &:disabled {
      opacity: 0.4;
      cursor: not-allowed;
      font-weight: var(--f-weight);
      color: var(--c-text);
    }
  }
}
</style>
