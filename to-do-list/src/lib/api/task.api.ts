import {
    type AdvanceFilterTaskRequest,
    type CreateTaskRequest,
    type CreateTaskResponse, type DeleteTaskResponse,
    type SearchQueryParams,
    type SearchResponse,
    type StatusesResponse, type TaskIdPathParam, type TaskItem,
    type TasksResponse,
    type UpdateTaskRequest,
    type UpdateTaskResponse,
    type UpdateTaskStatusRequest,
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

export async function getTaskDetails(
    param: TaskIdPathParam,
    config?: AxiosRequestConfig
): Promise<TaskItem> {
    return await restClient.get<
        TaskItem,
        TaskIdPathParam
    >(`/tasks/${param.id}`,
        undefined,
        {
            headers: {
                "No-Auth": true,
            },
            ...config,
        }
    );
}

export async function createTask(
    body: CreateTaskRequest,
    config?: AxiosRequestConfig<CreateTaskRequest>
): Promise<CreateTaskResponse> {
    return await restClient.post<
        CreateTaskResponse,
        CreateTaskRequest
    >("/tasks",
        body,
        {
            headers: {
                "No-Auth": true,
            },
            ...config,
        }
    );
}

export async function updateTaskStatus(
    body: UpdateTaskStatusRequest,
    config?: AxiosRequestConfig<UpdateTaskStatusRequest>
): Promise<UpdateTaskResponse> {
    return await restClient.patch<
        UpdateTaskResponse,
        UpdateTaskStatusRequest
    >("/tasks",
        body,
        {
            headers: {
                "No-Auth": true,
            },
            ...config,
        }
    );
}

export async function updateTask(
    body: UpdateTaskRequest,
    config?: AxiosRequestConfig<UpdateTaskRequest>
): Promise<UpdateTaskResponse> {
    return await restClient.put<
        UpdateTaskResponse,
        UpdateTaskRequest
    >("/tasks",
        body,
        {
            headers: {
                "No-Auth": true,
            },
            ...config,
        }
    );
}

export async function deleteTask(
    param: TaskIdPathParam,
    config?: AxiosRequestConfig
): Promise<DeleteTaskResponse> {
    return await restClient.delete<
        DeleteTaskResponse,
        TaskIdPathParam
    >(`/tasks/${param.id}`,
        undefined,
        {
            headers: {
                "No-Auth": true,
            },
            ...config,
        }
    );
}