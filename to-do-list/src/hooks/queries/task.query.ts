import type {
    AdvanceFilterTaskRequest,
    SearchQueryParams,
    SearchResponse,
    StatusesResponse,
    TasksResponse
} from "@/types/tasks.schema.ts";
import {type AxiosRequestConfig, isAxiosError} from "axios";
import {computed, onBeforeUnmount, reactive, ref, watch} from "vue";
import {useQuery, useQueryClient} from "@tanstack/vue-query";
import {getStatuses, getTasks, searchTasks} from "@/lib/api/task.api.ts";
import type {ResourceNotFoundErrorResponse} from "@/types/error.schema.ts";

export function useGetStatusesQuery() {
    return useQuery<
        StatusesResponse,
        ResourceNotFoundErrorResponse
    >({
        queryKey: ["statuses"],
        queryFn: () => getStatuses(),
        throwOnError: (error) => isAxiosError(error),
        retry: 1,
        staleTime: 1000 * 60, // 1 minute
        refetchOnWindowFocus: false,
        refetchOnReconnect: false,
    });
}

export function useGetTasksQuery() {
    return useQuery<
        TasksResponse,
        ResourceNotFoundErrorResponse
    >({
        queryKey: ["tasks"],
        queryFn: () => getTasks(),
        throwOnError: (error) => isAxiosError(error),
        retry: 1,
        staleTime: 1000 * 60, // 1 minute
        refetchOnWindowFocus: false,
        refetchOnReconnect: false,
    });
}

interface SearchQueryInit {
    queries?: Partial<SearchQueryParams>;
    filters?: Partial<AdvanceFilterTaskRequest>;
}

export function useSearchTasksQuery(
    initial: SearchQueryInit = {},
    opts?: { debounceMs?: number; axiosConfig?: AxiosRequestConfig }
) {
    const debounceMs = opts?.debounceMs ?? 400;

    // -----------------------------
    // Reactive query params
    // -----------------------------
    const queries = reactive<SearchQueryParams>({
        page: initial.queries?.page ?? 1,
        size: initial.queries?.size ?? 10,
    });

    const filters = reactive<AdvanceFilterTaskRequest>({
        fromDate: initial.filters?.fromDate ?? undefined,
        toDate: initial.filters?.toDate ?? undefined,
        keyword: initial.filters?.keyword ?? "",
    });

    // -----------------------------
    // Debounced filters (all using generic)
    // -----------------------------
    const debouncedKeyword = useDebouncedRef(() => filters.keyword, debounceMs);
    const debouncedFromDate = useDebouncedRef(() => filters.fromDate, debounceMs);
    const debouncedToDate = useDebouncedRef(() => filters.toDate, debounceMs);

    // Reset page when keyword changes
    watch(debouncedKeyword, () => {
        queries.page = 1;
    });

    // -----------------------------
    // Query Key
    // -----------------------------
    const queryKey = computed(() => [
        "tasks",
        "search",
        {
            page: queries.page,
            size: queries.size,
            keyword: debouncedKeyword.value,
            fromDate: debouncedFromDate.value,
            toDate: debouncedToDate.value,
        },
    ]);

    // -----------------------------
    // UseQuery
    // -----------------------------
    const query = useQuery<SearchResponse, ResourceNotFoundErrorResponse>({
        queryKey,
        queryFn: () => {
            return searchTasks(
                {
                    page: queries.page,
                    size: queries.size,
                },
                {
                    keyword: debouncedKeyword.value,
                    fromDate: debouncedFromDate.value,
                    toDate: debouncedToDate.value,
                },
                opts?.axiosConfig
            );
        },
        retry: 1,
        staleTime: 60_000,
        refetchOnWindowFocus: false,
    });

    const client = useQueryClient();

    // -----------------------------
    // Setters
    // -----------------------------
    const setPage = (p: number) => (queries.page = p);
    const setSize = (s: number) => {
        queries.size = s;
        queries.page = 1;
    };

    return {
        queries,
        filters,

        debouncedKeyword,
        debouncedFromDate,
        debouncedToDate,

        ...query,

        setPage,
        setSize,
        setFromDate: (v: Date | undefined) => (filters.fromDate = v),
        setToDate: (v: Date | undefined) => (filters.toDate = v),
        setKeyword: (v: string) => (filters.keyword = v),

        client,
    };
}

function useDebouncedRef<T>(source: () => T, delay: number) {
    const debounced = ref<T>(source());
    let timer: ReturnType<typeof setTimeout> | null = null;

    watch(
        source,
        (value) => {
            if (timer) clearTimeout(timer);
            timer = setTimeout(() => {
                debounced.value = value;
                timer = null;
            }, delay);
        }
    );

    onBeforeUnmount(() => timer && clearTimeout(timer));

    return debounced;
}
