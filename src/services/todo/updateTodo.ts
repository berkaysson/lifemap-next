"use server";

import prisma from "@/lib/prisma";
import { logService } from "@/lib/utils";
import { ToDo } from "@prisma/client";

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
