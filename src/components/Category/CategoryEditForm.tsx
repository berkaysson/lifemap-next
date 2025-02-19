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
  const { mutateAsync: updateCategory } = useUpdateCategory();
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    setIsLoading(true);
    setError(null);
    const newCategory = { ...initialValues, name: newName };
    try {
      const response = await updateCategory(newCategory);
      if (response.success) {
        setIsOpen(false);
      } else {
        setError(response.message);
      }
    } catch (error: any) {
      setError(
         "An error occurred while updating the category."
      );
    }
    setIsLoading(false);
  };

  useEffect(() => {
    setNewName(initialValues.name);
    setError(null);
  }, [initialValues, isOpen]);

  return (
    <ModalDialog
      triggerButton={triggerButton}
      title="Edit category"
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
        />
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
