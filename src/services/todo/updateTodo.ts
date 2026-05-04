"use server";

import prisma from "@/lib/prisma";
import { logService } from "@/lib/utils";
import { ToDo } from "@prisma/client";
import { revalidateTag } from "next/cache";

export async function updateToDo(
  data: Partial<ToDo>
) {
  logService("updateToDo");

  if (!data || !data.id) {
    return {
      message: "data is required and must include an id",
      success: false,
    };
  }

  const { id, ...updatableFields } = data;

  try {
    const todo = await prisma.toDo.findUnique({
      where: { id },
      select: { userId: true },
    });

    if (!todo) {
      return { message: "Todo not found", success: false };
    }

    await prisma.toDo.update({
      where: { id },
      data: updatableFields,
    });

    revalidateTag("todos");
    revalidateTag(`todos-${todo.userId}`);

    return { message: "Successfully updated todo", success: true };
  } catch (error: any) {
    return {
      message: `Failed to update todo: ${error.message}`,
      success: false,
    };
  }
}
