"use client";

import { useCallback, useEffect, useState } from "react";
import CategoryListItem from "./CategoryListItem";
import { Category } from "@prisma/client";
import { sortArrayOfObjectsByKey } from "@/lib/utils";
import SelectSort from "../ui/Shared/SelectSort";
import { useFetchCategories } from "@/queries/categoryQueries";

const CategoryList = () => {
  const { data: categories, isLoading, isError, error } = useFetchCategories();
  const [sortedCategories, setSortedCategories] = useState<Category[]>(
    categories || []
  );

  useEffect(() => {
    if (categories) {
      setSortedCategories(categories);
    }
  }, [categories]);

  const handleSort = useCallback(
    (sortBy: keyof Category, direction: "asc" | "desc") => {
      if (!categories) return;
      const sorted = sortArrayOfObjectsByKey<Category>(
        categories,
        sortBy,
        direction
      );
      setSortedCategories(sorted);
    },
    [categories]
  );

  return (
    <div className="flex flex-col gap-2 m-2">
      <SelectSort
        options={[
          { value: "name", label: "Name" },
          { value: "date", label: "Creation Date" },
        ]}
        onSelect={handleSort}
      />
      {isLoading && <div>Loading categories...</div>}
      {isError && <div>Error loading categories: {error.message}</div>}
      <ul className="border rounded-sm">
        {sortedCategories.map((category) => (
          <CategoryListItem key={category.id} category={category} />
        ))}
      </ul>
    </div>
  );
};

export default CategoryList;
