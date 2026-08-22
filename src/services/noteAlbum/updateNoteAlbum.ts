"use server";

import prisma from "@/lib/prisma";
import { NoteAlbumSchema } from "@/schema";
import { z } from "zod";

export const updateNoteAlbum = async (
  albumId: string,
  data: Partial<z.infer<typeof NoteAlbumSchema>>,
  userId: string,
) => {
  try {
    const album = await prisma.noteAlbum.findFirst({
      where: { id: albumId, userId },
    });

    if (!album) return { success: false, message: "Album not found" };

    // Prevent setting an album as its own ancestor
    if (data.parentId) {
      if (data.parentId === albumId) {
        return { success: false, message: "An album cannot be its own parent" };
      }
    }

    const updated = await prisma.noteAlbum.update({
      where: { id: albumId },
      data: {
        ...(data.name !== undefined && { name: data.name }),
        ...(data.description !== undefined && { description: data.description }),
        ...(data.colorCode !== undefined && { colorCode: data.colorCode }),
        ...(data.icon !== undefined && { icon: data.icon }),
        ...(data.parentId !== undefined && { parentId: data.parentId ?? null }),
      },
    });

    return { success: true, message: "Album updated successfully", album: updated };
  } catch (error) {
    console.error("updateNoteAlbum error:", error);
    return { success: false, message: "Failed to update album" };
  }
};
