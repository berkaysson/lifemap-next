"use client";


import { useFetchNotesByEntity } from "@/queries/noteQueries";
import { Note } from "@prisma/client";
import { Iconify } from "../ui/iconify";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "../ui/collapsible";
import { useState } from "react";
import { getContentPreview } from "@/helpers/note";
import { formatDateFriendly } from "@/lib/time";
import NoteShowDialog from "./NoteShowDialog";

interface RelatedNotesProps {
  entityType: "habit" | "task" | "todo" | "project" | "category";
  entityId: string;
}

const RelatedNotes = ({ entityType, entityId }: RelatedNotesProps) => {
  const { data: notes, isLoading } = useFetchNotesByEntity(
    entityType,
    entityId,
  );
  const [isOpen, setIsOpen] = useState(false);


  if (isLoading || !notes || notes.length === 0) {
    return null;
  }

  return (
    <div className="mt-2">
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleTrigger className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors w-full">
          <Iconify
            icon="solar:document-text-bold"
            width={16}
            className="shrink-0"
          />
          <span>Related Notes ({notes.length})</span>
          <Iconify
            icon={
              isOpen ? "solar:alt-arrow-up-bold" : "solar:alt-arrow-down-bold"
            }
            width={14}
            className="ml-auto shrink-0"
          />
        </CollapsibleTrigger>
        <CollapsibleContent className="mt-2 space-y-2">
          {notes.map((note: Note) => (
            <NoteShowDialog
              key={note.id}
              note={note}
              triggerButton={
                <div className="flex items-start gap-2 p-2 rounded-md border bg-card hover:bg-accent/50 cursor-pointer transition-colors text-left w-full group">
                  <div
                    className="w-2 h-2 rounded-full mt-1.5 shrink-0"
                    style={{ backgroundColor: note.colorCode || "#714DD9" }}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate group-hover:underline underline-offset-2 decoration-muted-foreground/30">{note.title}</p>
                    <p className="text-xs text-muted-foreground line-clamp-1 mt-0.5">
                      {getContentPreview(note.content as any, 80)}
                    </p>
                  </div>
                  <span className="text-xs text-muted-foreground whitespace-nowrap opacity-70 group-hover:opacity-100 transition-opacity">
                    {formatDateFriendly(note.updatedAt)}
                  </span>
                </div>
              }
            />
          ))}
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
};

export default RelatedNotes;
