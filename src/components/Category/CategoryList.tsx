"use client";

import { CategoryContext } from "@/contexts/CategoryContext";
import { useCallback, useContext, useState } from "react";
import CategoryListItem from "./CategoryListItem";
import { Category } from "@prisma/client";
import { sortArrayOfObjectsByKey } from "@/lib/utils";
import SelectSort from "../ui/SelectSort";

const CategoryList = () => {
  const { categories } = useContext(CategoryContext);
  const [sortedCategories, setSortedCategories] = useState(categories);

  const handleSort = useCallback(
    (sortBy: keyof Category, direction: "asc" | "desc") => {
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
          { value: "createdAt", label: "Creation Date" },
        ]}
        onSelect={handleSort}
      />
      <div className="border rounded-sm">
        {sortedCategories.map((category) => (
          <CategoryListItem key={category.id} category={category} />
        ))}
      </div>
    </div>
  );
};

export default CategoryList;
