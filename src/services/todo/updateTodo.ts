"use server";

import prisma from "@/lib/prisma";
import { logService } from "@/lib/utils";
import { ToDo } from "@prisma/client";

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
    await prisma.toDo.update({
      where: { id },
      data: updatableFields,
    });
    return { message: "Successfully updated todo", success: true };
  } catch (error: any) {
    return {
      message: `Failed to update todo: ${error.message}`,
      success: false,
    };
  }
}
