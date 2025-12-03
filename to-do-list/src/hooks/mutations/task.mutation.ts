import type {UnauthenticatedErrorResponse} from "@/types/error.schema.ts";
import {useMutation} from "@tanstack/vue-query";
import {isAxiosError} from "axios";
import type {
    CreateTaskRequest,
    CreateTaskResponse, DeleteTaskResponse, TaskIdPathParam,
    UpdateTaskRequest,
    UpdateTaskResponse, UpdateTaskStatusRequest
} from "@/types/tasks.schema.ts";
import {createTask, deleteTask, updateTask, updateTaskStatus} from "@/lib/api/task.api.ts";

export function useCreateTaskMutation() {
    return useMutation<
        CreateTaskResponse,
        UnauthenticatedErrorResponse,
        CreateTaskRequest
    >({
        mutationKey: ["task", "create"],
        mutationFn: (body: CreateTaskRequest) => createTask(body),
        onSuccess: async (data) => {
        },
        onError(error) {
            if (isAxiosError(error)) {
                console.error("Create task failed", error.response?.data);
            }
        },
        throwOnError: (err) => isAxiosError(err),
    });
}

export function useUpdateTaskMutation(param: TaskIdPathParam) {
    return useMutation<
        UpdateTaskResponse,
        UnauthenticatedErrorResponse,
        UpdateTaskRequest
    >({
        mutationKey: ["task", "update"],
        mutationFn: (body: UpdateTaskRequest) => updateTask(body, param),
        onSuccess: async (data) => {
        },
        onError(error) {
            if (isAxiosError(error)) {
                console.error("Update task failed", error.response?.data);
            }
        },
        throwOnError: (err) => isAxiosError(err),
    });
}

export function useUpdateTaskStatusMutation() {
    return useMutation<
        UpdateTaskResponse,
        UnauthenticatedErrorResponse,
        UpdateTaskStatusRequest
    >({
        mutationKey: ["task", "update-status"],
        mutationFn: (body: UpdateTaskStatusRequest) => updateTaskStatus(body),
        onSuccess: async (data) => {
        },
        onError(error) {
            if (isAxiosError(error)) {
                console.error("Update task failed", error.response?.data);
            }
        },
        throwOnError: (err) => isAxiosError(err),
    });
}

export function useDeleteTaskMutation() {
    return useMutation<
        DeleteTaskResponse,
        UnauthenticatedErrorResponse,
        TaskIdPathParam
    >({
        mutationKey: ["task", "delete"],
        mutationFn: (param: TaskIdPathParam) => deleteTask(param),
        onSuccess: async (data) => {
        },
        onError(error) {
            if (isAxiosError(error)) {
                console.error("Delete task failed", error.response?.data);
            }
        },
        throwOnError: (err) => isAxiosError(err),
    });
}