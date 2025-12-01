import {reactive} from "vue";
import {helpers, minLength, required} from "@vuelidate/validators";
import {taskStatus} from "@/types/tasks.schema.ts";
import {v4 as uuidv4} from "uuid";
import {useForm} from "@/hooks/form/use-form.ts";

function today() {
    return new Date().toISOString().split("T")[0]
}

export function useCreateTaskForm() {
    const initialState = reactive({
        title: "",
        // assignees: ["test"] as string[],
        status: taskStatus.parse({id: uuidv4(), title: "To do"}),
        startDay: today(),
        targetDay: today(),
        endDay: today()
    })

    const rules = {
        title: {
            required: helpers.withMessage(
                () => `This field is required`,
                required
            ),
            minLength: helpers.withMessage(
                ({
                     $params,
                 }) => `This field must be at least ${$params.min} long.`,
                minLength(3)
            )
        },
        // assignees: {
        //     notEmpty: helpers.withMessage(
        //         () => "At least one assignee required",
        //         (v: string[]) => v.length > 0
        //     )
        // },
        status: {
            required: helpers.withMessage(
                () => `This field is required`,
                required
            ),
        },
        startDay: {
            required: helpers.withMessage(
                () => `This field is required`,
                required
            ),
        },
        targetDay: {
            required: helpers.withMessage(
                () => `This field is required`,
                required
            ),
        },
        endDay: {
            required: helpers.withMessage(
                () => `This field is required`,
                required
            ),
        },
    }

    return useForm(initialState, rules, async (state) => {
        console.log("Submit:", JSON.stringify(state, null, 2));
        // await api.createTask(state)
    });
}