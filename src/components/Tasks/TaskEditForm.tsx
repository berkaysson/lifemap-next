import { Task } from "@prisma/client";
import { JSX, useEffect, useState } from "react";
import ModalDialog from "../ui/Modals/ModalDialog";
import { Label } from "../ui/Forms/label";
import { Input } from "../ui/Forms/input";
import ProjectSelect from "../ui/Shared/ProjectSelect";
import { useUpdateTask } from "@/queries/taskQueries";
import { LoadingButton } from "../ui/Buttons/loading-button";
import { DatePicker } from "../ui/Forms/date-picker-field";

interface TaskEditFormProps {
  initialValues: Task;
  triggerButton: JSX.Element;
}

const TaskEditForm = ({ initialValues, triggerButton }: TaskEditFormProps) => {
  const [error, setError] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [newTask, setNewTask] = useState<Partial<Task>>({});
  const [isLoading, setIsLoading] = useState(false);

  const { mutateAsync: updateTask } = useUpdateTask();

  const handleSubmit = async () => {
    setError(null);
    setIsLoading(true);

    try {
      const response = await updateTask({
        id: initialValues.id,
        data: newTask,
      });
      if (response.success) {
        setIsOpen(false);
      } else {
        setError(response.message);
      }
    } catch (error: any) {
      setError("An error occurred while updating the task.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleFieldChange = (value: any, field: keyof Task) => {
    if (initialValues[field] === value) return;
    setNewTask({ ...newTask, [field]: value });
  };

  const handleStartDateChange = (date: Date | undefined) => {
    if (initialValues.startDate === date) return;
    setNewTask({ ...newTask, startDate: date });
  };

  const handleEndDateChange = (date: Date | undefined) => {
    if (initialValues.endDate === date) return;
    setNewTask({ ...newTask, endDate: date });
  };

  useEffect(() => {
    setNewTask({});
    setError(null);
  }, [isOpen]);

  return (
    <ModalDialog
      triggerButton={triggerButton}
      title="Edit task"
      description="If you want to edit Activity Type of task you should create new task."
      isOpen={isOpen}
      setIsOpen={setIsOpen}
    >
      <div className="flex flex-col gap-2">
        <Label>Name</Label>
        <Input
          type="text"
          defaultValue={initialValues.name}
          onChange={(e) => handleFieldChange(e.target.value, "name")}
          min={3}
          maxLength={50}
          placeholder="Doing something"
        />

        <Label>Description</Label>
        <Input
          type="text"
          defaultValue={initialValues.description || ""}
          onChange={(e) => handleFieldChange(e.target.value, "description")}
          min={3}
          maxLength={70}
          placeholder="Doing something until next month..."
        />

        <Label>Goal Duration (min)</Label>
        <Input
          type="number"
          defaultValue={initialValues.goalDuration}
          onChange={(e) =>
            handleFieldChange(Number(e.target.value), "goalDuration")
          }
          min={1}
          max={12000}
          placeholder="Goal Duration in minutes"
        />

        <Label>Start Date</Label>
        <DatePicker
          date={
            newTask.startDate
              ? new Date(newTask.startDate)
              : initialValues.startDate
              ? new Date(initialValues.startDate)
              : undefined
          }
          onSelect={handleStartDateChange}
        />

        <Label>Due Date</Label>
        <DatePicker
          date={
            newTask.endDate
              ? new Date(newTask.endDate)
              : initialValues.endDate
              ? new Date(initialValues.endDate)
              : undefined
          }
          onSelect={handleEndDateChange}
        />

        <Label>Project</Label>
        <ProjectSelect
          defaultValue={initialValues.projectId || ""}
          onSelect={(projectId) => handleFieldChange(projectId, "projectId")}
        />

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

export default TaskEditForm;
