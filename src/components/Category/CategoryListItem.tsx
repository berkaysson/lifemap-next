"use client";

import { useContext, useState } from "react";
import { Button } from "../ui/button";
import { CategoryContext } from "@/contexts/CategoryContext";
import { Input } from "../ui/input";

const CategoryListItem = ({
  category,
}: {
  category: {
    id: string;
    name: string;
    userId: string;
  };
}) => {
  const { onDeleteCategory, onUpdateCategory } = useContext(CategoryContext);
  const [isEditing, setIsEditing] = useState(false);
  const [newName, setNewName] = useState(category.name);

  const handleDelete = async () => {
    await onDeleteCategory(category.id);
  };

  const handleEdit = async () => {
    category.name = newName;
    await onUpdateCategory(category);
    setIsEditing(false);
  };

  return (
    <li className="flex flex-col gap-2 p-4 border-b">
      <div className="flex flex-row gap-2">
        {isEditing ? (
          <Input
            type="text"
            value={newName}
            onChange={(e) => {
              setNewName(e.target.value);
            }}
            min={1}
          />
        ) : (
          <span>{category.name}</span>
        )}
      </div>
      <div className="flex flex-row gap-2">
        {isEditing ? (
          <Button variant={"outline"} size={"sm"} onClick={handleEdit}>
            Save
          </Button>
        ) : (
          <Button
            variant={"outline"}
            size={"sm"}
            onClick={() => setIsEditing(true)}
          >
            Edit
          </Button>
        )}

        <Button variant={"destructive"} size={"sm"} onClick={handleDelete}>
          Delete
        </Button>
      </div>
    </li>
  );
};

export default CategoryListItem;
