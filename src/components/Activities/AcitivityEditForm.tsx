import { ActivityContext } from "@/contexts/ActivityContext";
import { Activity } from "@prisma/client";
import { useContext, useState } from "react";
import { Input } from "../ui/input";
import ModalDialog from "../ui/ModalDialog";
import { Button } from "../ui/button";
import { Label } from "../ui/label";

interface ActivityEditFormProps {
  initialValues: Activity;
  triggerButton: JSX.Element;
}

const ActivityEditForm = ({
  initialValues,
  triggerButton,
}: ActivityEditFormProps) => {
  const [error, setError] = useState<string | null>(null);
  const { onUpdateActivity } = useContext(ActivityContext);
  const [isOpen, setIsOpen] = useState(false);
  const [newDuration, setNewDuration] = useState(initialValues.duration);
  const [newDescription, setNewDescription] = useState(
    initialValues.description || ""
  );

  const handleSubmit = async () => {
    setError(null);
    const newActivity = {
      ...initialValues,
      duration: newDuration,
      description: newDescription,
    };
    const response = await onUpdateActivity(newActivity);
    if (response.success) {
      setIsOpen(false);
    } else {
      setError(response.message);
    }
  };

  return (
    <ModalDialog
      triggerButton={triggerButton}
      title="Edit your acitivity"
      description="If you want to edit category or date of activity you should create new activity."
      isOpen={isOpen}
      setIsOpen={setIsOpen}
    >
      <div className="flex flex-col gap-2">
        <Label>Duration (min)</Label>
        <Input
          type="number"
          value={newDuration}
          onChange={(e) => {
            setNewDuration(Number(e.target.value));
          }}
          min={1}
        />

        <Label>Description</Label>
        <Input
          type="text"
          value={newDescription}
          onChange={(e) => {
            setNewDescription(e.target.value);
          }}
          min={""}
        />

        {error && <p className="text-red-500">{error}</p>}

        <Button variant={"outline"} size={"sm"} onClick={handleSubmit}>
          Save
        </Button>
      </div>
    </ModalDialog>
  );
};

export default ActivityEditForm;
