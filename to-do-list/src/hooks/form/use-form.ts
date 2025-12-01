import {reactive} from "vue";
import useVuelidate from "@vuelidate/core";

export function useForm<TState extends object>(
    initialState: TState,
    rules: any,
    onSubmit?: (state: TState) => void | Promise<void>
) {
    const state = reactive({...initialState}) as TState;

    const v$ = useVuelidate(rules, state);

    const validate = async () => {
        return await v$.value.$validate();
    };

    async function submitForm() {
        const ok = await validate();
        if (!ok) return false;

        if (onSubmit) await onSubmit(state);
        return true;
    }

    function setState(data: Partial<TState>) {
        Object.assign(state, data);
    }

    return {
        state,
        v$,
        validate,
        submitForm,
        setState,
    };
}
