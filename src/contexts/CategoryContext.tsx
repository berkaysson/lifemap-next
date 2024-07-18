import {
  createCategory,
  deleteCategory,
  getCategories,
  updateCategory,
} from "@/services/categoryService";
import { Category } from "@prisma/client";
import { useSession } from "next-auth/react";
import { createContext, ReactNode, useEffect, useMemo, useState } from "react";

interface ResponseValue {
  message: string;
  success: boolean;
}

interface CategoryContextValue {
  categories: Category[];
  fetchCategories: () => Promise<ResponseValue>;
  onCreateCategory: (data: Category) => Promise<ResponseValue>;
  onUpdateCategory: (data: Category) => Promise<ResponseValue>;
  onDeleteCategory: (id: string) => Promise<ResponseValue>;
}

const initialCategoryContextValue: CategoryContextValue = {
  categories: [],
  fetchCategories: async () => {
    return {
      message: "",
      success: false,
    };
  },
  onCreateCategory: async (data: Category) => {
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
      setCategories(categories);
    }

    return {
      message: response.message,
      success: response.success,
    };
  };

  const onCreateCategory = async (data: Category) => {
    if (!session || !session.user)
      return {
        message: "Session not exist",
        success: false,
      };
    const response = await createCategory(data);
    if (response.success) {
      await fetchCategories();
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
