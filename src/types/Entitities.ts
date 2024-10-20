import { Activity, Category, Habit, HabitProgress, Project, Task, ToDo } from "@prisma/client";

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