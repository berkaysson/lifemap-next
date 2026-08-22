"use client";

import { useCallback, useEffect, useState } from "react";
import NoteListItem from "./NoteListItem";
import { cn, sortArrayOfObjectsByKey } from "@/lib/utils";
import SelectSort from "../ui/Shared/SelectSort";
import { useFetchNotes } from "@/queries/noteQueries";
import {
  useFetchNotesByAlbum,
  useFetchRootNotes,
  useFetchPinnedNotes,
} from "@/queries/noteAlbumQueries";
import Loading from "@/app/(protected)/dashboard/note/loading";
import NoteAlbumGrid from "./Albums/NoteAlbumGrid";
import { Iconify } from "../ui/iconify";
import NoteForm from "./NoteForm";
import { Button } from "../ui/Buttons/button";

interface NoteListProps {
  /** When provided, shows notes belonging to this album (and sub-albums above them) */
  albumId?: string | null;
}

type ViewMode = "albums" | "all";

const NoteList = ({ albumId = null }: NoteListProps) => {
  const isAlbumView = !!albumId;

  // View mode state (persisted in localStorage for root view)
  const [viewMode, setViewMode] = useState<ViewMode>("albums");

  useEffect(() => {
    if (!isAlbumView && typeof window !== "undefined") {
      const saved = localStorage.getItem("lifemap_notes_view") as ViewMode | null;
      if (saved === "albums" || saved === "all") {
        setViewMode(saved);
      }
    }
  }, [isAlbumView]);

  const handleViewChange = (mode: ViewMode) => {
    setViewMode(mode);
    if (typeof window !== "undefined") {
      localStorage.setItem("lifemap_notes_view", mode);
    }
  };

  // Queries
  const allNotesQuery = useFetchNotes();
  const albumNotesQuery = useFetchNotesByAlbum(albumId);
  const rootNotesQuery = useFetchRootNotes();
  const pinnedNotesQuery = useFetchPinnedNotes();

  // Active data selection based on context & viewMode
  const activeQuery = isAlbumView
    ? albumNotesQuery
    : viewMode === "all"
    ? allNotesQuery
    : rootNotesQuery;

  const { data: rawNotes, isLoading, isError, error } = activeQuery;
  const { data: allPinnedNotes } = pinnedNotesQuery;

  const [sortedNotes, setSortedNotes] = useState<any[]>([]);

  useEffect(() => {
    if (rawNotes) {
      if (isAlbumView) {
        // Album view: sort all notes in this album
        setSortedNotes(
          sortArrayOfObjectsByKey<any>(rawNotes, "updatedAt", "desc"),
        );
      } else if (viewMode === "all") {
        // All notes view: pinned notes first, then unpinned
        const pinned = rawNotes.filter((n: any) => n.pinned);
        const unpinned = rawNotes.filter((n: any) => !n.pinned);
        setSortedNotes([
          ...sortArrayOfObjectsByKey<any>(pinned, "updatedAt", "desc"),
          ...sortArrayOfObjectsByKey<any>(unpinned, "updatedAt", "desc"),
        ]);
      } else {
        // Albums view (root): exclude notes already shown in the top pinned section
        const pinnedIds = new Set((allPinnedNotes ?? []).map((n: any) => n.id));
        const unpinned = rawNotes.filter((n: any) => !pinnedIds.has(n.id));
        setSortedNotes(sortArrayOfObjectsByKey<any>(unpinned, "updatedAt", "desc"));
      }
    }
  }, [rawNotes, allPinnedNotes, isAlbumView, viewMode]);

  const handleSort = useCallback(
    (sortBy: string, direction: "asc" | "desc") => {
      if (!rawNotes || !rawNotes.length) return;
      if (isAlbumView) {
        setSortedNotes(sortArrayOfObjectsByKey<any>(rawNotes, sortBy as any, direction));
      } else if (viewMode === "all") {
        const pinned = rawNotes.filter((n: any) => n.pinned);
        const unpinned = rawNotes.filter((n: any) => !n.pinned);
        setSortedNotes([
          ...sortArrayOfObjectsByKey<any>(pinned, sortBy as any, direction),
          ...sortArrayOfObjectsByKey<any>(unpinned, sortBy as any, direction),
        ]);
      } else {
        const pinnedIds = new Set((allPinnedNotes ?? []).map((n: any) => n.id));
        const unpinned = rawNotes.filter((n: any) => !pinnedIds.has(n.id));
        setSortedNotes(sortArrayOfObjectsByKey<any>(unpinned, sortBy as any, direction));
      }
    },
    [rawNotes, allPinnedNotes, isAlbumView, viewMode],
  );

  if (isLoading) {
    return <Loading />;
  }

  const pinnedNotes = !isAlbumView && viewMode === "albums" ? (allPinnedNotes ?? []) : [];
  const allNotesCount = allNotesQuery.data?.length;

  return (
    <div className="flex flex-col gap-4 m-2">
      {/* ── View switcher toggle (only on root page) ──────────────────────── */}
      {!isAlbumView && (
        <div className="flex items-center justify-between gap-2 mb-1">
          <div className="inline-flex items-center bg-muted/60 p-1 rounded-xl border border-border shadow-xs">
            <button
              type="button"
              onClick={() => handleViewChange("albums")}
              className={cn(
                "flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-all cursor-pointer",
                viewMode === "albums"
                  ? "bg-background text-foreground shadow-xs"
                  : "text-muted-foreground hover:text-foreground hover:bg-background/40"
              )}
            >
              <Iconify icon="solar:folder-2-bold-duotone" width={16} />
              <span>Albums</span>
            </button>
            <button
              type="button"
              onClick={() => handleViewChange("all")}
              className={cn(
                "flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-all cursor-pointer",
                viewMode === "all"
                  ? "bg-background text-foreground shadow-xs"
                  : "text-muted-foreground hover:text-foreground hover:bg-background/40"
              )}
            >
              <Iconify icon="solar:document-text-bold-duotone" width={16} />
              <span>All Notes</span>
              {allNotesCount !== undefined && (
                <span className="text-xs px-1.5 py-0.5 rounded-full bg-muted font-normal text-muted-foreground">
                  {allNotesCount}
                </span>
              )}
            </button>
          </div>
        </div>
      )}

      {/* ── Albums view mode layout ───────────────────────────────────────── */}
      {(isAlbumView || viewMode === "albums") && (
        <>
          {/* Pinned section (root page only) */}
          {!isAlbumView && pinnedNotes.length > 0 && (
            <section>
              <div className="flex items-center gap-1.5 mb-3">
                <Iconify icon="solar:pin-bold-duotone" width={16} className="text-primary" />
                <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                  Pinned
                </h2>
                <span className="text-xs font-normal bg-muted rounded-full px-2 py-0.5">
                  {pinnedNotes.length}
                </span>
              </div>
              <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {pinnedNotes.map((note: any) => (
                  <NoteListItem key={note.id} note={note} />
                ))}
              </ul>
            </section>
          )}

          {/* Albums grid for current level */}
          <NoteAlbumGrid parentId={albumId} />
        </>
      )}

      {/* ── Notes section (shared by both views with contextual headers) ── */}
      <section>
        <div className="flex sm:flex-row justify-between flex-col-reverse gap-2 mb-4">
          <div className="flex items-center gap-1.5 flex-wrap">
            <Iconify icon="solar:document-text-bold-duotone" width={16} className="text-muted-foreground" />
            <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
              {isAlbumView
                ? "Notes in this album"
                : viewMode === "all"
                ? "All Notes"
                : "Notes without an album"}
            </h2>
            {sortedNotes.length > 0 && (
              <span className="text-xs font-normal bg-muted rounded-full px-2 py-0.5">
                {sortedNotes.length}
              </span>
            )}
            {isAlbumView && albumId && (
              <NoteForm
                defaultAlbumId={albumId}
                triggerButton={
                  <Button variant="ghost" size="sm" className="h-7 gap-1 text-xs ml-1 font-medium">
                    <Iconify icon="solar:add-square-linear" width={14} />
                    New Note
                  </Button>
                }
              />
            )}
          </div>
          <SelectSort
            options={[
              { value: "title", label: "Title" },
              { value: "updatedAt", label: "Last Updated" },
              { value: "createdAt", label: "Created Date" },
            ]}
            onSelect={handleSort}
          />
        </div>

        {isError && (
          <div className="text-sm text-destructive">
            Error loading notes: {(error as any)?.message}
          </div>
        )}

        {sortedNotes.length === 0 && !isLoading && (
          <div className="opacity-70 mt-2 text-sm text-muted-foreground flex items-center gap-2 flex-wrap">
            <Iconify icon="solar:document-text-linear" width={16} />
            {isAlbumView && albumId ? (
              <div className="flex items-center gap-2">
                <span>No notes in this album yet.</span>
                <NoteForm
                  defaultAlbumId={albumId}
                  triggerButton={
                    <Button variant="link" size="sm" className="h-auto p-0 text-xs text-primary underline">
                      Create a note in this album
                    </Button>
                  }
                />
              </div>
            ) : viewMode === "all" ? (
              "No notes found."
            ) : (
              "No notes without an album. All your notes are organised in albums!"
            )}
          </div>
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
