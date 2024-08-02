import { TodoContext } from "@/contexts/TodoContext";
import { ToDo } from "@prisma/client";
import { useContext, useState } from "react";
import { Input } from "../ui/input";
import ModalDialog from "../ui/ModalDialog";
import { Button } from "../ui/button";
import { Label } from "../ui/label";

interface TodoEditFormProps {
  initialValues: ToDo;
  triggerButton: JSX.Element;
}

const TodoEditForm = ({
  initialValues,
  triggerButton,
}: TodoEditFormProps) => {
  const [error, setError] = useState<string | null>(null);
  const [newName, setNewName] = useState(initialValues.name);
  const { onUpdateTodo } = useContext(TodoContext);
  const [isOpen, setIsOpen] = useState(false);

  const handleSubmit = async () => {
    setError(null);
    const newTodo = { ...initialValues, name: newName };
    const response = await onUpdateTodo(newTodo);
    if (response.success) {
      setIsOpen(false);
    } else {
      setError(response.message);
    }
  };

  return (
    <ModalDialog
      triggerButton={triggerButton}
      title="Edit ToDo"
      description="If you want to edit date of ToDo you should create new ToDo."
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
          placeholder="Do laundry"
        />
        {error && <p className="text-red-500">{error}</p>}

        <Button variant={"outline"} size={"sm"} onClick={handleSubmit}>
          Save
        </Button>
      </div>
    </ModalDialog>
  );
};

export default TodoEditForm;
