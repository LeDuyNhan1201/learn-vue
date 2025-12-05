import type { AdvanceFilterTaskRequest, SortTasksOption } from "@/types/tasks.schema.ts";
import { reactive } from "vue";
import { helpers, required } from "@vuelidate/validators";
import { useForm } from "@/hooks/form/base-form.ts";

export function useAdvanceFilterForm(initial?: Partial<AdvanceFilterTaskRequest>) {
  const initialState = reactive({
    fromDate: undefined,
    toDate: undefined,
    keyword: "",
    sorts: [],
    ...initial,
  });

  // const rules = {
  //     keyword: {
  //         required: helpers.withMessage(
  //             () => "Keyword is required",
  //             required
  //         )
  //     },
  //     fromDate: {
  //         required: helpers.withMessage(
  //             () => "From Date is required",
  //             required
  //         )
  //     },
  //     toDate: {
  //         required: helpers.withMessage(
  //             () => "To Date is required",
  //             required
  //         )
  //     },
  //     sorts: {
  //         $each: {
  //             field: helpers.withMessage(
  //                 () => "Sort field is required",
  //                 required
  //             ),
  //             direction: helpers.withMessage(
  //                 () => "Sort direction is required",
  //                 required
  //             )
  //         }
  //     }
  // };

  const rules = {
    keyword: {},
    fromDate: {},
    toDate: {},
    sorts: {},
  };

  const form = useForm(initialState, rules);

  function addSort() {
    form.state.sorts.push({ field: "", direction: "" } as SortTasksOption);
  }

  function removeSort(index: number) {
    form.state.sorts.splice(index, 1);
  }

  return {
    ...form,
    addSort,
    removeSort,
  };
}
