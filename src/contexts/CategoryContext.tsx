import {
  createCategory,
  deleteCategory,
  getCategories,
  updateCategory,
} from "@/services/categoryService";
import { Category } from "@prisma/client";
import { useSession } from "next-auth/react";
import { createContext, ReactNode, useEffect, useMemo, useState } from "react";

interface CategoryContextValue {
  categories: Category[];
  fetchCategories: () => Promise<void>;
  onCreateCategory: (data: Category) => Promise<void>;
  onUpdateCategory: (data: Category) => Promise<void>;
  onDeleteCategory: (id: string) => Promise<void>;
}

const initialCategoryContextValue: CategoryContextValue = {
  categories: [],
  fetchCategories: async () => {},
  onCreateCategory: async (data: Category) => {},
  onUpdateCategory: async (data: Category) => {},
  onDeleteCategory: async (id: string) => {},
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
    if (!session || !session.user) return;
    if (!session.user.id) return;
    const categories = await getCategories(session.user.id);
    setCategories(categories);
  };

  const onCreateCategory = async (data: Category) => {
    if (!session || !session.user) return;
    const newCategory = await createCategory(data);
    if (newCategory) {
      await fetchCategories();
    }
  };

  const onUpdateCategory = async (data: Category) => {
    if (!session || !session.user) return;
    const newCategory = await updateCategory(data);
    if (newCategory) {
      await fetchCategories();
    }
  };

  const onDeleteCategory = async (id: string) => {
    if (!session || !session.user || !id) return;
    try {
      await deleteCategory(id);
      await fetchCategories();
    } catch (error) {
      console.error(`Failed to delete Category with id ${id}: ${error}`);
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
