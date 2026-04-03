"use client";

import { Button } from "../ui/Buttons/button";
import { formatDateFriendly } from "@/lib/time";
import ColorCircle from "../ui/Shared/ColorCircle";
import NoteEditForm from "./NoteEditForm";
import ButtonWithConfirmation from "../ui/Buttons/ButtonWithConfirmation";
import { useDeleteNote, useUpdateNote } from "@/queries/noteQueries";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Badge } from "../ui/badge";
import { Iconify } from "../ui/iconify";
import { LoadingButton } from "../ui/Buttons/loading-button";
import { Note } from "@prisma/client";
import { getContentPreview } from "@/helpers/note";

const NoteListItem = ({ note }: { note: Note }) => {
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

  return (
    <Card className="w-full max-w-md h-full">
      <div className="flex justify-between p-1 pb-0">
        <ColorCircle colorCode={note.colorCode || "#714DD9"} />
        {note.pinned && (
          <Badge variant="outline" className="text-xs">
            <Iconify icon="solar:pin-bold" width={14} className="mr-1" />
            Pinned
          </Badge>
        )}
      </div>

      <CardHeader className="p-3 pt-1">
        <div className="flex items-center justify-between">
          <CardTitle className="text-md font-semibold flex items-center gap-1">
            {note.title}
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent className="px-3">
        {contentPreview && (
          <CardDescription className="line-clamp-3">
            {contentPreview}
          </CardDescription>
        )}
        <div className="flex flex-col gap-2 mt-2">
          <div className="flex items-center text-sm text-shade">
            <Iconify
              icon="solar:calendar-date-bold"
              width={20}
              className="mr-2"
            />
            {formatDateFriendly(note.updatedAt)}
          </div>
        </div>
      </CardContent>
      <CardFooter className="px-3 pb-2">
        <div className="flex flex-wrap gap-2">
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
              icon={note.pinned ? "solar:pin-bold-duotone" : "solar:pin-linear"}
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
  );
};

export default NoteListItem;
