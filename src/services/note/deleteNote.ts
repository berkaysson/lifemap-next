"use server";

import prisma from "@/lib/prisma";
import { logService } from "@/lib/utils";

export async function deleteNote(id: string) {
  logService("deleteNote");
  if (!id) {
    return { message: "id is required", success: false };
  }

  try {
    await prisma.note.delete({
      where: { id },
    });
    return { message: "Successfully deleted note", success: true };
  } catch (error) {
    return { message: `${error}`, success: false };
  }
}
