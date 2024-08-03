import { CategoryContext } from "@/contexts/CategoryContext";
import { Category } from "@prisma/client";
import { useContext, useEffect, useState } from "react";
import { Input } from "../ui/input";
import ModalDialog from "../ui/ModalDialog";
import { Button } from "../ui/button";
import { Label } from "../ui/label";

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
  const { onUpdateCategory } = useContext(CategoryContext);
  const [isOpen, setIsOpen] = useState(false);

  const handleSubmit = async () => {
    setError(null);
    const newCategory = { ...initialValues, name: newName };
    const response = await onUpdateCategory(newCategory);
    if (response.success) {
      setIsOpen(false);
    } else {
      setError(response.message);
    }
  };

  useEffect(() => {
    setNewName(initialValues.name);
    setError(null);
  }, [isOpen]);

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

        <Button variant={"outline"} size={"sm"} onClick={handleSubmit}>
          Save
        </Button>
      </div>
    </ModalDialog>
  );
};

export default CategoryEditForm;
