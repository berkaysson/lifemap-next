"use server";

import prisma from "@/lib/prisma";
import { logService } from "@/lib/utils";
import { NoteSchema } from "@/schema";
import { z } from "zod";

export async function createNote(
  data: z.infer<typeof NoteSchema>,
  _userId: string,
) {
  logService("createNote");

  const validatedFields = NoteSchema.safeParse(data);
  if (!validatedFields.success) {
    return { message: "Invalid fields!", success: false };
  }

  const {
    title,
    content = undefined,
    colorCode = "#714DD9",
    pinned = false,
    mentions = [],
  } = validatedFields.data;

  try {
    const note = await prisma.note.create({
      data: {
        title,
        content: content || undefined,
        colorCode,
        pinned,
        userId: _userId,
      },
    });

    if (mentions.length > 0) {
      const uniqueMentions = Array.from(
        new Map(
          mentions.map((m) => [`${m.entityType}-${m.entityId}`, m]),
        ).values(),
      );

      await prisma.noteMention.createMany({
        data: uniqueMentions.map((m) => ({
          noteId: note.id,
          entityType: m.entityType,
          entityId: m.entityId,
        })),
      });
    }

    return { message: "Successfully created note", success: true };
  } catch (error: any) {
    return {
      message: `Failed to create note: ${error.message}`,
      success: false,
    };
  }
}
