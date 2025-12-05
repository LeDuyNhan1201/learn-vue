import { reactive } from "vue";
import { helpers, minLength, required } from "@vuelidate/validators";
import { type CreateTaskRequest } from "@/types/tasks.schema.ts";
import { useForm } from "@/hooks/form/base-form.ts";

export function useTaskForm(initial?: Partial<CreateTaskRequest>) {
  const initialState = reactive({
    ...initial,
  });

  const rules = {
    title: {
      required: helpers.withMessage(() => `This field is required`, required),
      minLength: helpers.withMessage(
        ({ $params }) => `This field must be at least ${$params.min} long.`,
        minLength(3),
      ),
    },
    // assignees: {
    //     notEmpty: helpers.withMessage(
    //         () => "At least one assignee required",
    //         (v: string[]) => v.length > 0
    //     )
    // },
    statusId: {
      required: helpers.withMessage(() => `This field is required`, required),
    },
    startDay: {
      required: helpers.withMessage(() => `This field is required`, required),
    },
    targetDay: {
      required: helpers.withMessage(() => `This field is required`, required),
    },
    endDay: {
      required: helpers.withMessage(() => `This field is required`, required),
    },
  };

  return useForm(initialState, rules);
}
