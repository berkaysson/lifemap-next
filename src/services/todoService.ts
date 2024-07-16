"use server";

import prisma from "@/lib/prisma";
import { ToDo } from "@prisma/client";

export async function createToDo(data: ToDo) {
  const todoData: any = {
    name: data.name,
    completed: false,
    startDate: data.startDate,
    endDate: data.endDate,
    userId: data.userId,
  };

  if (data.description !== undefined) {
    todoData.description = data.description;
  }
  if (data.colorCode !== undefined) {
    todoData.colorCode = data.colorCode;
  }
  if (data.projectId !== undefined) {
    todoData.projectId = data.projectId;
  }

  const todo = await prisma.toDo.create({
    data: todoData,
  });
  return todo;
}

export async function getToDos(userId: string) {
  const todos = await prisma.toDo.findMany({
    where: {
      userId,
    },
  });
  return todos;
}

export async function updateToDo(data: any) {
  const { id, ...rest } = data;
  const todo = await prisma.toDo.update({
    where: { id },
    data: rest,
  });
  return todo;
}

export async function deleteToDo(id: string) {
  const todo = await prisma.toDo.delete({
    where: { id },
  });
  return todo;
}
