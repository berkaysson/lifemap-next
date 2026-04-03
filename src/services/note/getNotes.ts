"use server";

import prisma from "@/lib/prisma";
import { logService } from "@/lib/utils";

export async function getNotes(userId: string | undefined) {
  logService("getNotes");
  if (!userId) {
    return { message: "user is required", success: false };
  }

  try {
    const notes = await prisma.note.findMany({
      where: {
        userId,
      },
      include: {
        mentions: true,
      },
      orderBy: {
        updatedAt: "desc",
      },
    });
    return { message: "Successfully fetched notes", success: true, notes };
  } catch (error) {
    return { message: `${error}`, success: false };
  }
}
