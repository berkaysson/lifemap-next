"use server";

import prisma from "@/lib/prisma";
import { logService } from "@/lib/utils";

export async function getNotesByEntity(
  entityType: string,
  entityId: string,
  userId: string,
) {
  logService("getNotesByEntity");

  if (!entityType || !entityId || !userId) {
    return {
      message: "entityType, entityId and userId are required",
      success: false,
    };
  }

  try {
    const mentions = await prisma.noteMention.findMany({
      where: {
        entityType,
        entityId,
        note: {
          userId,
        },
      },
      include: {
        note: true,
      },
    });

    const notes = mentions.map((m) => m.note);
    return { message: "Successfully fetched notes", success: true, notes };
  } catch (error) {
    return { message: `${error}`, success: false };
  }
}
