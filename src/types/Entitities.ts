import { Activity, Category, Habit, HabitProgress, Task } from "@prisma/client";

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