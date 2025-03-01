import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/components/ui/Misc/use-toast";
import { TodoSchema } from "@/schema";
import { ToDo } from "@prisma/client";
import { z } from "zod";
import { useSession } from "next-auth/react";
import { validateSession } from "@/lib/session";
import { getToDos } from "@/services/todo/getTodos";
import { createToDo } from "@/services/todo/createTodo";
import { updateToDo } from "@/services/todo/updateTodo";
import { deleteToDo } from "@/services/todo/deleteTodo";
import {
  archiveToDo,
  deleteArchivedToDo,
  getArchivedToDos,
} from "@/services/todo/archiveTodo";

export const TODO_QUERY_KEY = "todos";

// 1. Fetch Todos Query
export const useFetchTodos = () => {
  const { data: session } = useSession();
  const userId = session?.user?.id;

  return useQuery({
    queryKey: [TODO_QUERY_KEY, userId],
    queryFn: async () => {
      validateSession(session);
      const response = await getToDos(userId!);
      if (!response.success) throw new Error(response.message);
      return response.todos as ToDo[];
    },
    enabled: !!userId,
    staleTime: 1000 * 60 * 5,
  });
};

// 2. Create Todo Mutation
export const useCreateTodo = () => {
  const { data: session } = useSession();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const userId = session?.user?.id;

  return useMutation({
    mutationFn: async (data: z.infer<typeof TodoSchema>) => {
      validateSession(session);
      const response = await createToDo(data, userId!);
      if (!response.success) throw new Error(response.message);
      return response;
    },
    onSuccess: () => {
      toast({
        title: "Todo Created",
        description: "Todo created successfully",
        duration: 3000,
      });

      queryClient.invalidateQueries({ queryKey: [TODO_QUERY_KEY, userId] });
    },
    onError: (error: any) => {
      toast({
        title: "Todo Not Created",
        description:
           "An error occurred while creating the todo.",
        duration: 3000,
        variant: "destructive",
      });
    },
  });
};

// 3. Update Todo Mutation
export const useUpdateTodo = () => {
  const { data: session } = useSession();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const userId = session?.user?.id;

  return useMutation({
    mutationFn: async (data: Partial<ToDo>) => {
      validateSession(session);
      const response = await updateToDo(data);
      if (!response.success) throw new Error(response.message);
      return response;
    },
    onMutate: async (updatedTodo) => {
      await queryClient.cancelQueries({ queryKey: [TODO_QUERY_KEY, userId] });

      const previousTodos = queryClient.getQueryData([TODO_QUERY_KEY, userId]);

      queryClient.setQueryData(
        [TODO_QUERY_KEY, userId],
        (old: ToDo[] | undefined) => {
          if (!old) return [updatedTodo];
          return old.map((todo) =>
            todo.id === updatedTodo.id ? updatedTodo : todo
          );
        }
      );

      return { previousTodos };
    },
    onSuccess: () => {
      toast({
        title: "Todo Updated",
        description: "Todo updated successfully",
        duration: 3000,
      });
      queryClient.invalidateQueries({ queryKey: [TODO_QUERY_KEY, userId] });
      queryClient.invalidateQueries({ queryKey: ["combinedDailyItems", userId] });
    },
    onError: (error: any, _, context) => {
      queryClient.setQueryData(
        [TODO_QUERY_KEY, userId],
        context?.previousTodos
      );
      toast({
        title: "Todo Not Updated",
        description:
           "An error occurred while updating the todo.",
        duration: 3000,
        variant: "destructive",
      });
    },
  });
};

// 4. Delete Todo Mutation
export const useDeleteTodo = () => {
  const { data: session } = useSession();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const userId = session?.user?.id;

  return useMutation({
    mutationFn: async (id: string) => {
      validateSession(session);
      const response = await deleteToDo(id);
      if (!response.success) throw new Error(response.message);
      return response;
    },
    onMutate: async (deletedId) => {
      await queryClient.cancelQueries({ queryKey: [TODO_QUERY_KEY, userId] });

      const previousTodos = queryClient.getQueryData([TODO_QUERY_KEY, userId]);

      queryClient.setQueryData(
        [TODO_QUERY_KEY, userId],
        (old: ToDo[] | undefined) => {
          if (!old) return [];
          return old.filter((todo) => todo.id !== deletedId);
        }
      );

      return { previousTodos };
    },
    onSuccess: () => {
      toast({
        title: "Todo Deleted",
        description: "Todo deleted successfully",
        duration: 3000,
      });
      queryClient.invalidateQueries({ queryKey: [TODO_QUERY_KEY, userId] });
    },
    onError: (error: any, _, context) => {
      queryClient.setQueryData(
        [TODO_QUERY_KEY, userId],
        context?.previousTodos
      );
      toast({
        title: "Todo Not Deleted",
        description:
           "An error occurred while deleting the todo.",
        duration: 3000,
        variant: "destructive",
      });
    },
  });
};

// 5. Archive Todo Mutation
export const useArchiveTodo = () => {
  const { data: session } = useSession();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const userId = session?.user?.id;

  return useMutation({
    mutationFn: async (id: string) => {
      validateSession(session);
      const response = await archiveToDo(id);
      if (!response.success) throw new Error(response.message);
      return response;
    },
    onMutate: async (archivedId) => {
      await queryClient.cancelQueries({ queryKey: [TODO_QUERY_KEY, userId] });

      const previousTodos = queryClient.getQueryData([TODO_QUERY_KEY, userId]);

      queryClient.setQueryData(
        [TODO_QUERY_KEY, userId],
        (old: ToDo[] | undefined) => {
          if (!old) return [];
          return old.filter((todo) => todo.id !== archivedId);
        }
      );

      return { previousTodos };
    },
    onSuccess: () => {
      toast({
        title: "Todo Archived",
        description: "Todo archived successfully",
        duration: 3000,
      });
      queryClient.invalidateQueries({ queryKey: [TODO_QUERY_KEY, userId] });
      // Also invalidate archived todos query if it exists
      queryClient.invalidateQueries({ queryKey: ["archivedTodos", userId] });
    },
    onError: (error: any, _, context) => {
      queryClient.setQueryData(
        [TODO_QUERY_KEY, userId],
        context?.previousTodos
      );
      toast({
        title: "Todo Not Archived",
        description:
           "An error occurred while archiving the todo.",
        duration: 3000,
        variant: "destructive",
      });
    },
  });
};

// 6. Fetch Archived Todos Query
export const useFetchArchivedTodos = () => {
  const { data: session } = useSession();
  const userId = session?.user?.id;

  return useQuery({
    queryKey: ["archivedTodos", userId],
    queryFn: async () => {
      validateSession(session);
      const response = await getArchivedToDos(userId!);
      if (!response.success) throw new Error(response.message);
      return response.archivedTodos;
    },
    enabled: !!userId,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

// 7. Delete Archived Todo Mutation
export const useDeleteArchivedTodo = () => {
  const { data: session } = useSession();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const userId = session?.user?.id;

  return useMutation({
    mutationFn: async (id: string) => {
      validateSession(session);
      const response = await deleteArchivedToDo(id);
      if (!response.success) throw new Error(response.message);
      return response;
    },
    onSuccess: () => {
      toast({
        title: "Archived Todo Deleted",
        description: "Archived todo deleted successfully",
        duration: 3000,
      });
      queryClient.invalidateQueries({ queryKey: ["archivedTodos", userId] });
    },
    onError: (error: any) => {
      toast({
        title: "Archived Todo Not Deleted",
        description:
          
          "An error occurred while deleting the archived todo.",
        duration: 3000,
        variant: "destructive",
      });
    },
  });
};
