"use client";

import { CategoryContext } from "@/contexts/CategoryContext";
import { useContext } from "react";
import CategoryListItem from "./CategoryListItem";

const CategoryList = () => {
  const { categories } = useContext(CategoryContext);

  return <div className="flex flex-col gap-2 m-2 border rounded-sm">
    {categories.map(category => <CategoryListItem key={category.id} category={category} />)}
  </div>;
};

export default CategoryList;
