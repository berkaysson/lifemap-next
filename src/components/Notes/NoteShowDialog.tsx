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
import { ScrollArea } from "../ui/scroll-area";
import type { JSONContent } from "@tiptap/core";
import { Badge } from "../ui/badge";
import { Iconify } from "../ui/iconify";

interface NoteShowDialogProps {
  note: Note;
  triggerButton: JSX.Element;
}

const NoteShowDialog = ({ note, triggerButton }: NoteShowDialogProps) => {
  const mentionData = useMentionData();

  return (
    <Dialog>
      <DialogTrigger asChild>{triggerButton}</DialogTrigger>
      <DialogContent className="sm:max-w-[720px] max-h-[85vh] flex flex-col p-0 overflow-hidden sm:rounded-xl">
        <DialogHeader className="px-6 py-5 border-b shrink-0 bg-muted/20">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-3 mt-1">
              <ColorCircle colorCode={note.colorCode || "#714DD9"} />
              <DialogTitle className="text-2xl font-bold tracking-tight text-foreground">
                {note.title}
              </DialogTitle>
            </div>
            {note.pinned && (
              <Badge
                variant="secondary"
                className="shrink-0 mt-2 text-xs font-medium"
              >
                <Iconify icon="solar:pin-bold" width={14} className="mr-1.5" />
                Pinned
              </Badge>
            )}
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

        <ScrollArea className="flex-1">
          <div className="px-6 py-4">
            <RichTextEditor
              content={note.content as JSONContent}
              editable={false}
              enableMentions
              mentionData={mentionData}
              className="border-none px-0 py-2 focus:outline-none shadow-none bg-transparent [&_.tiptap]:min-h-0 text-base leading-relaxed"
            />
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default NoteShowDialog;
