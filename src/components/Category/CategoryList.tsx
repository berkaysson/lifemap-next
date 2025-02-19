"use client";

import { useCallback, useEffect, useState } from "react";
import { Category } from "@prisma/client";
import { sortArrayOfObjectsByKey } from "@/lib/utils";
import SelectSort from "../ui/Shared/SelectSort";
import { useFetchCategories } from "@/queries/categoryQueries";
import CategoryTable from "./CategoryTable";
import Loading from "@/app/(protected)/dashboard/category/loading";

const CategoryList = () => {
  const { data: categories, isLoading, isError, error } = useFetchCategories();
  const [sortedCategories, setSortedCategories] = useState<Category[]>(
    categories || []
  );

  useEffect(() => {
    if (categories && categories.length > 0) {
      const sorted = sortArrayOfObjectsByKey<Category>(
        categories,
        "date",
        "asc"
      );
      setSortedCategories(sorted);
    }
  }, [categories]);

  const handleSort = useCallback(
    (sortBy: keyof Category, direction: "asc" | "desc") => {
      if (!categories || categories.length === 0) return;
      const sorted = sortArrayOfObjectsByKey<Category>(
        categories,
        sortBy,
        direction
      );
      setSortedCategories(sorted);
    },
    [categories]
  );

  
  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className="flex flex-col gap-4 m-2 mt-4">
      <SelectSort
        options={[
          { value: "name", label: "Name" },
          { value: "date", label: "Creation Date" },
        ]}
        onSelect={handleSort}
      />

      {isError && <div>Error loading categories: {error.message}</div>}
      {sortedCategories.length === 0 && !isLoading && (
        <div className="opacity-80 mt-2">No categories found.</div>
      )}

      <CategoryTable sortedCategories={sortedCategories} />
    </div>
  );
};

export default CategoryList;
