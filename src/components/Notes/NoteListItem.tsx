"use client";

import { useState } from "react";
import { Button } from "../ui/Buttons/button";
import { formatDateFriendly } from "@/lib/time";
import NoteEditForm from "./NoteEditForm";
import NoteShowDialog from "./NoteShowDialog";
import ButtonWithConfirmation from "../ui/Buttons/ButtonWithConfirmation";
import { useDeleteNote, useUpdateNote } from "@/queries/noteQueries";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Iconify } from "../ui/iconify";
import { LoadingButton } from "../ui/Buttons/loading-button";
import { Note } from "@prisma/client";
import { getContentPreview } from "@/helpers/note";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip";
import NoteAlbumPicker from "./Albums/NoteAlbumPicker";
import { useIsMobile } from "@/hooks/use-mobile";

type NoteWithAlbums = Note & {
  albums?: {
    albumId: string;
    album?: { id: string; name: string; colorCode?: string | null };
  }[];
};

const NoteListItem = ({ note }: { note: NoteWithAlbums }) => {
  const isMobile = useIsMobile();
  const { mutateAsync: deleteNote } = useDeleteNote();
  const updateNoteMutation = useUpdateNote();
  const [isDragging, setIsDragging] = useState(false);

  const handleDelete = async () => {
    await deleteNote(note.id);
  };

  const handleTogglePin = async () => {
    const updatedNote = { ...note, pinned: !note.pinned };
    await updateNoteMutation.mutateAsync(updatedNote);
  };

  const contentPreview = getContentPreview(note.content as any);
  const albumMemberships = note.albums ?? [];
  const currentAlbumIds = albumMemberships.map((a) => a.albumId);

  // ── Drag-and-Drop source handlers ─────────────────────────────────────────
  const handleDragStart = (e: React.DragEvent) => {
    if (isMobile) {
      e.preventDefault();
      return;
    }
    e.dataTransfer.setData("noteId", note.id);
    e.dataTransfer.effectAllowed = "move";
    setIsDragging(true);
  };

  const handleDragEnd = () => {
    setIsDragging(false);
  };

  return (
    <NoteShowDialog
      note={note}
      triggerButton={
        <div
          draggable={!isMobile}
          onDragStart={!isMobile ? handleDragStart : undefined}
          onDragEnd={!isMobile ? handleDragEnd : undefined}
          className={`h-full transition-opacity duration-150 ${isDragging ? "opacity-40" : ""}`}
        >
          <Card
            className="w-full h-full hover:cursor-pointer hover:shadow-md transition-all duration-200 text-left relative flex flex-col group border-t-[6px]"
            style={{ borderTopColor: note.colorCode || "#714DD9" }}
          >
            {/* Drag handle hint (desktop only) */}
            {!isMobile && (
              <div className="absolute top-2 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-30 transition-opacity pointer-events-none hidden md:block">
                <Iconify icon="solar:hamburger-menu-linear" width={16} className="text-muted-foreground rotate-90" />
              </div>
            )}

            {note.pinned && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="absolute -top-3 -right-2 z-10 w-8 h-8 rounded-full bg-background flex items-center justify-center text-foreground shadow-sm border border-border">
                      <Iconify icon="solar:pin-bold" width={18} />
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="text-xs">Pinned Note</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}

            <CardHeader className="p-4 pb-2">
              <CardTitle className="text-lg font-medium leading-tight">
                {note.title}
              </CardTitle>
              <div className="flex items-center text-xs text-muted-foreground mt-1.5 font-medium">
                <Iconify
                  icon="solar:calendar-date-linear"
                  width={14}
                  className="mr-1"
                />
                {formatDateFriendly(note.updatedAt)}
              </div>
            </CardHeader>

            <CardContent className="p-4 pt-1 flex-grow">
              {contentPreview ? (
                <div className="text-sm text-foreground/80 line-clamp-4 leading-relaxed whitespace-pre-wrap">
                  {contentPreview}
                </div>
              ) : (
                <div className="text-sm italic text-muted-foreground opacity-70 mt-1">
                  Empty note
                </div>
              )}

              {/* Album badges */}
              {albumMemberships.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-3" onClick={(e) => e.stopPropagation()}>
                  {albumMemberships.slice(0, 3).map((a) => (
                    <span
                      key={a.albumId}
                      className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full bg-muted border border-border text-muted-foreground"
                      style={
                        a.album?.colorCode
                          ? { borderColor: `${a.album.colorCode}60`, color: a.album.colorCode }
                          : {}
                      }
                    >
                      <Iconify icon="solar:folder-2-linear" width={10} />
                      {a.album?.name ?? "Album"}
                    </span>
                  ))}
                  {albumMemberships.length > 3 && (
                    <span className="inline-flex items-center text-xs px-2 py-0.5 rounded-full bg-muted border border-border text-muted-foreground">
                      +{albumMemberships.length - 3}
                    </span>
                  )}
                </div>
              )}
            </CardContent>

            <CardFooter className="p-4 pt-0">
              <div
                className="flex flex-wrap gap-2"
                onClick={(e) => e.stopPropagation()}
              >
                <NoteEditForm
                  initialValues={note}
                  triggerButton={
                    <Button variant="outline" size="sm">
                      <Iconify
                        icon="solar:pen-new-square-bold-duotone"
                        width={16}
                        className="mr-1"
                      />
                      Edit
                    </Button>
                  }
                />
                <LoadingButton
                  isLoading={updateNoteMutation.isPending}
                  loadingText=""
                  variant="outline"
                  size="sm"
                  onClick={handleTogglePin}
                >
                  <Iconify
                    icon={
                      note.pinned ? "solar:pin-bold-duotone" : "solar:pin-linear"
                    }
                    width={16}
                    className="mr-1"
                  />
                  {note.pinned ? "Unpin" : "Pin"}
                </LoadingButton>
                <NoteAlbumPicker
                  noteId={note.id}
                  currentAlbumIds={currentAlbumIds}
                  triggerButton={
                    <Button variant="outline" size="sm">
                      <Iconify icon="solar:folder-2-linear" width={16} className="mr-1" />
                      Albums
                    </Button>
                  }
                />
                <ButtonWithConfirmation
                  variant="destructive"
                  size="sm"
                  buttonText=""
                  onConfirm={handleDelete}
                  icon="solar:trash-bin-trash-bold"
                />
              </div>
            </CardFooter>
          </Card>
        </div>
      }
    />
  );
};

export default NoteListItem;
