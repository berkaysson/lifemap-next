"use server";

import prisma from "@/lib/prisma";

export const addNoteToAlbum = async (noteId: string, albumId: string) => {
  try {
    await prisma.noteAlbumNote.create({
      data: { noteId, albumId },
    });
    return { success: true, message: "Note added to album" };
  } catch (error: any) {
    if (error?.code === "P2002") {
      // Unique constraint — note is already in this album
      return { success: true, message: "Note is already in this album" };
    }
    console.error("addNoteToAlbum error:", error);
    return { success: false, message: "Failed to add note to album" };
  }
};

export const removeNoteFromAlbum = async (noteId: string, albumId: string) => {
  try {
    await prisma.noteAlbumNote.delete({
      where: { noteId_albumId: { noteId, albumId } },
    });
    return { success: true, message: "Note removed from album" };
  } catch (error) {
    console.error("removeNoteFromAlbum error:", error);
    return { success: false, message: "Failed to remove note from album" };
  }
};

/** Fetch all descendant album IDs for a given album (recursive) */
const getDescendantAlbumIds = async (albumId: string, userId: string): Promise<string[]> => {
  const children = await prisma.noteAlbum.findMany({
    where: { parentId: albumId, userId },
    select: { id: true },
  });

  let allIds = children.map((c) => c.id);
  for (const child of children) {
    const subIds = await getDescendantAlbumIds(child.id, userId);
    allIds = allIds.concat(subIds);
  }
  return allIds;
};

/** Fetch all notes in a given album (excluding notes placed in its sub-albums) */
export const getNotesByAlbum = async (albumId: string, userId: string) => {
  try {
    const descendantIds = await getDescendantAlbumIds(albumId, userId);

    const rows = await prisma.noteAlbumNote.findMany({
      where: {
        albumId,
        note: {
          userId,
          ...(descendantIds.length > 0
            ? {
                albums: {
                  none: {
                    albumId: { in: descendantIds },
                  },
                },
              }
            : {}),
        },
      },
      include: {
        note: {
          include: {
            mentions: true,
            albums: { include: { album: { select: { id: true, name: true, colorCode: true } } } },
          },
        },
      },
    });

    return { success: true, notes: rows.map((r) => r.note) };
  } catch (error) {
    console.error("getNotesByAlbum error:", error);
    return { success: false, message: "Failed to fetch notes", notes: [] };
  }
};

/** Fetch notes that have no album memberships at all (root-level) */
export const getRootLevelNotes = async (userId: string) => {
  try {
    const notes = await prisma.note.findMany({
      where: {
        userId,
        albums: { none: {} },
      },
      include: {
        mentions: true,
        albums: { include: { album: { select: { id: true, name: true, colorCode: true } } } },
      },
      orderBy: [{ pinned: "desc" }, { updatedAt: "desc" }],
    });

    return { success: true, notes };
  } catch (error) {
    console.error("getRootLevelNotes error:", error);
    return { success: false, message: "Failed to fetch root notes", notes: [] };
  }
};

/** Fetch all pinned notes across ALL albums (for the root page pinned section) */
export const getPinnedNotes = async (userId: string) => {
  try {
    const notes = await prisma.note.findMany({
      where: { userId, pinned: true },
      include: {
        mentions: true,
        albums: { include: { album: { select: { id: true, name: true, colorCode: true } } } },
      },
      orderBy: { updatedAt: "desc" },
    });

    return { success: true, notes };
  } catch (error) {
    console.error("getPinnedNotes error:", error);
    return { success: false, message: "Failed to fetch pinned notes", notes: [] };
  }
};

