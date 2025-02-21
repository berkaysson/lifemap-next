import { ToDo } from "@prisma/client";
import { JSX, useEffect, useState } from "react";
import { Input } from "../ui/Forms/input";
import ModalDialog from "../ui/Modals/ModalDialog";
import { Label } from "../ui/Forms/label";
import ProjectSelect from "../ui/Shared/ProjectSelect";
import { useUpdateTodo } from "@/queries/todoQueries";
import { LoadingButton } from "../ui/Buttons/loading-button";

interface TodoEditFormProps {
  initialValues: ToDo;
  triggerButton: JSX.Element;
}

const TodoEditForm = ({ initialValues, triggerButton }: TodoEditFormProps) => {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [newName, setNewName] = useState(initialValues.name);
  const [newDescription, setNewDescription] = useState(
    initialValues.description
  );
  const [projectId, setProjectId] = useState(initialValues.projectId);

  const { mutateAsync: updateTodo } = useUpdateTodo();
  const [isOpen, setIsOpen] = useState(false);

  const handleSubmit = async () => {
    setError(null);
    setIsLoading(true);
    const newTodo = {
      ...initialValues,
      name: newName,
      description: newDescription,
      projectId: projectId,
    } as ToDo;
    try {
      const response = await updateTodo(newTodo);
      if (response.success) {
        setIsOpen(false);
      } else {
        setError(response.message);
      }
    } catch (error: any) {
      setError(
         "An error occurred while updating the Activity Type."
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    setNewName(initialValues.name);
    setNewDescription(initialValues.description);
    setError(null);
  // eslint-disable-next-line react-hooks/exhaustive-deps
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
          maxLength={50}
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
          maxLength={70}
          placeholder="Describe the ToDo"
        />

        <Label>Project</Label>
        <ProjectSelect defaultValue={projectId || ""} onSelect={setProjectId} />

        {error && <p className="text-red-500">{error}</p>}

        <LoadingButton
          isLoading={isLoading}
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

export default TodoEditForm;
