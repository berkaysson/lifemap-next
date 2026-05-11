"use client";

import { useUpdateCategory } from "@/queries/categoryQueries";
import { Category } from "@prisma/client";
import { JSX, useEffect, useState } from "react";
import { Input } from "../ui/Forms/input";
import ModalDialog from "../ui/Modals/ModalDialog";
import { Label } from "../ui/Forms/label";
import { LoadingButton } from "../ui/Buttons/loading-button";

interface CategoryEditFormProps {
  initialValues: Category;
  triggerButton: JSX.Element;
}

const CategoryEditForm = ({
  initialValues,
  triggerButton,
}: CategoryEditFormProps) => {
  const [error, setError] = useState<string | null>(null);
  const [newName, setNewName] = useState(initialValues.name);
  const [isActive, setIsActive] = useState(initialValues.isActive);
  const { mutateAsync: updateCategory } = useUpdateCategory();
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    setIsLoading(true);
    setError(null);
    const newCategory = { ...initialValues, name: newName, isActive: isActive };
    try {
      const response = await updateCategory(newCategory);
      if (response.success) {
        setIsOpen(false);
      } else {
        setError(response.message);
      }
    } catch (error: any) {
      setError("An error occurred while updating the activity type.");
    }
    setIsLoading(false);
  };

  useEffect(() => {
    setNewName(initialValues.name);
    setIsActive(initialValues.isActive);
    setError(null);
  }, [initialValues, isOpen]);

  return (
    <ModalDialog
      triggerButton={triggerButton}
      title="Edit activity type"
      isOpen={isOpen}
      setIsOpen={setIsOpen}
    >
      <div className="flex flex-col gap-2">
        <Label>Name</Label>
        <Input
          type="text"
          value={newName}
          onChange={(e) => {
            setNewName(e.target.value);
          }}
          min={1}
          placeholder="Learning to code"
          maxLength={50}
        />

        <div className="flex items-center gap-2 mt-2">
          <input
            type="checkbox"
            id={`is-active-${initialValues.id}`}
            checked={isActive}
            onChange={(e) => setIsActive(e.target.checked)}
            className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary"
          />
          <Label htmlFor={`is-active-${initialValues.id}`} className="cursor-pointer">
            Active
          </Label>
        </div>
        {error && <p className="text-red-500">{error}</p>}

        <LoadingButton
          isLoading={isLoading}
          disabled={isLoading}
          loadingText="Saving..."
          variant={"outline"}
          size={"sm"}
          onClick={handleSubmit}
        >
          Save
        </LoadingButton>
      </div>
    </ModalDialog>
  );
};

export default CategoryEditForm;
