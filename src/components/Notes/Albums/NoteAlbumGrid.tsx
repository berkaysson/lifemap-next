"use client";

import { useFetchNoteAlbums } from "@/queries/noteAlbumQueries";
import NoteAlbumCard from "./NoteAlbumCard";
import NoteAlbumForm from "./NoteAlbumForm";
import { Button } from "@/components/ui/Buttons/button";
import { Iconify } from "@/components/ui/iconify";
import { Skeleton } from "@/components/ui/skeleton";
import { useState } from "react";

interface NoteAlbumGridProps {
  /** If provided, only shows direct children of this album. Otherwise shows root albums. */
  parentId?: string | null;
}

const NoteAlbumGrid = ({ parentId = null }: NoteAlbumGridProps) => {
  const { data: allAlbums, isLoading } = useFetchNoteAlbums();
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  const isSubLevel = parentId !== null;
  const albums = allAlbums?.filter((a) => (a.parentId ?? null) === parentId) ?? [];

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-36 rounded-xl" />
        ))}
      </div>
    );
  }

  return (
    <div className="mb-2">
      {/* Section header with the same small button as on the main page */}
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
          <Iconify icon="solar:folder-2-bold-duotone" width={16} />
          {isSubLevel ? "Sub-albums" : "Albums"}
          {albums.length > 0 && (
            <span className="text-xs font-normal normal-case bg-muted rounded-full px-2 py-0.5">
              {albums.length}
            </span>
          )}
        </h2>
        <NoteAlbumForm
          defaultParentId={parentId ?? undefined}
          isOpen={isCreateOpen}
          setIsOpen={setIsCreateOpen}
          triggerButton={
            <Button variant="ghost" size="sm" className="h-7 gap-1 text-xs">
              <Iconify icon="solar:add-square-linear" width={14} />
              {isSubLevel ? "New Sub-album" : "New Album"}
            </Button>
          }
        />
      </div>

      {albums.length === 0 && !isSubLevel && (
        <button
          onClick={() => setIsCreateOpen(true)}
          className="w-full border-2 border-dashed border-border rounded-xl p-6 flex flex-col items-center gap-2 text-muted-foreground hover:border-primary/40 hover:text-foreground transition-all duration-200 group"
        >
          <Iconify
            icon="solar:folder-add-bold-duotone"
            width={32}
          />
          <span className="text-sm">Create your first album</span>
          <span className="text-xs opacity-60 hidden sm:inline">You can also drag notes onto albums to organise them</span>
        </button>
      )}

      {albums.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {albums.map((album) => (
            <NoteAlbumCard key={album.id} album={album} />
          ))}
        </div>
      )}
    </div>
  );
};

export default NoteAlbumGrid;
