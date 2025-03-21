import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/components/ui/Misc/use-toast";
import { CategorySchema } from "@/schema";
import { Category } from "@prisma/client";
import { z } from "zod";
import { useSession } from "next-auth/react";
import { validateSession } from "@/lib/session";
import { getCategories } from "@/services/category/getCategories";
import { createCategory } from "@/services/category/createCategory";
import { updateCategory } from "@/services/category/updateCategory";
import { deleteCategory } from "@/services/category/deleteCategory";

export const CATEGORY_QUERY_KEY = "categories";

// 1. Fetch Categories Query
export const useFetchCategories = () => {
  const { data: session } = useSession();
  const userId = session?.user?.id;

  return useQuery({
    queryKey: [CATEGORY_QUERY_KEY, userId],
    queryFn: async () => {
      validateSession(session);
      const response = await getCategories(userId!);
      if (!response.success) throw new Error(response.message);
      return response.categories as Category[];
    },
    enabled: !!userId,
    staleTime: 1000 * 60 * 5,
  });
};

// 2. Create Category Mutation
export const useCreateCategory = () => {
  const { data: session } = useSession();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const userId = session?.user?.id;

  return useMutation({
    mutationFn: async (data: z.infer<typeof CategorySchema>) => {
      validateSession(session);
      const response = await createCategory(data, userId!);
      if (!response.success) throw new Error(response.message);
      return response;
    },
    onSuccess: () => {
      toast({
        title: "Activity Type Created",
        description: "Activity Type created successfully",
        duration: 3000,
      });
      queryClient.invalidateQueries({
        queryKey: ["categories", session?.user.id!],
      });
    },
    onError: (error: any) => {
      toast({
        title: "Activity Type Not Created",
        description:
           "An error occurred while creating the Activity Type.",
        duration: 3000,
        variant: "destructive",
      });
    },
  });
};

// 3. Update Category Mutation
export const useUpdateCategory = () => {
  const { data: session } = useSession();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const userId = session?.user?.id;

  return useMutation({
    mutationFn: async (data: Category) => {
      validateSession(session);
      const response = await updateCategory(data);
      if (!response.success) throw new Error(response.message);
      return response;
    },
    onMutate: async (updatedCategory) => {
      await queryClient.cancelQueries({
        queryKey: [CATEGORY_QUERY_KEY, userId],
      });

      const previousCategories = queryClient.getQueryData([
        CATEGORY_QUERY_KEY,
        userId,
      ]);

      queryClient.setQueryData(
        [CATEGORY_QUERY_KEY, userId],
        (old: Category[] | undefined) => {
          if (!old) return [updatedCategory];
          return old.map((category) =>
            category.id === updatedCategory.id ? updatedCategory : category
          );
        }
      );

      return { previousCategories };
    },
    onSuccess: () => {
      toast({
        title: "Activity Type Updated",
        description: "Activity Type updated successfully",
        duration: 3000,
      });
      queryClient.invalidateQueries({ queryKey: [CATEGORY_QUERY_KEY, userId] });
    },
    onError: (error: any, _, context) => {
      queryClient.setQueryData(
        [CATEGORY_QUERY_KEY, userId],
        context?.previousCategories
      );
      toast({
        title: "Activity Type Not Updated",
        description:
           "An error occurred while updating the Activity Type.",
        duration: 3000,
        variant: "destructive",
      });
    },
  });
};

// 4. Delete Category Mutation
export const useDeleteCategory = () => {
  const { data: session } = useSession();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const userId = session?.user?.id;

  return useMutation({
    mutationFn: async (id: string) => {
      validateSession(session);
      const response = await deleteCategory(id);
      if (!response.success) throw new Error(response.message);
      return response;
    },
    onMutate: async (deletedId) => {
      await queryClient.cancelQueries({
        queryKey: [CATEGORY_QUERY_KEY, userId],
      });

      const previousCategories = queryClient.getQueryData([
        CATEGORY_QUERY_KEY,
        userId,
      ]);

      queryClient.setQueryData(
        [CATEGORY_QUERY_KEY, userId],
        (old: Category[] | undefined) => {
          if (!old) return [];
          return old.filter((category) => category.id !== deletedId);
        }
      );

      return { previousCategories };
    },
    onSuccess: () => {
      toast({
        title: "Activity Type Deleted",
        description: "Activity Type deleted successfully",
        duration: 3000,
      });
      queryClient.invalidateQueries({ queryKey: [CATEGORY_QUERY_KEY, userId] });
    },
    onError: (error: any, _, context) => {
      queryClient.setQueryData(
        [CATEGORY_QUERY_KEY, userId],
        context?.previousCategories
      );
      toast({
        title: "Activity Type Not Deleted",
        description:
           "An error occurred while deleting the Activity Type.",
        duration: 3000,
        variant: "destructive",
      });
    },
  });
};
