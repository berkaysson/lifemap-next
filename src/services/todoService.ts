"use server";

import prisma from "@/lib/prisma";
import { parseDate } from "@/lib/time";
import { logService } from "@/lib/utils";
import { TodoSchema } from "@/schema";
import { ToDo } from "@prisma/client";
import { z } from "zod";

export async function createToDo(
  data: z.infer<typeof TodoSchema>,
  _userId: string
) {
  logService("createToDo");
  const validatedFields = TodoSchema.safeParse(data);

  if (!validatedFields.success) {
    return { message: "Invalid fields!", success: false };
  }

  try {
    const { name, description, colorCode, endDate } = validatedFields.data;

    await prisma.toDo.create({
      data: {
        name: name,
        completed: false,
        startDate: parseDate(new Date().toISOString()),
        endDate: parseDate(endDate),
        userId: _userId,
        description: description || undefined,
        colorCode: colorCode || "#000000",
        projectId: undefined,
      },
    });

    return { message: "Successfully created todo", success: true };
  } catch (error) {
    return { message: `${error}`, success: false };
  }
}

export async function getToDos(userId: string | undefined) {
  logService("getToDos");
  if (!userId) {
    return { message: "user is required", success: false };
  }

  try {
    const todos = await prisma.toDo.findMany({
      where: {
        userId,
      },
    });
    return { message: "Successfully fetched todos", success: true, todos };
  } catch (error) {
    return { message: `${error}`, success: false };
  }
}

export async function updateToDo(data: ToDo) {
  logService("updateToDo");
  if (!data || !data.id) {
    return { message: "data is required", success: false };
  }

  try {
    await prisma.toDo.update({
      where: { id: data.id },
      data,
    });
    return { message: "Successfully updated todo", success: true };
  } catch (error) {
    return { message: `${error}`, success: false };
  }
}

export async function deleteToDo(id: string) {
  logService("deleteToDo");
  if (!id) {
    return { message: "id is required", success: false };
  }

  try {
    await prisma.toDo.delete({
      where: { id },
    });
    return { message: "Successfully deleted todo", success: true };
  } catch (error) {
    return { message: `${error}`, success: false };
  }
}

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
    return { message: `Failed to delete archived todo: ${error}`, success: false };
  }
}
