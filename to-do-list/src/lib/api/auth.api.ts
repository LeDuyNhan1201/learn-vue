import { restClient } from "@/lib/rest-client.ts";
import type { AxiosRequestConfig } from "axios";
import type { RefreshRequest, SignInRequest, TokensResponse } from "@/types/auth.schema.ts";

export async function signIn(
  body: SignInRequest,
  config?: AxiosRequestConfig<SignInRequest>,
): Promise<TokensResponse> {
  return await restClient.post<TokensResponse, SignInRequest>("/auth/sign-in", body, {
    headers: {
      "No-Auth": true,
    },
    ...config,
  });
}

export async function refresh(body: RefreshRequest): Promise<TokensResponse> {
  return await restClient.post<TokensResponse>("/auth/refresh", body, {
    headers: {
      "No-Auth": true,
    },
  });
}
