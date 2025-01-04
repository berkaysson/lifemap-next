import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/components/ui/use-toast";
import { HabitSchema } from "@/schema";
import { ExtendedHabit } from "@/types/Entitities";
import { Habit } from "@prisma/client";
import { useSession } from "next-auth/react";
import { z } from "zod";
import { validateSession } from "@/lib/session";
import { getHabits } from "@/services/habit/getHabits";
import { createHabit } from "@/services/habit/createHabit";
import { deleteHabit } from "@/services/habit/deleteHabit";
import { archiveHabit, deleteArchivedHabit, getArchivedHabits } from "@/services/habit/archiveHabits";

export const HABIT_QUERY_KEY = "habits";

// 1. Fetch Habits Query
export const useFetchHabits = () => {
  const { data: session } = useSession();
  const userId = session?.user?.id;

  return useQuery({
    queryKey: [HABIT_QUERY_KEY, userId],
    queryFn: async () => {
      validateSession(session);
      const response = await getHabits(userId!);
      if (!response.success) throw new Error(response.message);
      response.habits?.forEach((habit) => {
        habit.progress.sort((a, b) => a.order - b.order);
      });
      return response.habits as ExtendedHabit[];
    },
    enabled: !!userId,
    staleTime: 1000 * 60 * 5,
  });
};

// 2. Create Habit Mutation
export const useCreateHabit = () => {
  const { data: session } = useSession();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const userId = session?.user?.id;

  return useMutation({
    mutationFn: async (data: z.infer<typeof HabitSchema>) => {
      validateSession(session);
      const response = await createHabit(data, userId!);
      if (!response.success) throw new Error(response.message);
      return response;
    },
    onSuccess: () => {
      toast({
        title: "Habit Created",
        description: "Habit created successfully",
        duration: 3000,
      });
      queryClient.invalidateQueries({ queryKey: [HABIT_QUERY_KEY, userId] });
    },
    onError: (error: any) => {
      toast({
        title: "Habit Not Created",
        description:
          error.message || "An error occurred while creating the habit.",
        duration: 3000,
        variant: "destructive",
      });
    },
  });
};

// 3. Update Habit Mutation (Empty for Now)
export const useUpdateHabit = () => {
  const { data: session } = useSession();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const userId = session?.user?.id;

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<Habit> }) => {
      validateSession(session);
      // TODO: update logic here
      return {
        success: true,
        message: "Update functionality not yet implemented.",
      };
    },
    onMutate: async (updatedHabit) => {
      await queryClient.cancelQueries({ queryKey: [HABIT_QUERY_KEY, userId] });

      const previousHabits = queryClient.getQueryData([
        HABIT_QUERY_KEY,
        userId,
      ]);

      queryClient.setQueryData(
        [HABIT_QUERY_KEY, userId],
        (old: ExtendedHabit[] | undefined) => {
          if (!old) return [updatedHabit];
          return old.map((habit) =>
            habit.id === updatedHabit.id ? { ...habit, ...updatedHabit } : habit
          );
        }
      );

      return { previousHabits };
    },
    onSuccess: () => {
      toast({
        title: "Habit Updated",
        description: "Habit updated successfully",
        duration: 3000,
      });
      queryClient.invalidateQueries({ queryKey: [HABIT_QUERY_KEY, userId] });
    },
    onError: (error: any, _, context) => {
      queryClient.setQueryData(
        [HABIT_QUERY_KEY, userId],
        context?.previousHabits
      );
      toast({
        title: "Habit Not Updated",
        description:
          error.message || "An error occurred while updating the habit.",
        duration: 3000,
        variant: "destructive",
      });
    },
  });
};

