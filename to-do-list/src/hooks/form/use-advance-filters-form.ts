import type {AdvanceFilterTaskRequest, SortTasksOption} from "@/types/tasks.schema.ts";
import {reactive} from "vue";
import {helpers, required} from "@vuelidate/validators";
import useVuelidate from "@vuelidate/core";

export function useAdvanceFilterForm(initial?: Partial<AdvanceFilterTaskRequest>) {
    // Reactive form state
    const form = reactive({
        fromDate: undefined,
        toDate: undefined,
        keyword: "",
        sorts: [],
        ...initial,
    });

    // Validation rules
    const rules = {
        keyword: {
            required: helpers.withMessage(
                () => "Keyword is required",
                required
            )
        },
        fromDate: {
            required: helpers.withMessage(
                () => "From Date is required",
                required
            )
        },
        toDate: {
            required: helpers.withMessage(
                () => "To Date is required",
                required
            )
        },
        sorts: {
            $each: {
                field: helpers.withMessage(
                    () => "Sort field is required",
                    required
                ),
                direction: helpers.withMessage(
                    () => "Sort direction is required",
                    required
                )
            }
        }
    };

    const v$ = useVuelidate(rules, form);

    // Methods
    async function validate() {
        return await v$.value.$validate();
    }

    function reset() {
        form.fromDate = undefined;
        form.toDate = undefined;
        form.keyword = "";
        form.sorts = [];
        v$.value.$reset();
    }

    async function submit(onSubmit: (data: AdvanceFilterTaskRequest) => void) {
        const ok = await validate();
        if (!ok) return false;
        onSubmit({...form});
        return true;
    }

    function addSort() {
        form.sorts.push({field: undefined, direction: undefined} as SortTasksOption);
    }

    function removeSort(index: number) {
        form.sorts.splice(index, 1);
    }

    return {
        form,
        v$,
        validate,
        submit,
        reset,
        addSort,
        removeSort,
    };
}