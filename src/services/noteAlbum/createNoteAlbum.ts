"use server";

import prisma from "@/lib/prisma";
import { NoteAlbumSchema } from "@/schema";
import { z } from "zod";

export const createNoteAlbum = async (
  data: z.infer<typeof NoteAlbumSchema>,
  userId: string,
) => {
  try {
    const validated = NoteAlbumSchema.safeParse(data);
    if (!validated.success) {
      return { success: false, message: "Invalid data" };
    }

    const album = await prisma.noteAlbum.create({
      data: {
        name: validated.data.name,
        description: validated.data.description,
        colorCode: validated.data.colorCode,
        icon: validated.data.icon,
        parentId: validated.data.parentId ?? null,
        userId,
      },
    });

    return { success: true, message: "Album created successfully", album };
  } catch (error) {
    console.error("createNoteAlbum error:", error);
    return { success: false, message: "Failed to create album" };
  }
};
