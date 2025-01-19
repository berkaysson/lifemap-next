import { Habit } from "@prisma/client";
import { useEffect, useState } from "react";
import ModalDialog from "../ui/Modals/ModalDialog";
import { Label } from "../ui/Forms/label";
import { Input } from "../ui/Forms/input";
import { Button } from "../ui/Buttons/button";
import ProjectSelect from "../ui/Shared/ProjectSelect";
import { useUpdateHabit } from "@/queries/habitQueries";

interface HabitEditFormProps {
  initialValues: Habit;
  triggerButton: JSX.Element;
}

const HabitEditForm = ({
  initialValues,
  triggerButton,
}: HabitEditFormProps) => {
  const [error, setError] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [newHabit, setNewHabit] = useState<Partial<Habit>>({});

  const { mutateAsync: updateHabit } = useUpdateHabit();

  const handleSubmit = async () => {
    setError(null);

    try {
      const response = await updateHabit({
        id: initialValues.id,
        data: newHabit,
      });
      if (response.success) {
        setIsOpen(false);
      } else {
        setError(response.message);
      }
    } catch (error: any) {
      setError(error.message || "An error occurred while updating the habit.");
    }
  };

  const handleFieldChange = (value: any, field: keyof Habit) => {
    if (initialValues[field] === value) return;
    setNewHabit({ ...newHabit, [field]: value });
  };

  useEffect(() => {
    setNewHabit({});
    setError(null);
  }, [isOpen]);

  return (
    <ModalDialog
      triggerButton={triggerButton}
      title="Edit habit"
      description="If you want to edit category of habit you should create new habit."
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
          placeholder="Doing something"
        />

        <Label>Project</Label>
        <ProjectSelect
          defaultValue={initialValues.projectId || ""}
          onSelect={(projectId) => handleFieldChange(projectId, "projectId")}
        />

        {error && <p className="text-red-500">{error}</p>}

        <Button variant={"outline"} size={"sm"} onClick={handleSubmit}>
          Save
        </Button>
      </div>
    </ModalDialog>
  );
};

export default HabitEditForm;
