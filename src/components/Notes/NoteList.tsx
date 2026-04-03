"use client";

import { useCallback, useEffect, useState } from "react";
import NoteListItem from "./NoteListItem";
import { Note } from "@prisma/client";
import { sortArrayOfObjectsByKey } from "@/lib/utils";
import SelectSort from "../ui/Shared/SelectSort";
import { useFetchNotes } from "@/queries/noteQueries";
import Loading from "@/app/(protected)/dashboard/note/loading";

const NoteList = () => {
  const { data: notes, isLoading, isError, error } = useFetchNotes();
  const [sortedNotes, setSortedNotes] = useState<Note[]>([]);

  useEffect(() => {
    if (notes) {
      const pinned = notes.filter((n) => n.pinned);
      const unpinned = notes.filter((n) => !n.pinned);
      const sortedPinned = sortArrayOfObjectsByKey<Note>(
        pinned,
        "updatedAt",
        "desc",
      );
      const sortedUnpinned = sortArrayOfObjectsByKey<Note>(
        unpinned,
        "updatedAt",
        "desc",
      );
      setSortedNotes([...sortedPinned, ...sortedUnpinned]);
    }
  }, [notes]);

  const handleSort = useCallback(
    (sortBy: keyof Note, direction: "asc" | "desc") => {
      if (!notes || !notes.length) return;
      const pinned = notes.filter((n) => n.pinned);
      const unpinned = notes.filter((n) => !n.pinned);
      const sortedPinned = sortArrayOfObjectsByKey<Note>(
        pinned,
        sortBy,
        direction,
      );
      const sortedUnpinned = sortArrayOfObjectsByKey<Note>(
        unpinned,
        sortBy,
        direction,
      );
      setSortedNotes([...sortedPinned, ...sortedUnpinned]);
    },
    [notes],
  );

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className="flex flex-col gap-4 m-2">
      <section>
        <div className="flex sm:flex-row justify-between flex-col-reverse gap-2 mb-4">
          <div className="flex gap-2 flex-wrap">
            <SelectSort
              options={[
                { value: "title", label: "Title" },
                { value: "updatedAt", label: "Last Updated" },
                { value: "createdAt", label: "Created Date" },
              ]}
              onSelect={handleSort}
            />
          </div>
        </div>

        {isError && <div>Error loading notes: {error.message}</div>}
        {sortedNotes.length === 0 && !isLoading && (
          <div className="opacity-80 mt-2">No notes found.</div>
        )}

        <ul className="rounded-sm grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-2">
          {sortedNotes.map((note) => (
            <NoteListItem key={note.id} note={note} />
          ))}
        </ul>
      </section>
    </div>
  );
};

export default NoteList;
