import {
    type AdvanceFilterTaskRequest,
    type SearchQueryParams,
    type SearchResponse,
    type StatusesResponse, type TasksResponse,
} from "@/types/tasks.schema.ts";
import {restClient} from "@/lib/rest-client.ts";
import type {AxiosRequestConfig} from "axios";

export async function searchTasks(
    queries: SearchQueryParams,
    body: AdvanceFilterTaskRequest,
    config?: AxiosRequestConfig
): Promise<SearchResponse> {
    return await restClient.post<SearchResponse, AdvanceFilterTaskRequest, SearchQueryParams>(
        `/tasks/search`,
        body,
        queries,
        {
            headers: {
                "No-Auth": true,
            },
            ...config,
        }
    );
}

export async function getTasks(): Promise<TasksResponse> {
    return await restClient.get<TasksResponse>(
        `/tasks`,
        {
            headers: {
                "No-Auth": true,
            }
        }
    );
}

export async function getStatuses(): Promise<StatusesResponse> {
    return await restClient.get<StatusesResponse>(
        `/tasks/statuses`,
        {
            headers: {
                "No-Auth": true,
            }
        }
    );
}