// 4. Delete Habit Mutation
export const useDeleteHabit = () => {
  const { data: session } = useSession();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const userId = session?.user?.id;

  return useMutation({
    mutationFn: async (id: string) => {
      validateSession(session);
      const response = await deleteHabit(id);
      if (!response.success) throw new Error(response.message);
      return response;
    },
    onMutate: async (deletedId) => {
      await queryClient.cancelQueries({ queryKey: [HABIT_QUERY_KEY, userId] });

      const previousHabits = queryClient.getQueryData([
        HABIT_QUERY_KEY,
        userId,
      ]);

      queryClient.setQueryData(
        [HABIT_QUERY_KEY, userId],
        (old: ExtendedHabit[] | undefined) => {
          if (!old) return [];
          return old.filter((habit) => habit.id !== deletedId);
        }
      );

      return { previousHabits };
    },
    onSuccess: () => {
      toast({
        title: "Habit Deleted",
        description: "Habit deleted successfully",
        duration: 3000,
      });
      queryClient.invalidateQueries({ queryKey: [HABIT_QUERY_KEY, userId] });
    },
    onError: (error: any, _, context) => {
      queryClient.setQueryData(
        [HABIT_QUERY_KEY, userId],
        context?.previousHabits
      );
      toast({
        title: "Habit Not Deleted",
        description:
          error.message || "An error occurred while deleting the habit.",
        duration: 3000,
        variant: "destructive",
      });
    },
  });
};

// 5. Archive Habit Mutation
export const useArchiveHabit = () => {
  const { data: session } = useSession();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const userId = session?.user?.id;

  return useMutation({
    mutationFn: async (id: string) => {
      validateSession(session);
      const response = await archiveHabit(id);
      if (!response.success) throw new Error(response.message);
      return response;
    },
    onMutate: async (archivedId) => {
      await queryClient.cancelQueries({ queryKey: [HABIT_QUERY_KEY, userId] });

      const previousHabits = queryClient.getQueryData([
        HABIT_QUERY_KEY,
        userId,
      ]);

      queryClient.setQueryData(
        [HABIT_QUERY_KEY, userId],
        (old: ExtendedHabit[] | undefined) => {
          if (!old) return [];
          return old.filter((habit) => habit.id !== archivedId);
        }
      );

      return { previousHabits };
    },
    onSuccess: () => {
      toast({
        title: "Habit Archived",
        description: "Habit archived successfully",
        duration: 3000,
      });
      queryClient.invalidateQueries({ queryKey: [HABIT_QUERY_KEY, userId] });
      queryClient.invalidateQueries({ queryKey: ["archivedHabits", userId] });
    },
    onError: (error: any, _, context) => {
      queryClient.setQueryData(
        [HABIT_QUERY_KEY, userId],
        context?.previousHabits
      );
      toast({
        title: "Habit Not Archived",
        description:
          error.message || "An error occurred while archiving the habit.",
        duration: 3000,
        variant: "destructive",
      });
    },
  });
};

// 6. Fetch Archived Habits Query
export const useFetchArchivedHabits = () => {
  const { data: session } = useSession();
  const userId = session?.user?.id;

  return useQuery({
    queryKey: ["archivedHabits", userId],
    queryFn: async () => {
      validateSession(session);
      const response = await getArchivedHabits(userId!);
      if (!response.success) throw new Error(response.message);
      return response.archivedHabits;
    },
    enabled: !!userId,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

// 7. Delete Archived Habit Mutation
export const useDeleteArchivedHabit = () => {
  const { data: session } = useSession();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const userId = session?.user?.id;

  return useMutation({
    mutationFn: async (id: string) => {
      validateSession(session);
      const response = await deleteArchivedHabit(id);
      if (!response.success) throw new Error(response.message);
      return response;
    },
    onSuccess: () => {
      toast({
        title: "Archived Habit Deleted",
        description: "Archived habit deleted successfully",
        duration: 3000,
      });
      queryClient.invalidateQueries({ queryKey: ["archivedHabits", userId] });
    },
    onError: (error: any) => {
      toast({
        title: "Archived Habit Not Deleted",
        description:
          error.message ||
          "An error occurred while deleting the archived habit.",
        duration: 3000,
        variant: "destructive",
      });
    },
  });
};
