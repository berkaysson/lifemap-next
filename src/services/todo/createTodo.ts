"use server";

import prisma from "@/lib/prisma";
import { parseDate } from "@/lib/time";
import { logService } from "@/lib/utils";
import { TodoSchema } from "@/schema";
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
