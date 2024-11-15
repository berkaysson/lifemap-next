"use client";

import ActivityForm from "@/components/Activities/ActivityForm";
import ActivityList from "@/components/Activities/ActivityList";
import CategoryForm from "@/components/Category/CategoryForm";
import CategoryList from "@/components/Category/CategoryList";
import HabitForm from "@/components/Habits/HabitForm";
import HabitList from "@/components/Habits/HabitList";
import ProjectForm from "@/components/Projects/ProjectForm";
import ProjectList from "@/components/Projects/ProjectList";
import TaskForm from "@/components/Tasks/TaskForm";
import TaskList from "@/components/Tasks/TaskList";
import TodoForm from "@/components/ToDos/TodoForm";
import TodoList from "@/components/ToDos/TodoList";

const DashboardPage = () => {
  return (
    <div>
      <p>Project Form</p>
      <ProjectForm />
      <p>Project List</p>
      <ProjectList />

      {/* <p>Habit Form</p>
      <HabitForm />
      <p>Habit List</p>
      <HabitList /> */}

      <p>Task Form</p>
      <TaskForm />
      <p>Task List</p>
      <TaskList />

      <p>Activity Form</p>
      <ActivityForm />
      <p>Activity List</p>
      <ActivityList />

      <p>Category Form</p>
      <CategoryForm />
      <p>Category List</p>
      <CategoryList />

      {/* <p>Todo Form</p>
      <TodoForm />
      <p>Todo List</p>
      <TodoList /> */}
    </div>
  );
};

export default DashboardPage;
