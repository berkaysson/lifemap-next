import { HabitContext } from "@/contexts/HabitContext";
import { Habit } from "@prisma/client";
import { useContext, useEffect, useState } from "react";
import ModalDialog from "../ui/ModalDialog";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { parseDate } from "@/lib/time";
import { Button } from "../ui/button";

interface HabitEditFormProps {
  initialValues: Habit;
  triggerButton: JSX.Element;
}

const HabitEditForm = ({ initialValues, triggerButton }: HabitEditFormProps) => {
  const [error, setError] = useState<string | null>(null);
  const { onUpdateHabit } = useContext(HabitContext);
  const [isOpen, setIsOpen] = useState(false);
  const [newHabit, setNewHabit] = useState<Partial<Habit>>({});

  const handleSubmit = async () => {
    setError(null);

    const response = await onUpdateHabit(initialValues.id, newHabit);
    if (response.success) {
      setIsOpen(false);
    } else {
      setError(response.message);
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

        {error && <p className="text-red-500">{error}</p>}

        <Button variant={"outline"} size={"sm"} onClick={handleSubmit}>
          Save
        </Button>
      </div>
    </ModalDialog>
  );
};

export default HabitEditForm;
