"use client";

import { useDeleteCategory } from "@/queries/categoryQueries";
import { Button } from "../ui/Buttons/button";
import CategoryEditForm from "./CategoryEditForm";
import ButtonWithConfirmation from "../ui/Buttons/ButtonWithConfirmation";
import { Category } from "@prisma/client";

const CategoryListItem = ({ category }: { category: Category }) => {
  const { mutateAsync: deleteCategory } = useDeleteCategory();

  const handleDelete = async () => {
    try {
      await deleteCategory(category.id);
    } catch (error) {
      console.error("Delete failed:", error);
    }
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
