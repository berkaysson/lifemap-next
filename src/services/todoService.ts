"use server";

import prisma from "@/lib/prisma";
import { ToDo } from "@prisma/client";

export async function createToDo(newToDo: ToDo) {
  const {
    name,
    startDate,
    endDate,
    userId,
    description = undefined,
    colorCode = undefined,
    projectId = undefined,
  } = newToDo;

  if (!name || !startDate || !userId) {
    throw new Error("name, startDate, and userId are required");
  }

  try {
    const createdToDo = await prisma.toDo.create({
      data: {
        name,
        completed: false,
        startDate,
        endDate,
        userId,
        description,
        colorCode,
        projectId,
      },
    });

    return createdToDo;
  } catch (error) {
    throw new Error(`Failed to create to-do: ${error}`);
  }
}

export async function getToDos(userId: string | undefined) {
  if (!userId) {
    throw new Error("userId is required");
  }

  try {
    const todos = await prisma.toDo.findMany({
      where: {
        userId,
      },
    });
    return todos;
  } catch (error) {
    throw new Error(`Failed to fetch todos: ${error}`);
  }
}

export async function updateToDo(data: any) {
  if (!data || !data.id) {
    throw new Error("id is required");
  }

  const { id, ...rest } = data;

  try {
    const todo = await prisma.toDo.update({
      where: { id },
      data: rest,
    });
    return todo;
  } catch (error) {
    throw new Error(`Failed to update todo: ${error}`);
  }
}

export async function deleteToDo(id: string) {
  if (!id) {
    throw new Error("id is required");
  }

  try {
    const todo = await prisma.toDo.delete({
      where: { id },
    });
    return todo;
  } catch (error) {
    throw new Error(`Failed to delete todo: ${error}`);
  }
}
