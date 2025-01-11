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

  const {
    name,
    description = undefined,
    colorCode = "#000000",
    endDate,
  } = validatedFields.data;

  const startDate = parseDate(new Date().toISOString());
  const parsedEndDate = endDate && parseDate(endDate);

  try {
    await prisma.toDo.create({
      data: {
        name,
        completed: false,
        startDate,
        endDate: parsedEndDate || undefined,
        userId: _userId,
        description,
        colorCode,
        projectId: undefined,
      },
    });

    return { message: "Successfully created todo", success: true };
  } catch (error: any) {
    return {
      message: `Failed to create todo: ${error.message}`,
      success: false,
    };
  }
}
