import type {UnauthorizedErrorResponse} from "@/types/error.schema.ts";
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
        UnauthorizedErrorResponse,
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
    });
}

export function useUpdateTaskMutation() {
    return useMutation<
        UpdateTaskResponse,
        UnauthorizedErrorResponse,
        UpdateTaskRequest
    >({
        mutationKey: ["task", "update"],
        mutationFn: (body: UpdateTaskRequest) => updateTask(body),
        onSuccess: async (data) => {
        },
        onError(error) {
            if (isAxiosError(error)) {
                console.error("Update task failed", error.response?.data);
            }
        },
    });
}

export function useUpdateTaskStatusMutation() {
    return useMutation<
        UpdateTaskResponse,
        UnauthorizedErrorResponse,
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
    });
}

export function useDeleteTaskMutation() {
    return useMutation<
        DeleteTaskResponse,
        UnauthorizedErrorResponse,
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
    });
}