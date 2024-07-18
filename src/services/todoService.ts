"use server";

import prisma from "@/lib/prisma";
import { TodoSchema } from "@/schema";
import z from "zod";

export async function createToDo(
  data: z.infer<typeof TodoSchema>,
  _userId: string
): Promise<{ message: string }> {
  const validatedFields = TodoSchema.safeParse(data);

  if (!validatedFields.success) {
    return { message: "Invalid fields!" };
  }

  const { name, description, colorCode, endDate } = validatedFields.data;

  try {
    await prisma.toDo.create({
      data: {
        name: name,
        completed: false,
        startDate: new Date(),
        endDate: new Date(endDate).toISOString(),
        userId: _userId,
        description: description || undefined,
        colorCode: colorCode || "#000000",
        projectId: undefined,
      },
    });

    return { message: "Successfully created todo" };
  } catch (error) {
    return { message: `${error}` };
    throw error;
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
