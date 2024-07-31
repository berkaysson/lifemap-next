"use client";

import { useContext, useState } from "react";
import { Button } from "../ui/button";
import { CategoryContext } from "@/contexts/CategoryContext";
import { Input } from "../ui/input";
import CategoryEditForm from "./CategoryEditForm";

const CategoryListItem = ({
  category,
}: {
  category: {
    id: string;
    name: string;
    userId: string;
  };
}) => {
  const { onDeleteCategory } = useContext(CategoryContext);

  const handleDelete = async () => {
    await onDeleteCategory(category.id);
  };

  return (
    <li className="flex flex-col gap-2 p-4 border-b">
      <div className="flex flex-row gap-2">
        <span>{category.name}</span>
      </div>
      <div className="flex flex-row gap-2">
        <CategoryEditForm
          initialValues={category}
          triggerButton={
            <Button variant={"outline"} size={"sm"}>
              Edit
            </Button>
          }
        />

        <Button variant={"destructive"} size={"sm"} onClick={handleDelete}>
          Delete
        </Button>
      </div>
    </li>
  );
};

export default CategoryListItem;
