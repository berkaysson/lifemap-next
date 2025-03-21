import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/components/ui/Misc/use-toast";
import { TaskSchema } from "@/schema";
import { ExtendedTask } from "@/types/Entitities";
import { Task } from "@prisma/client";
import { useSession } from "next-auth/react";
import { z } from "zod";
import { validateSession } from "@/lib/session";
import { getTasks } from "@/services/task/getTasks";
import { createTask } from "@/services/task/createTask";
import { updateTask } from "@/services/task/updateTask";
import { deleteTask } from "@/services/task/deleteTask";
import {
  archiveTask,
  deleteArchivedTask,
  getArchivedTasks,
} from "@/services/task/archiveTask";

export const TASK_QUERY_KEY = "tasks";

// 1. Fetch Tasks Query
export const useFetchTasks = () => {
  const { data: session } = useSession();
  const userId = session?.user?.id;

  return useQuery({
    queryKey: [TASK_QUERY_KEY, userId],
    queryFn: async () => {
      validateSession(session);
      const response = await getTasks(userId!);
      if (!response.success) throw new Error(response.message);
      return response.tasks as ExtendedTask[];
    },
    enabled: !!userId,
    staleTime: 1000 * 60 * 5,
  });
};

// 2. Create Task Mutation
export const useCreateTask = () => {
  const { data: session } = useSession();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const userId = session?.user?.id;

  return useMutation({
    mutationFn: async (data: z.infer<typeof TaskSchema>) => {
      validateSession(session);
      const response = await createTask(data, userId!);
      if (!response.success) throw new Error(response.message);
      return response;
    },
    onSuccess: () => {
      toast({
        title: "Task Created",
        description: "Task created successfully",
        duration: 3000,
      });

      queryClient.invalidateQueries({ queryKey: [TASK_QUERY_KEY, userId] });
    },
    onError: (error: any) => {
      toast({
        title: "Task Not Created",
        description:
           "An error occurred while creating the task.",
        duration: 3000,
        variant: "destructive",
      });
    },
  });
};

// 3. Update Task Mutation
export const useUpdateTask = () => {
  const { data: session } = useSession();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const userId = session?.user?.id;

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<Task> }) => {
      validateSession(session);
      const response = await updateTask(id, data);
      if (!response.success) throw new Error(response.message);
      return response;
    },
    onMutate: async (updatedTask) => {
      await queryClient.cancelQueries({ queryKey: [TASK_QUERY_KEY, userId] });

      const previousTasks = queryClient.getQueryData([TASK_QUERY_KEY, userId]);

      queryClient.setQueryData(
        [TASK_QUERY_KEY, userId],
        (old: ExtendedTask[] | undefined) => {
          if (!old) return [updatedTask];
          return old.map((task) =>
            task.id === updatedTask.id ? { ...task, ...updatedTask } : task
          );
        }
      );

      return { previousTasks };
    },
    onSuccess: () => {
      toast({
        title: "Task Updated",
        description: "Task updated successfully",
        duration: 3000,
      });
      queryClient.invalidateQueries({ queryKey: [TASK_QUERY_KEY, userId] });
    },
    onError: (error: any, _, context) => {
      queryClient.setQueryData(
        [TASK_QUERY_KEY, userId],
        context?.previousTasks
      );
      toast({
        title: "Task Not Updated",
        description:
           "An error occurred while updating the task.",
        duration: 3000,
        variant: "destructive",
      });
    },
  });
};

// 4. Delete Task Mutation
export const useDeleteTask = () => {
  const { data: session } = useSession();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const userId = session?.user?.id;

  return useMutation({
    mutationFn: async (id: string) => {
      validateSession(session);
      const response = await deleteTask(id);
      if (!response.success) throw new Error(response.message);
      return response;
    },
    onMutate: async (deletedId) => {
      await queryClient.cancelQueries({ queryKey: [TASK_QUERY_KEY, userId] });

      const previousTasks = queryClient.getQueryData([TASK_QUERY_KEY, userId]);

      queryClient.setQueryData(
        [TASK_QUERY_KEY, userId],
        (old: ExtendedTask[] | undefined) => {
          if (!old) return [];
          return old.filter((task) => task.id !== deletedId);
        }
      );

      return { previousTasks };
    },
    onSuccess: () => {
      toast({
        title: "Task Deleted",
        description: "Task deleted successfully",
        duration: 3000,
      });
      queryClient.invalidateQueries({ queryKey: [TASK_QUERY_KEY, userId] });
    },
    onError: (error: any, _, context) => {
      queryClient.setQueryData(
        [TASK_QUERY_KEY, userId],
        context?.previousTasks
      );
      toast({
        title: "Task Not Deleted",
        description:
           "An error occurred while deleting the task.",
        duration: 3000,
        variant: "destructive",
      });
    },
  });
};

// 5. Archive Task Mutation
export const useArchiveTask = () => {
  const { data: session } = useSession();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const userId = session?.user?.id;

  return useMutation({
    mutationFn: async (id: string) => {
      validateSession(session);
      const response = await archiveTask(id);
      if (!response.success) throw new Error(response.message);
      return response;
    },
    onMutate: async (archivedId) => {
      await queryClient.cancelQueries({ queryKey: [TASK_QUERY_KEY, userId] });

      const previousTasks = queryClient.getQueryData([TASK_QUERY_KEY, userId]);

      queryClient.setQueryData(
        [TASK_QUERY_KEY, userId],
        (old: ExtendedTask[] | undefined) => {
          if (!old) return [];
          return old.filter((task) => task.id !== archivedId);
        }
      );

      return { previousTasks };
    },
    onSuccess: () => {
      toast({
        title: "Task Archived",
        description: "Task archived successfully",
        duration: 3000,
      });
      queryClient.invalidateQueries({ queryKey: [TASK_QUERY_KEY, userId] });
      queryClient.invalidateQueries({ queryKey: ["archivedTasks", userId] });
    },
    onError: (error: any, _, context) => {
      queryClient.setQueryData(
        [TASK_QUERY_KEY, userId],
        context?.previousTasks
      );
      toast({
        title: "Task Not Archived",
        description:
           "An error occurred while archiving the task.",
        duration: 3000,
        variant: "destructive",
      });
    },
  });
};

// 6. Fetch Archived Tasks Query
export const useFetchArchivedTasks = () => {
  const { data: session } = useSession();
  const userId = session?.user?.id;

  return useQuery({
    queryKey: ["archivedTasks", userId],
    queryFn: async () => {
      validateSession(session);
      const response = await getArchivedTasks(userId!);
      if (!response.success) throw new Error(response.message);
      return response.archivedTasks;
    },
    enabled: !!userId,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

// 7. Delete Archived Task Mutation
export const useDeleteArchivedTask = () => {
  const { data: session } = useSession();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const userId = session?.user?.id;

  return useMutation({
    mutationFn: async (id: string) => {
      validateSession(session);
      const response = await deleteArchivedTask(id);
      if (!response.success) throw new Error(response.message);
      return response;
    },
    onSuccess: () => {
      toast({
        title: "Archived Task Deleted",
        description: "Archived task deleted successfully",
        duration: 3000,
      });
      queryClient.invalidateQueries({ queryKey: ["archivedTasks", userId] });
    },
    onError: (error: any) => {
      toast({
        title: "Archived Task Not Deleted",
        description:
          
          "An error occurred while deleting the archived task.",
        duration: 3000,
        variant: "destructive",
      });
    },
  });
};
