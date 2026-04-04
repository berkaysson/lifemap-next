import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/components/ui/Misc/use-toast";
import { NoteSchema } from "@/schema";
import { Note } from "@prisma/client";
import { z } from "zod";
import { useSession } from "next-auth/react";
import { validateSession } from "@/lib/session";
import { getNotes } from "@/services/note/getNotes";
import { createNote } from "@/services/note/createNote";
import { updateNote } from "@/services/note/updateNote";
import { deleteNote } from "@/services/note/deleteNote";
import { getNotesByEntity } from "@/services/note/getNotesByEntity";

export const NOTE_QUERY_KEY = "notes";

// 1. Fetch Notes Query
export const useFetchNotes = () => {
  const { data: session } = useSession();
  const userId = session?.user?.id;

  return useQuery({
    queryKey: [NOTE_QUERY_KEY, userId],
    queryFn: async () => {
      validateSession(session);
      const response = await getNotes(userId!);
      if (!response.success) throw new Error(response.message);
      return response.notes as (Note & {
        mentions: {
          id: string;
          noteId: string;
          entityType: string;
          entityId: string;
        }[];
      })[];
    },
    enabled: !!userId,
    staleTime: 1000 * 60 * 5,
  });
};

// 2. Create Note Mutation
export const useCreateNote = () => {
  const { data: session } = useSession();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const userId = session?.user?.id;

  return useMutation({
    mutationFn: async (data: z.infer<typeof NoteSchema>) => {
      validateSession(session);
      const serializableData = JSON.parse(JSON.stringify(data));
      const response = await createNote(serializableData, userId!);
      if (!response.success) throw new Error(response.message);
      return response;
    },
    onSuccess: () => {
      toast({
        title: "Note Created",
        description: "Note created successfully",
        duration: 3000,
      });

      queryClient.invalidateQueries({ queryKey: [NOTE_QUERY_KEY, userId] });
    },
    onError: (error: any) => {
      toast({
        title: "Note Not Created",
        description: "An error occurred while creating the note.",
        duration: 3000,
        variant: "destructive",
      });
    },
  });
};

// 3. Update Note Mutation
export const useUpdateNote = () => {
  const { data: session } = useSession();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const userId = session?.user?.id;

  return useMutation({
    mutationFn: async (
      data: Partial<Note> & {
        mentions?: { entityType: string; entityId: string }[];
      },
    ) => {
      validateSession(session);
      const serializableData = JSON.parse(JSON.stringify(data));
      const response = await updateNote(serializableData);
      if (!response.success) throw new Error(response.message);
      return response;
    },
    onMutate: async (updatedNote) => {
      await queryClient.cancelQueries({ queryKey: [NOTE_QUERY_KEY, userId] });

      const previousNotes = queryClient.getQueryData([NOTE_QUERY_KEY, userId]);

      queryClient.setQueryData(
        [NOTE_QUERY_KEY, userId],
        (old: Note[] | undefined) => {
          if (!old) return [updatedNote];
          return old.map((note) =>
            note.id === updatedNote.id ? { ...note, ...updatedNote } : note,
          );
        },
      );

      return { previousNotes };
    },
    onSuccess: () => {
      toast({
        title: "Note Updated",
        description: "Note updated successfully",
        duration: 3000,
      });
      queryClient.invalidateQueries({ queryKey: [NOTE_QUERY_KEY, userId] });
    },
    onError: (error: any, _, context) => {
      queryClient.setQueryData(
        [NOTE_QUERY_KEY, userId],
        context?.previousNotes,
      );
      toast({
        title: "Note Not Updated",
        description: "An error occurred while updating the note.",
        duration: 3000,
        variant: "destructive",
      });
    },
  });
};

// 4. Delete Note Mutation
export const useDeleteNote = () => {
  const { data: session } = useSession();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const userId = session?.user?.id;

  return useMutation({
    mutationFn: async (id: string) => {
      validateSession(session);
      const response = await deleteNote(id);
      if (!response.success) throw new Error(response.message);
      return response;
    },
    onMutate: async (deletedId) => {
      await queryClient.cancelQueries({ queryKey: [NOTE_QUERY_KEY, userId] });

      const previousNotes = queryClient.getQueryData([NOTE_QUERY_KEY, userId]);

      queryClient.setQueryData(
        [NOTE_QUERY_KEY, userId],
        (old: Note[] | undefined) => {
          if (!old) return [];
          return old.filter((note) => note.id !== deletedId);
        },
      );

      return { previousNotes };
    },
    onSuccess: () => {
      toast({
        title: "Note Deleted",
        description: "Note deleted successfully",
        duration: 3000,
      });
      queryClient.invalidateQueries({ queryKey: [NOTE_QUERY_KEY, userId] });
    },
    onError: (error: any, _, context) => {
      queryClient.setQueryData(
        [NOTE_QUERY_KEY, userId],
        context?.previousNotes,
      );
      toast({
        title: "Note Not Deleted",
        description: "An error occurred while deleting the note.",
        duration: 3000,
        variant: "destructive",
      });
    },
  });
};

// 5. Fetch Notes by Entity Query
export const useFetchNotesByEntity = (entityType: string, entityId: string) => {
  const { data: session } = useSession();
  const userId = session?.user?.id;

  return useQuery({
    queryKey: ["notesByEntity", entityType, entityId, userId],
    queryFn: async () => {
      validateSession(session);
      const response = await getNotesByEntity(entityType, entityId, userId!);
      if (!response.success) throw new Error(response.message);
      return response.notes as Note[];
    },
    enabled: !!userId && !!entityType && !!entityId,
    staleTime: 1000 * 60 * 5,
  });
};
