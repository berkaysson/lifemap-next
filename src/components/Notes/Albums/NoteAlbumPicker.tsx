"use client";

import { useState } from "react";
import { useFetchNoteAlbums, useAddNoteToAlbum, useRemoveNoteFromAlbum } from "@/queries/noteAlbumQueries";
import { Button } from "@/components/ui/Buttons/button";
import { Iconify } from "@/components/ui/iconify";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Skeleton } from "@/components/ui/skeleton";
import { LoadingButton } from "@/components/ui/Buttons/loading-button";

interface NoteAlbumPickerProps {
  noteId: string;
  /** IDs of albums the note currently belongs to */
  currentAlbumIds: string[];
  triggerButton: React.ReactNode;
}

/**
 * A drawer that lets the user add/remove a note from multiple albums.
 * Renders a flat list of all albums; parent hierarchy is shown inline.
 */
const NoteAlbumPicker = ({ noteId, currentAlbumIds, triggerButton }: NoteAlbumPickerProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const { data: allAlbums, isLoading } = useFetchNoteAlbums();
  const { mutateAsync: addNote, isPending: isAdding } = useAddNoteToAlbum();
  const { mutateAsync: removeNote, isPending: isRemoving } = useRemoveNoteFromAlbum();
  const isPending = isAdding || isRemoving;

  // Local optimistic selection state
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set(currentAlbumIds));

  const handleOpen = (open: boolean) => {
    if (open) setSelectedIds(new Set(currentAlbumIds));
    setIsOpen(open);
  };

  const handleToggle = (albumId: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(albumId)) next.delete(albumId);
      else next.add(albumId);
      return next;
    });
  };

  const handleSave = async () => {
    const toAdd = [...selectedIds].filter((id) => !currentAlbumIds.includes(id));
    const toRemove = currentAlbumIds.filter((id) => !selectedIds.has(id));

    await Promise.all([
      ...toAdd.map((albumId) => addNote({ noteId, albumId })),
      ...toRemove.map((albumId) => removeNote({ noteId, albumId })),
    ]);

    setIsOpen(false);
  };

  /** Build indented label showing parent name */
  const getAlbumLabel = (album: NonNullable<typeof allAlbums>[number]) => {
    const parent = allAlbums?.find((a) => a.id === album.parentId);
    return parent ? `${parent.name} › ${album.name}` : album.name;
  };

  return (
    <Drawer handleOnly direction="right" open={isOpen} onOpenChange={handleOpen}>
      <DrawerTrigger asChild>{triggerButton}</DrawerTrigger>
      <DrawerContent className="!left-auto !bottom-auto !h-full !mt-0 fixed inset-y-0 right-0 w-full sm:max-w-[400px] !rounded-none border-l [&>div:first-child]:hidden">
        <div className="h-full flex flex-col overflow-hidden">
          <DrawerHeader className="text-left mb-2 flex-shrink-0 relative">
            <DrawerClose asChild>
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-4 top-4 h-7 w-7 rounded-sm opacity-70 hover:opacity-100"
              >
                <Iconify icon="mdi:close" width={18} />
              </Button>
            </DrawerClose>
            <DrawerTitle className="text-2xl font-bold tracking-tight">Manage Albums</DrawerTitle>
            <DrawerDescription className="text-muted-foreground">
              Select which albums this note belongs to
            </DrawerDescription>
          </DrawerHeader>

          <div className="p-4 pt-0 flex-1 overflow-y-auto flex flex-col gap-2">
            {isLoading ? (
              Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-12 rounded-lg" />)
            ) : allAlbums?.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-8">
                No albums yet. Create one from the Notes page.
              </p>
            ) : (
              allAlbums?.map((album) => {
                const selected = selectedIds.has(album.id);
                return (
                  <button
                    key={album.id}
                    type="button"
                    onClick={() => handleToggle(album.id)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg border transition-all text-left ${
                      selected
                        ? "border-primary/50 bg-primary/8 text-foreground"
                        : "border-border bg-muted/30 text-muted-foreground hover:bg-muted hover:text-foreground"
                    }`}
                  >
                    <span className="text-xl leading-none">{album.icon ?? "📁"}</span>
                    <span className="flex-1 text-sm font-medium truncate">{getAlbumLabel(album)}</span>
                    <span
                      className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-colors ${
                        selected ? "border-primary bg-primary" : "border-muted-foreground/40"
                      }`}
                    >
                      {selected && (
                        <Iconify icon="mdi:check" width={12} className="text-primary-foreground" />
                      )}
                    </span>
                  </button>
                );
              })
            )}
          </div>

          <div className="p-4 border-t flex flex-col gap-2">
            <LoadingButton
              isLoading={isPending}
              loadingText="Saving..."
              variant="default"
              onClick={handleSave}
              className="w-full"
              disabled={isPending}
            >
              Save
            </LoadingButton>
            <DrawerClose asChild>
              <Button variant="ghost" size="sm" className="w-full text-muted-foreground">
                Cancel
              </Button>
            </DrawerClose>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export default NoteAlbumPicker;
