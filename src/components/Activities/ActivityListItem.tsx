"use client";

import { useContext } from "react";
import { Button } from "../ui/button";
import { ActivityContext } from "@/contexts/ActivityContext";
import { Activity, Category } from "@prisma/client";
import { formatDate, getRemainingTime, isExpired } from "@/lib/time";
import ActivityEditForm from "./AcitivityEditForm";
import ButtonWithConfirmation from "../ui/ButtonWithConfirmation";

const ActivityListItem = ({
  activity,
}: {
  activity: Activity & { category: Category };
}) => {
  const { onDeleteActivity } = useContext(ActivityContext);
  const category = activity.category;

  const expired = isExpired(activity.date);
  const remained = getRemainingTime(activity.date);

  const handleDelete = async () => {
    await onDeleteActivity(activity.id);
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
