import type { AxiosRequestConfig } from "axios";
import qs from "qs";
import { axiosClient } from "@/lib/axios-client.ts";

type HTTPMethod = "get" | "post" | "put" | "patch" | "delete";

const request = <TResponse = unknown, TRequest = unknown, TQueryParams = unknown>(
  method: HTTPMethod,
  url: string,
  data?: TRequest,
  params?: TQueryParams,
  config?: AxiosRequestConfig,
): Promise<TResponse> => {
  return axiosClient.request<any>({
    method,
    url,
    data,
    params,
    paramsSerializer: (params) => qs.stringify(params),
    ...config,
  }) as Promise<TResponse>;
};

export const restClient = {
  get: <TResponse = unknown, TQueryParams = unknown>(
    url: string,
    params?: TQueryParams,
    config?: AxiosRequestConfig,
  ) => request<TResponse, undefined, TQueryParams>("get", url, undefined, params, config),

  post: <TResponse = unknown, TRequest = unknown, TQueryParams = unknown>(
    url: string,
    body: TRequest,
    params?: TQueryParams,
    config?: AxiosRequestConfig,
  ) => request<TResponse, TRequest, TQueryParams>("post", url, body, params, config),

  put: <TResponse = unknown, TRequest = unknown, TQueryParams = unknown>(
    url: string,
    body: TRequest,
    params?: TQueryParams,
    config?: AxiosRequestConfig,
  ) => request<TResponse, TRequest, TQueryParams>("put", url, body, params, config),

  patch: <TResponse = unknown, TRequest = unknown, TQueryParams = unknown>(
    url: string,
    body: TRequest,
    params?: TQueryParams,
    config?: AxiosRequestConfig,
  ) => request<TResponse, TRequest, TQueryParams>("patch", url, body, params, config),

  delete: <TResponse = unknown, TQueryParams = unknown>(
    url: string,
    params?: TQueryParams,
    config?: AxiosRequestConfig,
  ) => request<TResponse, undefined, TQueryParams>("delete", url, undefined, params, config),
};
