import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { CACHE_STRATEGIES } from "./queryConfig";
import { useToast } from "@/components/ui/Misc/use-toast";
import { NoteAlbumSchema } from "@/schema";
import { z } from "zod";
import { useSession } from "next-auth/react";
import { validateSession } from "@/lib/session";
import { createNoteAlbum } from "@/services/noteAlbum/createNoteAlbum";
import { getNoteAlbums, getNoteAlbumById } from "@/services/noteAlbum/getNoteAlbums";
import { updateNoteAlbum } from "@/services/noteAlbum/updateNoteAlbum";
import { deleteNoteAlbum } from "@/services/noteAlbum/deleteNoteAlbum";
import {
  addNoteToAlbum,
  removeNoteFromAlbum,
  getNotesByAlbum,
  getRootLevelNotes,
  getPinnedNotes,
} from "@/services/noteAlbum/noteAlbumMembership";
import { NOTE_QUERY_KEY } from "./noteQueries";

export const NOTE_ALBUM_QUERY_KEY = "noteAlbums";

// ─── 1. Fetch All Albums ──────────────────────────────────────────────────────

export const useFetchNoteAlbums = () => {
  const { data: session } = useSession();
  const userId = session?.user?.id;

  return useQuery({
    queryKey: [NOTE_ALBUM_QUERY_KEY, userId],
    queryFn: async () => {
      validateSession(session);
      const response = await getNoteAlbums(userId!);
      if (!response.success) throw new Error(response.message);
      return response.albums;
    },
    enabled: !!userId,
    ...CACHE_STRATEGIES.REGULAR,
  });
};

// ─── 2. Fetch Single Album (with ancestors for breadcrumb) ───────────────────

export const useFetchNoteAlbum = (albumId: string | null) => {
  const { data: session } = useSession();
  const userId = session?.user?.id;

  return useQuery({
    queryKey: [NOTE_ALBUM_QUERY_KEY, "detail", albumId, userId],
    queryFn: async () => {
      validateSession(session);
      const response = await getNoteAlbumById(albumId!, userId!);
      if (!response.success) throw new Error(response.message);
      return response.album;
    },
    enabled: !!userId && !!albumId,
    ...CACHE_STRATEGIES.REGULAR,
  });
};

// ─── 3. Fetch Notes in an Album ───────────────────────────────────────────────

export const useFetchNotesByAlbum = (albumId: string | null) => {
  const { data: session } = useSession();
  const userId = session?.user?.id;

  return useQuery({
    queryKey: ["notesByAlbum", albumId, userId],
    queryFn: async () => {
      validateSession(session);
      const response = await getNotesByAlbum(albumId!, userId!);
      if (!response.success) throw new Error(response.message);
      return response.notes;
    },
    enabled: !!userId && !!albumId,
    ...CACHE_STRATEGIES.REGULAR,
  });
};

// ─── 4. Fetch Root-Level Notes (no album) ────────────────────────────────────

export const useFetchRootNotes = () => {
  const { data: session } = useSession();
  const userId = session?.user?.id;

  return useQuery({
    queryKey: ["rootNotes", userId],
    queryFn: async () => {
      validateSession(session);
      const response = await getRootLevelNotes(userId!);
      if (!response.success) throw new Error(response.message);
      return response.notes;
    },
    enabled: !!userId,
    ...CACHE_STRATEGIES.REGULAR,
  });
};

// ─── 4b. Fetch ALL Pinned Notes (cross-album, for root page) ─────────────────

export const useFetchPinnedNotes = () => {
  const { data: session } = useSession();
  const userId = session?.user?.id;

  return useQuery({
    queryKey: ["pinnedNotes", userId],
    queryFn: async () => {
      validateSession(session);
      const response = await getPinnedNotes(userId!);
      if (!response.success) throw new Error(response.message);
      return response.notes;
    },
    enabled: !!userId,
    ...CACHE_STRATEGIES.REGULAR,
  });
};

// ─── 5. Create Album ─────────────────────────────────────────────────────────

