import {z} from "zod";
import {v4 as uuidv4} from "uuid"
import {toTypedSchema} from "@vee-validate/zod";

export const dragTaskInfo = z.object({
    columnKey: z.string().optional(),
    index: z.number().optional(),
})
export type DragTaskInfo = z.infer<typeof dragTaskInfo>

export const taskStatus = z.object({
    id: z.uuid().optional(),
    title: z.string().optional(),
})
export type TaskStatus = z.infer<typeof taskStatus>

export const taskFields = z.enum(
    ["title", "status_id", "start_day", "target_day", "end_day", "priority"]
)
export type TaskFields = z.infer<typeof taskFields>

export const sortDirection = z.enum(["asc", "desc"])
export type SortDirection = z.infer<typeof sortDirection>

export const taskItem = z.object({
    id: z.uuid().optional(),
    title: z.string().optional(),
    assignees: z.array(z.string(), {error: "Must be array"}).optional(),
    status: taskStatus.optional(),
    startDay: z.date().optional(),
    targetDay: z.date().optional(),
    endDay: z.date().optional(),
    priority: z.number({error: "Must be number"}).int({error: "Must be number"}).optional(),
})
export const taskItemSchema = toTypedSchema(taskItem)
export type TaskItem = z.infer<typeof taskItem>

export const createTaskRequest = z.object({
    title: z.string(),
    status: taskStatus.required(),
    startDay: z.date(),
    targetDay: z.date(),
    endDay: z.date(),
})
export type CreateTaskRequest = z.infer<typeof createTaskRequest>

export const updateTaskRequest = createTaskRequest
export type UpdateTaskRequest = z.infer<typeof updateTaskRequest>

export const updateTaskStatusRequest = z.object({
    id: z.uuid(),
    status: taskStatus.required()
})
export type UpdateTaskStatusRequest = z.infer<typeof updateTaskStatusRequest>

export const statusOptions: TaskStatus[] = [
    {id: uuidv4(), title: "To do"},
    {id: uuidv4(), title: "In progress"},
    {id: uuidv4(), title: "Done"},
];
export type StatusOptions = z.infer<typeof statusOptions>

export const searchQueryParams = z.object({
    page: z.number().int().default(1),
    size: z.number().int().default(10)
});
export type SearchQueryParams = z.infer<typeof searchQueryParams>;

export const sortTasksOption = z.object({
    field: taskFields.optional(),
    direction: sortDirection.optional()
});
export type SortTasksOption = z.infer<typeof sortTasksOption>;

export const advanceFilterTaskRequest = z.object({
    fromDate: z.date().optional(),
    toDate: z.date().optional(),
    keyword: z.string().optional(),
    sorts: z.array(sortTasksOption).default([])
});
export type AdvanceFilterTaskRequest = z.infer<typeof advanceFilterTaskRequest>;

export const tasksResponse = z.array(taskItem).default([]);
export type TasksResponse = z.infer<typeof tasksResponse>;

export const statusesResponse = z.array(taskStatus).default([]);
export type StatusesResponse = z.infer<typeof statusesResponse>;

export const searchResponse = z.object({
    items: z.array(taskItem).default([]),
    page: z.number().int().default(1),
    size: z.number().int().default(10),
    total: z.number().int().optional(),
});
export type SearchResponse = z.infer<typeof searchResponse>;