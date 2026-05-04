"use server";

import prisma from "@/lib/prisma";
import { logService } from "@/lib/utils";
import { unstable_cache } from "next/cache";

export async function getToDos(userId: string | undefined) {
  logService("getToDos");
  if (!userId) {
    return { message: "user is required", success: false };
  }

  const fetchTodos = unstable_cache(
    async (userId: string) => {
      logService("getToDos - calculate");
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
    },
    [`todos-${userId}`],
    {
      tags: [`todos-${userId}`, "todos"],
      revalidate: 3600,
    },
  );

  return fetchTodos(userId);
}