export const useCreateNoteAlbum = () => {
  const { data: session } = useSession();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const userId = session?.user?.id;

  return useMutation({
    mutationFn: async (data: z.infer<typeof NoteAlbumSchema>) => {
      validateSession(session);
      const response = await createNoteAlbum(data, userId!);
      if (!response.success) throw new Error(response.message);
      return response;
    },
    onSuccess: () => {
      toast({ title: "Album Created", description: "Album created successfully", duration: 3000 });
      queryClient.invalidateQueries({ queryKey: [NOTE_ALBUM_QUERY_KEY] });
    },
    onError: () => {
      toast({
        title: "Album Not Created",
        description: "An error occurred while creating the album.",
        duration: 3000,
        variant: "destructive",
      });
    },
  });
};

// ─── 6. Update Album ─────────────────────────────────────────────────────────

export const useUpdateNoteAlbum = () => {
  const { data: session } = useSession();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const userId = session?.user?.id;

  return useMutation({
    mutationFn: async ({
      albumId,
      data,
    }: {
      albumId: string;
      data: Partial<z.infer<typeof NoteAlbumSchema>>;
    }) => {
      validateSession(session);
      const response = await updateNoteAlbum(albumId, data, userId!);
      if (!response.success) throw new Error(response.message);
      return response;
    },
    onSuccess: () => {
      toast({ title: "Album Updated", description: "Album updated successfully", duration: 3000 });
      queryClient.invalidateQueries({ queryKey: [NOTE_ALBUM_QUERY_KEY] });
    },
    onError: () => {
      toast({
        title: "Album Not Updated",
        description: "An error occurred while updating the album.",
        duration: 3000,
        variant: "destructive",
      });
    },
  });
};

// ─── 7. Delete Album ─────────────────────────────────────────────────────────

export const useDeleteNoteAlbum = () => {
  const { data: session } = useSession();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const userId = session?.user?.id;

  return useMutation({
    mutationFn: async (albumId: string) => {
      validateSession(session);
      const response = await deleteNoteAlbum(albumId, userId!);
      if (!response.success) throw new Error(response.message);
      return response;
    },
    onSuccess: () => {
      toast({ title: "Album Deleted", description: "Album deleted successfully", duration: 3000 });
      queryClient.invalidateQueries({ queryKey: [NOTE_ALBUM_QUERY_KEY] });
      queryClient.invalidateQueries({ queryKey: [NOTE_QUERY_KEY] });
      queryClient.invalidateQueries({ queryKey: ["notesByAlbum"] });
      queryClient.invalidateQueries({ queryKey: ["rootNotes"] });
      queryClient.invalidateQueries({ queryKey: ["pinnedNotes"] });
    },
    onError: () => {
      toast({
        title: "Album Not Deleted",
        description: "An error occurred while deleting the album.",
        duration: 3000,
        variant: "destructive",
      });
    },
  });
};

// ─── 8. Add Note to Album ─────────────────────────────────────────────────────

export const useAddNoteToAlbum = () => {
  const { data: session } = useSession();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ noteId, albumId }: { noteId: string; albumId: string }) => {
      validateSession(session);
      const response = await addNoteToAlbum(noteId, albumId);
      if (!response.success) throw new Error(response.message);
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [NOTE_ALBUM_QUERY_KEY] });
      queryClient.invalidateQueries({ queryKey: [NOTE_QUERY_KEY] });
      queryClient.invalidateQueries({ queryKey: ["notesByAlbum"] });
      queryClient.invalidateQueries({ queryKey: ["rootNotes"] });
      queryClient.invalidateQueries({ queryKey: ["pinnedNotes"] });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Could not add note to album.",
        duration: 3000,
        variant: "destructive",
      });
    },
  });
};

// ─── 9. Remove Note from Album ────────────────────────────────────────────────

export const useRemoveNoteFromAlbum = () => {
  const { data: session } = useSession();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const userId = session?.user?.id;

  return useMutation({
    mutationFn: async ({ noteId, albumId }: { noteId: string; albumId: string }) => {
      validateSession(session);
      const response = await removeNoteFromAlbum(noteId, albumId);
      if (!response.success) throw new Error(response.message);
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [NOTE_ALBUM_QUERY_KEY] });
      queryClient.invalidateQueries({ queryKey: [NOTE_QUERY_KEY] });
      queryClient.invalidateQueries({ queryKey: ["notesByAlbum"] });
      queryClient.invalidateQueries({ queryKey: ["rootNotes"] });
      queryClient.invalidateQueries({ queryKey: ["pinnedNotes"] });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Could not remove note from album.",
        duration: 3000,
        variant: "destructive",
      });
    },
  });
};
