"use server";

import prisma from "@/lib/prisma";
import { logService } from "@/lib/utils";
import { revalidateTag } from "next/cache";

export async function deleteToDo(id: string) {
  logService("deleteToDo");
  if (!id) {
    return { message: "id is required", success: false };
  }

  try {
    const todo = await prisma.toDo.findUnique({
      where: { id },
      select: { userId: true },
    });

    if (!todo) {
      return { message: "Todo not found", success: false };
    }

    await prisma.toDo.delete({
      where: { id },
    });

    revalidateTag("todos");
    revalidateTag(`todos-${todo.userId}`);

    return { message: "Successfully deleted todo", success: true };
  } catch (error) {
    return { message: `${error}`, success: false };
  }
}
