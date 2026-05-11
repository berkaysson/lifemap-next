import { JSX } from "react";
import { Note } from "@prisma/client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "../ui/Modals/dialog";
import { RichTextEditor } from "../ui/RichTextEditor";
import { useMentionData } from "@/hooks/use-mention-data";
import ColorCircle from "../ui/Shared/ColorCircle";
import { formatDateFriendly } from "@/lib/time";
import type { JSONContent } from "@tiptap/core";
import { Badge } from "../ui/badge";
import { Iconify } from "../ui/iconify";
import NoteEditForm from "./NoteEditForm";
import { Button } from "../ui/Buttons/button";

interface NoteShowDialogProps {
  note: Note;
  triggerButton: JSX.Element;
}

const NoteShowDialog = ({ note, triggerButton }: NoteShowDialogProps) => {
  const mentionData = useMentionData();

  return (
    <Dialog>
      <DialogTrigger asChild>{triggerButton}</DialogTrigger>
      <DialogContent className="sm:max-w-[720px] max-h-[90vh] flex flex-col p-0 sm:rounded-xl overflow-hidden">
        <DialogHeader className="px-6 py-5 border-b shrink-0 bg-muted/20">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-3 mt-1">
              <ColorCircle colorCode={note.colorCode || "#714DD9"} />
              <DialogTitle className="text-2xl font-bold tracking-tight text-foreground">
                {note.title}
              </DialogTitle>
            </div>
            <div className="flex items-center gap-2 mt-1 mr-8">
              {note.pinned && (
                <Badge
                  variant="secondary"
                  className="shrink-0 text-xs font-medium"
                >
                  <Iconify
                    icon="solar:pin-bold"
                    width={14}
                    className="mr-1.5"
                  />
                  Pinned
                </Badge>
              )}
              <NoteEditForm
                initialValues={note}
                triggerButton={
                  <Button variant="outline" size="sm" className="h-8">
                    <Iconify
                      icon="solar:pen-new-square-bold-duotone"
                      width={16}
                      className="mr-1.5"
                    />
                    Edit
                  </Button>
                }
              />
            </div>
          </div>
          <DialogDescription className="mt-2 text-sm text-muted-foreground flex items-center">
            <Iconify
              icon="solar:calendar-date-bold"
              width={16}
              className="mr-1.5 opacity-70"
            />
            Last edit on {formatDateFriendly(note.updatedAt)}
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-y-scroll overflow-x-hidden px-6 py-4 mb-2">
          <RichTextEditor
            content={note.content as JSONContent}
            editable={false}
            enableMentions
            mentionData={mentionData}
            className="h-full border-none px-0 py-2 focus:outline-none shadow-none bg-transparent [&_.tiptap]:min-h-0 text-base leading-relaxed text-foreground"
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default NoteShowDialog;
