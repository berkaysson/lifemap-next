"use client";

import { useContext } from "react";
import { Button } from "../ui/button";
import { ActivityContext } from "@/contexts/ActivityContext";
import { Activity } from "@prisma/client";
import { CategoryContext } from "@/contexts/CategoryContext";
import { formatDate, getRemainingTime, isExpired } from "@/lib/time";
import ActivityEditForm from "./AcitivityEditForm";

const ActivityListItem = ({ activity }: { activity: Activity }) => {
  const { onDeleteActivity } = useContext(ActivityContext);
  const { categories } = useContext(CategoryContext);

  const category = categories.find((c) => c.id === activity.categoryId);

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
        <Button variant={"destructive"} size={"sm"} onClick={handleDelete}>
          Delete
        </Button>
      </div>
    </li>
  );
};

export default ActivityListItem;
