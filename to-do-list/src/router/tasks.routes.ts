import type { RouteRecordRaw } from "vue-router";
import TasksTable from "@/components/TasksDashboard/TasksTable.vue";
import TasksBoard from "@/components/TasksDashboard/TasksBoard.vue";

// Lazy loading for all components to reduce bundle size for the first time startup
const TasksList = () => import("@/components/TasksDashboard/TasksList.vue");
const NewTask = () => import("@/components/TaskForm/NewTask.vue");
const TaskDetails = () => import("@/components/TaskForm/TaskDetails.vue");

const tasksRoutes: RouteRecordRaw[] = [
  {
    path: "/tasks",
    name: "Tasks",
    children: [
      {
        path: "",
        name: "TasksList",
        component: TasksList,
        redirect: "/tasks/table", // <--- redirect mặc định
        children: [
          {
            path: "table",
            name: "TasksTable",
            component: TasksTable,
          },
          {
            path: "board",
            name: "TasksBoard",
            component: TasksBoard,
          },
        ],
      },
      {
        path: "new",
        name: "NewTask",
        component: NewTask,
      },
      {
        path: ":id/details",
        name: "TaskDetails",
        component: TaskDetails,
        props: true, // truyền id vào component
      },
    ],
  },
];

export default tasksRoutes;
