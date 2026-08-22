"use server";

import prisma from "@/lib/prisma";

export const getNoteAlbums = async (userId: string) => {
  try {
    // Fetch all albums for the user — tree assembly happens client-side
    const albums = await prisma.noteAlbum.findMany({
      where: { userId },
      include: {
        children: {
          include: {
            _count: { select: { notes: true, children: true } },
          },
        },
        _count: { select: { notes: true, children: true } },
      },
      orderBy: [{ name: "asc" }],
    });

    return { success: true, albums };
  } catch (error) {
    console.error("getNoteAlbums error:", error);
    return { success: false, message: "Failed to fetch albums", albums: [] };
  }
};

export const getNoteAlbumById = async (albumId: string, userId: string) => {
  try {
    const album = await prisma.noteAlbum.findFirst({
      where: { id: albumId, userId },
      include: {
        // Nest parent 4 levels deep — sufficient for typical use
        parent: {
          include: {
            parent: {
              include: {
                parent: {
                  include: {
                    parent: true,
                  },
                },
              },
            },
          },
        },
        children: {
          include: {
            _count: { select: { notes: true, children: true } },
          },
          orderBy: { name: "asc" },
        },
        _count: { select: { notes: true, children: true } },
      },
    });

    if (!album) return { success: false, message: "Album not found" };
    return { success: true, album };
  } catch (error) {
    console.error("getNoteAlbumById error:", error);
    return { success: false, message: "Failed to fetch album" };
  }
};

/** Build full ancestor chain for breadcrumb: [root, ..., current] */
export const getNoteAlbumAncestors = async (
  albumId: string,
  userId: string,
): Promise<{ id: string; name: string }[]> => {
  const ancestors: { id: string; name: string }[] = [];
  let currentId: string | null = albumId;

  while (currentId) {
    const album = await prisma.noteAlbum.findFirst({
      where: { id: currentId, userId },
      select: { id: true, name: true, parentId: true },
    });
    if (!album) break;
    ancestors.unshift({ id: album.id, name: album.name });
    currentId = album.parentId;
  }

  return ancestors;
};
