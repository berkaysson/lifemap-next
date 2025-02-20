import { Activity } from "@prisma/client";
import { JSX, useEffect, useState } from "react";
import { Input } from "../ui/Forms/input";
import { LoadingButton } from "../ui/Buttons/loading-button";
import { Label } from "../ui/Forms/label";
import { useUpdateActivity } from "@/queries/activityQueries";
import ModalDialog from "../ui/Modals/ModalDialog";

interface ActivityEditFormProps {
  initialValues: Activity;
  triggerButton: JSX.Element;
}

const ActivityEditForm = ({
  initialValues,
  triggerButton,
}: ActivityEditFormProps) => {
  const [error, setError] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [newDuration, setNewDuration] = useState(initialValues.duration);
  const [newDescription, setNewDescription] = useState(
    initialValues.description || ""
  );
  const [isLoading, setIsLoading] = useState(false);

  const { mutateAsync: updateActivity } = useUpdateActivity();

  const handleSubmit = async () => {
    if (newDuration === 0) {
      setError("Duration must be greater than 0");
      return;
    };
    setError(null);
    setIsLoading(true);
    const newActivity = {
      ...initialValues,
      duration: newDuration,
      description: newDescription,
    };
    const response = await updateActivity(newActivity);
    setIsLoading(false);
    if (response.success) {
      setIsOpen(false);
    } else {
      setError(response.message);
    }
  };

  useEffect(() => {
    setNewDuration(initialValues.duration);
    setNewDescription(initialValues.description || "");
    setError(null);
  }, [initialValues.description, initialValues.duration, isOpen]);

  return (
    <ModalDialog
      triggerButton={triggerButton}
      title="Edit your acitivity"
      description="If you want to edit category or date of activity you should create new activity."
      isOpen={isOpen}
      setIsOpen={setIsOpen}
    >
      <div className="flex flex-col gap-2">
        <Label>Description</Label>
        <Input
          type="text"
          value={newDescription}
          onChange={(e) => {
            setNewDescription(e.target.value);
          }}
          min={""}
          maxLength={70}
          placeholder="Describe the activity"
        />

        <Label>Duration in minutes</Label>
        <Input
          type="number"
          value={newDuration === 0 ? "" : newDuration}
          onChange={(e) => {
            setNewDuration(e.target.value === "" ? 0 : Number(e.target.value));
          }}
          min={1}
          max={5000}
          placeholder="Your activity duration in minutes"
        />

        {error && <p className="text-red-500">{error}</p>}

        <LoadingButton
          variant={"outline"}
          size={"sm"}
          onClick={handleSubmit}
          isLoading={isLoading}
          disabled={isLoading}
          loadingText="Saving..."
        >
          Save
        </LoadingButton>
      </div>
    </ModalDialog>
  );
};

export default ActivityEditForm;
