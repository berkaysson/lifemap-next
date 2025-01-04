"use server";

import prisma from "@/lib/prisma";
import { logService } from "@/lib/utils";

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
