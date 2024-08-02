"use client";

import { useContext } from "react";
import { Button } from "../ui/button";
import { CategoryContext } from "@/contexts/CategoryContext";
import CategoryEditForm from "./CategoryEditForm";
import ButtonWithConfirmation from "../ui/ButtonWithConfirmation";

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
        <ButtonWithConfirmation
          variant="destructive"
          size={"sm"}
          buttonText={"Delete"}
          onConfirm={handleDelete}
        />
      </div>
    </li>
  );
};

export default CategoryListItem;
