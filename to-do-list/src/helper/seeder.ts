import { type TaskItem, taskItem, type TaskStatus, taskStatus } from "@/types/tasks.schema.ts";
import { faker } from "@faker-js/faker";
import { v4 as uuidv4 } from "uuid";

// Seed TaskStatus
export function seedTaskStatuses(count: number): TaskStatus[] {
  return Array.from({ length: count }).map(() => {
    return taskStatus.parse({
      id: uuidv4(),
      title: faker.helpers.arrayElement([
        "To do",
        "In Progress",
        "Done",
        "Not Started",
        "Blocked",
        "Review",
        "QA",
      ]),
    });
  });
  // return [
  //     taskStatus.parse({
  //         id: uuidv4(),
  //         title: "To do"
  //     }),
  //     taskStatus.parse({
  //         id: uuidv4(),
  //         title: "In Progress"
  //     }),
  //     taskStatus.parse({
  //         id: uuidv4(),
  //         title: "Done"
  //     }),
  // ]
}

// Seed TaskItem
export function seedTasks(count: number, statuses: TaskStatus[]): TaskItem[] {
  return Array.from({ length: count }).map(() => {
    const status = faker.helpers.arrayElement(statuses);
    const assigneesCount = faker.number.int({ min: 1, max: 3 });
    const assignees = Array.from({ length: assigneesCount }).map(() => faker.person.firstName());

    const start = faker.date
      .between({
        from: new Date(2025, 0, 1),
        to: new Date(2025, 0, 20),
      })
      .toISOString()
      .split("T")[0];

    const target = faker.date
      .between({
        from: new Date(2025, 0, 20),
        to: new Date(2025, 1, 10),
      })
      .toISOString()
      .split("T")[0];

    const endDay =
      status.title === "done"
        ? faker.date
            .between({
              from: new Date(2025, 0, 20),
              to: new Date(2025, 1, 10),
            })
            .toISOString()
            .split("T")[0]
        : "-";

    return taskItem.parse({
      id: uuidv4(),
      title: faker.hacker.phrase(),
      assignees,
      status,
      startDay: start,
      targetDay: target,
      endDay,
      priority: faker.number.int({ min: 1, max: 5 }),
    });
  });
}
