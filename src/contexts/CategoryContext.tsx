import { useToast } from "@/components/ui/use-toast";
import { CategorySchema } from "@/schema";
import {
  createCategory,
  deleteCategory,
  getCategories,
  updateCategory,
} from "@/services/categoryService";
import { ServiceResponse } from "@/types/ServiceResponse";
import { Category } from "@prisma/client";
import { useSession } from "next-auth/react";
import { createContext, ReactNode, useEffect, useMemo, useState } from "react";
import { z } from "zod";

interface CategoryContextValue {
  categories: Category[];
  fetchCategories: () => Promise<ServiceResponse>;
  onCreateCategory: (
    data: z.infer<typeof CategorySchema>
  ) => Promise<ServiceResponse>;
  onUpdateCategory: (data: Category) => Promise<ServiceResponse>;
  onDeleteCategory: (id: string) => Promise<ServiceResponse>;
}

const initialCategoryContextValue: CategoryContextValue = {
  categories: [],
  fetchCategories: async () => {
    return {
      message: "",
      success: false,
    };
  },
  onCreateCategory: async (data: z.infer<typeof CategorySchema>) => {
    return {
      message: "",
      success: false,
    };
  },
  onUpdateCategory: async (data: Category) => {
    return {
      message: "",
      success: false,
    };
  },
  onDeleteCategory: async (id: string) => {
    return {
      message: "",
      success: false,
    };
  },
};

export const CategoryContext = createContext<CategoryContextValue>(
  initialCategoryContextValue
);

export const CategoryProvider = ({ children }: { children: ReactNode }) => {
  // Context should be inside of SessionProvider
  const { data: session, status } = useSession();
  const [categories, setCategories] = useState<Category[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    if (!session || !session.user || status !== "authenticated") return;
    fetchCategories();
  }, [session, status]);

  const fetchCategories = async () => {
    if (!session || !session.user)
      return { message: "Session not exist", success: false };
    if (!session.user.id) return { message: "User not exist", success: false };
    const response = await getCategories(session.user.id);

    if (response.success && response.categories) {
      setCategories(response.categories);
    }

    return {
      message: response.message,
      success: response.success,
    };
  };

  const onCreateCategory = async (data: z.infer<typeof CategorySchema>) => {
    if (!session || !session.user)
      return {
        message: "Session not exist",
        success: false,
      };

    if (!session.user.id) return { message: "User not exist", success: false };
    const response = await createCategory(data, session.user.id);
    if (response.success) {
      toast({
        title: "Category Created",
        description: "Category Created successfully",
        duration: 3000,
      });
      await fetchCategories();
      return response;
    }

    return response;
  };

  const onUpdateCategory = async (data: Category) => {
    if (!session || !session.user)
      return {
        message: "Session not exist",
        success: false,
      };
    const response = await updateCategory(data);
    if (response.success) {
      toast({
        title: "Category Updated",
        description: "Category Updated successfully",
        duration: 3000,
      });
      await fetchCategories();
    }

    return response;
  };

  const onDeleteCategory = async (id: string) => {
    if (!session || !session.user || !id)
      return {
        message: "Session not exist",
        success: false,
      };
    try {
      const response = await deleteCategory(id);
      if (response.success) {
        toast({
          title: "Category Deleted",
          description: "Category Deleted successfully",
          duration: 3000,
        });
        await fetchCategories();
      }

      return response;
    } catch (error) {
      return {
        message: `${error}`,
        success: false,
      };
    }
  };

  const contextValue = useMemo(
    () => ({
      categories,
      fetchCategories,
      onCreateCategory,
      onUpdateCategory,
      onDeleteCategory,
    }),
    [categories, session]
  );

  return (
    <CategoryContext.Provider value={contextValue}>
      {children}
    </CategoryContext.Provider>
  );
};
