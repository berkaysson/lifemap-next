"use server";

import prisma from "@/lib/prisma";
import { parseDate } from "@/lib/time";
import { TodoSchema } from "@/schema";
import { ToDo } from "@prisma/client";
import z from "zod";

export async function createToDo(
  data: z.infer<typeof TodoSchema>,
  _userId: string
) {
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
