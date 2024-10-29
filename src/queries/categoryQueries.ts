import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/components/ui/use-toast";
import { CategorySchema } from "@/schema";
import {
  createCategory,
  deleteCategory,
  getCategories,
  updateCategory,
} from "@/services/categoryService";
import { Category } from "@prisma/client";
import { z } from "zod";
import { useSession } from "next-auth/react";
import { validateSession } from "@/lib/session";

// 1. Fetch Categories Query
export const useFetchCategories = () => {
  const { data: session } = useSession();

  return useQuery({
    queryKey: ["categories", session?.user?.id],
    queryFn: async () => {
      validateSession(session);
      const response = await getCategories(session?.user.id!);
      if (!response.success) throw new Error(response.message);
      return response.categories as Category[];
    },
    enabled: !!session?.user?.id,
    staleTime: 1000 * 60 * 5,
  });
};

// 2. Create Category Mutation
export const useCreateCategory = () => {
  const { data: session } = useSession();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (data: z.infer<typeof CategorySchema>) => {
      validateSession(session);
      const response = await createCategory(data, session?.user.id!);
      if (!response.success) throw new Error(response.message);
      return response;
    },
    onSuccess: () => {
      toast({
        title: "Category Created",
        description: "Category created successfully",
        duration: 3000,
      });
      queryClient.invalidateQueries({
        queryKey: ["categories", session?.user.id!],
      });
    },
    onError: (error: any) => {
      toast({
        title: "Category Not Created",
        description:
          error.message || "An error occurred while creating the category.",
        duration: 3000,
        variant: "destructive",
      });
    },
  });
};

// 3. Update Category Mutation
export const useUpdateCategory = () => {
  const { data: session } = useSession();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: Category) => {
      validateSession(session);
      const response = await updateCategory(data);
      if (!response.success) throw new Error(response.message);
      return response;
    },
    onSuccess: () => {
      toast({
        title: "Category Updated",
        description: "Category updated successfully",
        duration: 3000,
      });
      queryClient.invalidateQueries({
        queryKey: ["categories"],
      });
    },
    onError: (error: any) => {
      toast({
        title: "Category Not Updated",
        description:
          error.message || "An error occurred while updating the category.",
        duration: 3000,
        variant: "destructive",
      });
    },
  });
};

// 4. Delete Category Mutation
export const useDeleteCategory = () => {
  const { data: session } = useSession();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      validateSession(session);
      const response = await deleteCategory(id);
      if (!response.success) throw new Error(response.message);
      return response;
    },
    onSuccess: () => {
      toast({
        title: "Category Deleted",
        description: "Category deleted successfully",
        duration: 3000,
      });
      queryClient.invalidateQueries({
        queryKey: ["categories"],
      });
    },
    onError: (error: any) => {
      toast({
        title: "Category Not Deleted",
        description:
          error.message || "An error occurred while deleting the category.",
        duration: 3000,
        variant: "destructive",
      });
    },
  });
};
