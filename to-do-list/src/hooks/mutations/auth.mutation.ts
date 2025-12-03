import type {SignInRequest, TokensResponse} from "@/types/auth.schema.ts";
import {signIn} from "@/lib/api/auth.api.ts";
import type {UnauthenticatedErrorResponse} from "@/types/error.schema.ts";
import {useMutation, useQueryClient} from "@tanstack/vue-query";
import {useUserStore} from "@/stores/user.store.ts";
import {isAxiosError} from "axios";

export function useSignInMutation() {
    const client = useQueryClient();
    const userStore = useUserStore();

    return useMutation<
        TokensResponse,
        UnauthenticatedErrorResponse,
        SignInRequest
    >({
        mutationKey: ["auth", "sign-in"],
        mutationFn: (body: SignInRequest) => signIn(body),
        onSuccess: async (data) => {
            userStore.setToken(data.accessToken);
            client.invalidateQueries({
                queryKey: ["current-user"],
                exact: true
            }).then((results) => {
                console.log(results);
            });
            const results = await client.refetchQueries({queryKey: ["current-user"], exact: true});
            console.log("Refetched current-user:", results);
        },
        onError(error) {
            if (isAxiosError(error)) {
                console.error("Sign in failed", error.response?.data);
            }
        },
        throwOnError: (err) => isAxiosError(err),
    });
}