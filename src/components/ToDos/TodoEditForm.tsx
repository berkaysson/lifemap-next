import { TodoContext } from "@/contexts/TodoContext";
import { ToDo } from "@prisma/client";
import { useContext, useEffect, useState } from "react";
import { Input } from "../ui/input";
import ModalDialog from "../ui/ModalDialog";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import ProjectSelect from "../ui/ProjectSelect";

interface TodoEditFormProps {
  initialValues: ToDo;
  triggerButton: JSX.Element;
}

const TodoEditForm = ({ initialValues, triggerButton }: TodoEditFormProps) => {
  const [error, setError] = useState<string | null>(null);
  const [newName, setNewName] = useState(initialValues.name);
  const [newDescription, setNewDescription] = useState(
    initialValues.description
  );
  const [projectId, setProjectId] = useState(initialValues.projectId);

  const { onUpdateTodo } = useContext(TodoContext);
  const [isOpen, setIsOpen] = useState(false);

  const handleSubmit = async () => {
    setError(null);
    const newTodo = {
      ...initialValues,
      name: newName,
      description: newDescription,
      projectId: projectId,
    };
    const response = await onUpdateTodo(newTodo);
    if (response.success) {
      setIsOpen(false);
    } else {
      setError(response.message);
    }
  };

  useEffect(() => {
    setNewName(initialValues.name);
    setNewDescription(initialValues.description);
    setError(null);
  }, [isOpen]);

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
        <Label>Description</Label>
        <Input
          type="text"
          value={newDescription || ""}
          onChange={(e) => {
            setNewDescription(e.target.value);
          }}
          min={1}
          placeholder="Describe the ToDo"
        />

        <Label>Project</Label>
        <ProjectSelect defaultValue={projectId || ""} onSelect={setProjectId} />

        {error && <p className="text-red-500">{error}</p>}

        <Button variant={"outline"} size={"sm"} onClick={handleSubmit}>
          Save
        </Button>
      </div>
    </ModalDialog>
  );
};

export default TodoEditForm;
