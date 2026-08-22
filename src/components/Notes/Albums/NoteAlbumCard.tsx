"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useDeleteNoteAlbum, useAddNoteToAlbum } from "@/queries/noteAlbumQueries";
import NoteAlbumForm from "./NoteAlbumForm";
import { Button } from "@/components/ui/Buttons/button";
import ButtonWithConfirmation from "@/components/ui/Buttons/ButtonWithConfirmation";
import { Iconify } from "@/components/ui/iconify";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useIsMobile } from "@/hooks/use-mobile";

interface NoteAlbumCardProps {
  album: {
    id: string;
    name: string;
    description?: string | null;
    colorCode?: string | null;
    icon?: string | null;
    parentId?: string | null;
    _count: { notes: number; children: number };
  };
}

const NoteAlbumCard = ({ album }: NoteAlbumCardProps) => {
  const isMobile = useIsMobile();
  const router = useRouter();
  const { mutateAsync: deleteAlbum } = useDeleteNoteAlbum();
  const { mutateAsync: addNoteToAlbum } = useAddNoteToAlbum();
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);

  const accentColor = album.colorCode ?? "#714DD9";

  const handleNavigate = () => {
    router.push(`/dashboard/note/album/${album.id}`);
  };

  const handleDelete = async () => {
    await deleteAlbum(album.id);
  };

  // ── Drag-and-Drop target handlers ─────────────────────────────────────────
  const handleDragOver = (e: React.DragEvent) => {
    if (isMobile) return;
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    if (isMobile) return;
    setIsDragOver(false);
  };

  const handleDrop = async (e: React.DragEvent) => {
    if (isMobile) return;
    e.preventDefault();
    setIsDragOver(false);
    const noteId = e.dataTransfer.getData("noteId");
    if (!noteId) return;
    await addNoteToAlbum({ noteId, albumId: album.id });
  };

  return (
    <>
      <NoteAlbumForm
        initialValues={album}
        isOpen={isEditOpen}
        setIsOpen={setIsEditOpen}
      />

      <Card
        className={`w-full h-full hover:cursor-pointer hover:shadow-md transition-all duration-200 text-left relative flex flex-col group border-t-[6px] ${
          !isMobile && isDragOver
            ? "ring-2 ring-primary ring-offset-2 scale-[1.02] shadow-lg bg-primary/5"
            : ""
        }`}
        style={{ borderTopColor: accentColor }}
        onClick={handleNavigate}
        onDragOver={!isMobile ? handleDragOver : undefined}
        onDragLeave={!isMobile ? handleDragLeave : undefined}
        onDrop={!isMobile ? handleDrop : undefined}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => e.key === "Enter" && handleNavigate()}
        aria-label={`Open album ${album.name}`}
      >
        {/* Drop indicator overlay */}
        {isDragOver && (
          <div className="absolute inset-0 rounded-[inherit] border-2 border-dashed border-primary/60 bg-primary/5 z-10 flex items-center justify-center pointer-events-none">
            <div className="flex items-center gap-2 text-primary text-sm font-semibold bg-background/90 px-3 py-1.5 rounded-full shadow">
              <Iconify icon="solar:folder-add-bold-duotone" width={18} />
              Drop to add
            </div>
          </div>
        )}

        <CardHeader className="p-4 pb-2">
          <div className="flex items-center gap-2">
            <span className="text-2xl leading-none select-none">{album.icon ?? "📁"}</span>
            <CardTitle className="text-base font-semibold truncate flex-1 leading-tight">
              {album.name}
            </CardTitle>
            <Iconify
              icon="solar:alt-arrow-right-linear"
              width={16}
              className="text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0"
            />
          </div>
        </CardHeader>

        <CardContent className="p-4 pt-0 flex-grow">
          {album.description && (
            <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed mb-2">
              {album.description}
            </p>
          )}
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <Iconify icon="solar:document-text-linear" width={13} />
              {album._count.notes} {album._count.notes === 1 ? "note" : "notes"}
            </span>
            {album._count.children > 0 && (
              <span className="flex items-center gap-1">
                <Iconify icon="solar:folder-2-linear" width={13} />
                {album._count.children} {album._count.children === 1 ? "album" : "albums"}
              </span>
            )}
          </div>
        </CardContent>

        <CardFooter className="p-4 pt-0">
          <div
            className="flex flex-wrap gap-2"
            onClick={(e) => e.stopPropagation()}
          >
            <Button
              variant="outline"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                setIsEditOpen(true);
              }}
            >
              <Iconify icon="solar:pen-new-square-bold-duotone" width={16} className="mr-1" />
              Edit
            </Button>
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
    </>
  );
};

export default NoteAlbumCard;
