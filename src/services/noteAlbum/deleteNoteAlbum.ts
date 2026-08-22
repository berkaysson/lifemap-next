"use server";

import prisma from "@/lib/prisma";

/**
 * Deletes an album.
 *
 * Smart re-parenting logic:
 * - For each note that ONLY belongs to this album (no other album memberships),
 *   the note is moved to the parent album (if it exists).
 *   If the album is a root album (no parent), the note becomes root-level (no albums).
 * - Notes that belong to other albums too are left untouched.
 * - All NoteAlbumNote rows for this album are removed (via Cascade on the join table).
 * - Child albums are also re-parented to this album's parent (or to root).
 */
export const deleteNoteAlbum = async (albumId: string, userId: string) => {
  try {
    const album = await prisma.noteAlbum.findFirst({
      where: { id: albumId, userId },
      include: {
        notes: {
          include: {
            note: {
              include: {
                albums: true,
              },
            },
          },
        },
        children: true,
      },
    });

    if (!album) return { success: false, message: "Album not found" };

    const targetParentId = album.parentId ?? null;

    // Re-parent child albums
    if (album.children.length > 0) {
      await prisma.noteAlbum.updateMany({
        where: { parentId: albumId, userId },
        data: { parentId: targetParentId },
      });
    }

    // For notes that are ONLY in this album, add them to the parent (if any)
    if (targetParentId) {
      const exclusiveNoteIds = album.notes
        .filter((nan) => nan.note.albums.length === 1)
        .map((nan) => nan.noteId);

      if (exclusiveNoteIds.length > 0) {
        await prisma.noteAlbumNote.createMany({
          data: exclusiveNoteIds.map((noteId) => ({
            noteId,
            albumId: targetParentId,
          })),
          skipDuplicates: true,
        });
      }
    }
    // If no parent → exclusive notes become root-level (no action needed, cascade will remove the join rows)

    // Delete the album (cascades NoteAlbumNote rows for this album)
    await prisma.noteAlbum.delete({ where: { id: albumId } });

    return { success: true, message: "Album deleted successfully" };
  } catch (error) {
    console.error("deleteNoteAlbum error:", error);
    return { success: false, message: "Failed to delete album" };
  }
};
