"use client";

import { useContext, useState } from "react";
import { Button } from "../ui/button";
import { ActivityContext } from "@/contexts/ActivityContext";
import { Input } from "../ui/input";
import { Activity } from "@prisma/client";
import { CategoryContext } from "@/contexts/CategoryContext";
import { formatDate, getRemainingTime, isExpired } from "@/lib/time";
import { Label } from "../ui/label";

const ActivityListItem = ({ activity }: { activity: Activity }) => {
  const { onDeleteActivity, onUpdateActivity } = useContext(ActivityContext);
  const { categories } = useContext(CategoryContext);
  const [isEditing, setIsEditing] = useState(false);
  const [newDuration, setNewDuration] = useState(activity.duration);
  const [newDescription, setNewDescription] = useState(
    activity.description || ""
  );
  const [error, setError] = useState<string | null>(null);

  const category = categories.find((c) => c.id === activity.categoryId);

  const expired = isExpired(activity.date);
  const remained = getRemainingTime(activity.date);

  const handleDelete = async () => {
    await onDeleteActivity(activity.id);
  };

  const handleEdit = async () => {
    setError(null);
    const newActivity = {
      ...activity,
      duration: newDuration,
      description: newDescription,
    };
    const response = await onUpdateActivity(newActivity);
    if (response.success) {
      setIsEditing(false);
    } else {
      setError(response.message);
    }
  };

  const handleCancelEditing = () => {
    setIsEditing(false);
    setNewDuration(activity.duration);
    setNewDescription(activity.description || "");
    setError(null);
  };

  return (
    <li className="flex flex-col gap-2 p-4 border-b">
      {error && <p className="text-red-500 text-sm">{error}</p>}
      <div className="flex flex-row gap-2">
        {isEditing ? (
          <Label>
            Duration (min)
            <Input
              type="number"
              value={newDuration}
              onChange={(e) => {
                setNewDuration(Number(e.target.value));
              }}
              min={1}
            />
          </Label>
        ) : (
          <span>{activity.duration}</span>
        )}
        {isEditing ? (
          <Label>
            Description
            <Input
              type="text"
              value={newDescription}
              onChange={(e) => {
                setNewDescription(e.target.value);
              }}
              min={""}
            />
          </Label>
        ) : (
          <span>{activity.description}</span>
        )}

        <span>{category?.name}</span>
      </div>
      <div>
        <span>
          {formatDate(activity.date)} / {remained} {expired ? "" : "remaining"}
        </span>
      </div>
      <div className="flex flex-row gap-2">
        {isEditing ? (
          <Button variant={"outline"} size={"sm"} onClick={handleEdit}>
            Save
          </Button>
        ) : (
          <Button
            variant={"outline"}
            size={"sm"}
            onClick={() => setIsEditing(true)}
          >
            Edit
          </Button>
        )}

        {isEditing ? (
          <Button
            variant={"destructive"}
            size={"sm"}
            onClick={handleCancelEditing}
          >
            Cancel
          </Button>
        ) : (
          <Button variant={"destructive"} size={"sm"} onClick={handleDelete}>
            Delete
          </Button>
        )}
      </div>
    </li>
  );
};

export default ActivityListItem;
