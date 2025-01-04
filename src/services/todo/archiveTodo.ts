"use server";

import prisma from "@/lib/prisma";
import { logService } from "@/lib/utils";

export async function archiveToDo(id: string) {
  logService("archiveToDo");
  if (!id) {
    return { message: "id is required", success: false };
  }

  try {
    // Get the todo with its project
    const todo = await prisma.toDo.findUnique({
      where: { id },
    });

    if (!todo) {
      return { message: "Todo not found", success: false };
    }

    // Create archived version
    await prisma.archivedToDo.create({
      data: {
        name: todo.name,
        description: todo.description,
        colorCode: todo.colorCode,
        completed: todo.completed,
        startDate: todo.startDate,
        endDate: todo.endDate,
        userId: todo.userId,
        projectId: todo.projectId,
      },
    });

    // Delete the original todo
    await prisma.toDo.delete({
      where: { id },
    });

    return { message: "Successfully archived todo", success: true };
  } catch (error) {
    return { message: `${error}`, success: false };
  }
}

export async function getArchivedToDos(userId: string) {
  logService("getArchivedToDos");
  try {
    const archivedTodos = await prisma.archivedToDo.findMany({
      where: { userId },
      include: {
        project: true,
      },
    });
    return {
      message: "Successfully fetched archived todos",
      success: true,
      archivedTodos,
    };
  } catch (error) {
    return { message: `${error}`, success: false };
  }
}

export async function deleteArchivedToDo(id: string) {
  logService("deleteArchivedToDo");
  if (!id) {
    return { message: "id is required", success: false };
  }

  try {
    await prisma.archivedToDo.delete({
      where: { id },
    });
    return { message: "Successfully deleted archived todo", success: true };
  } catch (error) {
    return {
      message: `Failed to delete archived todo: ${error}`,
      success: false,
    };
  }
}
