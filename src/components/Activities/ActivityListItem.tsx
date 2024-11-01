"use client";

import { Button } from "../ui/button";
import { formatDate, getRemainingTime, isExpired } from "@/lib/time";
import ActivityEditForm from "./AcitivityEditForm";
import ButtonWithConfirmation from "../ui/ButtonWithConfirmation";
import { ExtendedActivity } from "@/types/Entitities";
import { useDeleteActivity } from "@/queries/activityQueries";

const ActivityListItem = ({
  activity,
}: {
  activity: ExtendedActivity;
}) => {
  const { mutateAsync: deleteActivity } = useDeleteActivity();

  const category = activity.category;

  const expired = isExpired(activity.date);
  const remained = getRemainingTime(activity.date);

  const handleDelete = async () => {
    await deleteActivity(activity.id);
  };

  return (
    <li className="flex flex-col gap-2 p-4 border-b">
      <div className="flex flex-row gap-2">
        <span>{activity.duration}</span>
        <span>{activity.description}</span>
        <span>{category?.name}</span>
      </div>
      <div>
        <span>
          {formatDate(activity.date)} / {remained} {expired ? "" : "remaining"}
        </span>
      </div>
      <div className="flex flex-row gap-2">
        <ActivityEditForm
          initialValues={activity}
          triggerButton={
            <Button variant={"outline"} size={"sm"}>
              Edit
            </Button>
          }
        />
        <ButtonWithConfirmation
          variant="destructive"
          size={"sm"}
          buttonText={"Delete"}
          onConfirm={handleDelete}
        />
      </div>
    </li>
  );
};

export default ActivityListItem;
