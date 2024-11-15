import {
  Activity,
  ArchivedToDo,
  Category,
  Habit,
  HabitProgress,
  Project,
  Task,
  ToDo,
} from "@prisma/client";

export interface ExtendedHabit extends Habit {
  category: Category;
  progress: HabitProgress[];
}

export interface ExtendedTask extends Task {
  category: Category;
}

export interface ExtendedActivity extends Activity {
  category: Category;
}

export interface ExtendedProject extends Project {
  todos: ToDo[];
  tasks: Task[];
  habits: Habit[];
}

export interface ExtendedArchivedToDo extends ArchivedToDo {
  project: Project;
}

export type EntityType = "todo" | "task" | "habit";
export type EntityAction = "add" | "remove";

export interface EntityMutationConfig {
  entityType: EntityType;
  action: EntityAction;
  serviceFn: (entityId: string, projectId: string) => Promise<any>;
}
