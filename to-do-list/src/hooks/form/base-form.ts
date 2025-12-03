import {reactive} from "vue";
import useVuelidate from "@vuelidate/core";

export function useForm<TState extends object>(
    initialState: TState,
    rules: any
) {
    const state = reactive({...initialState}) as TState;

    const v$ = useVuelidate(rules, state);

    const validate = async () => {
        return await v$.value.$validate();
    };

    function setState(data: Partial<TState>) {
        Object.assign(state, data);
    }

    function reset() {
        Object.assign(state, initialState);
        v$.value.$reset();
    }

    return {
        state,
        v$,
        validate,
        setState,
        reset,
    };
}
