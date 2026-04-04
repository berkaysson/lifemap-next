"use server";

import prisma from "@/lib/prisma";
import { logService } from "@/lib/utils";
import { Note, Prisma } from "@prisma/client";

interface UpdateNoteData extends Partial<Note> {
  mentions?: { entityType: string; entityId: string }[];
}

export async function updateNote(data: UpdateNoteData) {
  logService("updateNote");

  if (!data || !data.id) {
    return {
      message: "data is required and must include an id",
      success: false,
    };
  }

  const {
    id,
    mentions,
    userId: _userId,
    createdAt: _createdAt,
    updatedAt: _updatedAt,
    ...updatableFields
  } = data;

  try {
    await prisma.note.update({
      where: { id },
      data: updatableFields as Prisma.NoteUpdateInput,
    });

    if (mentions) {
      // Delete old mentions and create new ones
      await prisma.noteMention.deleteMany({
        where: { noteId: id },
      });

      if (mentions.length > 0) {
        const uniqueMentions = Array.from(
          new Map(
            mentions.map((m) => [`${m.entityType}-${m.entityId}`, m])
          ).values()
        );

        await prisma.noteMention.createMany({
          data: uniqueMentions.map((m) => ({
            noteId: id,
            entityType: m.entityType,
            entityId: m.entityId,
          })),
        });
      }
    }

    return { message: "Successfully updated note", success: true };
  } catch (error: any) {
    return {
      message: `Failed to update note: ${error.message}`,
      success: false,
    };
  }
}
