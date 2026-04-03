"use client";

import { useMemo } from "react";
import { useFetchHabits } from "@/queries/habitQueries";
import { useFetchTasks } from "@/queries/taskQueries";
import { useFetchTodos } from "@/queries/todoQueries";
import { useFetchProjects } from "@/queries/projectQueries";
import { useFetchCategories } from "@/queries/categoryQueries";
import { MentionItem } from "@/components/ui/RichTextEditor";

// TODO: optimize here, it shouldn't fetch whole entities and loop each one of them
export const useMentionData = (): MentionItem[] => {
  const { data: habits = [] } = useFetchHabits();
  const { data: tasks = [] } = useFetchTasks();
  const { data: todos = [] } = useFetchTodos();
  const { data: projects = [] } = useFetchProjects();
  const { data: categories = [] } = useFetchCategories();

  return useMemo(() => {
    const items: MentionItem[] = [];

    for (const h of habits) {
      items.push({ id: h.id, label: h.name, type: "habit" });
    }
    for (const t of tasks) {
      items.push({ id: t.id, label: t.name, type: "task" });
    }
    for (const t of todos) {
      items.push({ id: t.id, label: t.name, type: "todo" });
    }
    for (const p of projects) {
      items.push({ id: p.id, label: p.name, type: "project" });
    }
    for (const c of categories) {
      items.push({ id: c.id, label: c.name, type: "category" });
    }

    return items;
  }, [habits, tasks, todos, projects, categories]);
};
