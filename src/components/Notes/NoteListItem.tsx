"use client";

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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";

const NoteListItem = ({ note }: { note: Note & { mentions: any[] } }) => {
  const { mutateAsync: deleteNote } = useDeleteNote();
  const updateNoteMutation = useUpdateNote();

  const handleDelete = async () => {
    await deleteNote(note.id);
  };

  const handleTogglePin = async () => {
    const updatedNote = { ...note, pinned: !note.pinned };
    await updateNoteMutation.mutateAsync(updatedNote);
  };

  const contentPreview = getContentPreview(note.content as any);
  const hasMentions = note?.mentions?.length > 0;

  return (
    <NoteShowDialog
      note={note}
      triggerButton={
        <Card
          className="w-full h-full hover:cursor-pointer hover:-translate-y-1 hover:shadow-md transition-all duration-200 text-left relative flex flex-col group border-t-[6px]"
          style={{ borderTopColor: note.colorCode || "#714DD9" }}
        >
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

          {hasMentions && (
            <TooltipProvider delayDuration={100}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="absolute bottom-1 right-1 z-10 w-6 h-6 rounded-full bg-background flex items-center justify-center text-foreground shadow-sm border border-border">
                    <Iconify icon="solar:mention-circle-linear" width={16} />
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p className="text-xs">Has mentions</p>
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
      }
    />
  );
};

export default NoteListItem;
