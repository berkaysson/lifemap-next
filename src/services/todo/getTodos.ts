"use server";

import prisma from "@/lib/prisma";
import { logService } from "@/lib/utils";

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
      select: {
        id: true,
        name: true,
        description: true,
        colorCode: true,
        completed: true,
        startDate: true,
        endDate: true,
        userId: true,
        projectId: true,
      },
    });
    return { message: "Successfully fetched todos", success: true, todos };
  } catch (error) {
    return { message: `${error}`, success: false };
  }
}
