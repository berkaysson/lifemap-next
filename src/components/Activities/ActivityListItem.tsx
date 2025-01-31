"use client";

import { formatDateFriendly } from "@/lib/time";
import { useDeleteActivity } from "@/queries/activityQueries";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Tooltip } from "@mui/material";
import { ExtendedActivity } from "@/types/Entitities";
import ActivityEditForm from "./AcitivityEditForm";
import { Button } from "../ui/Buttons/button";
import ButtonWithConfirmation from "../ui/Buttons/ButtonWithConfirmation";
import { Badge } from "../ui/badge";
import { Iconify } from "../ui/iconify";

const ActivityListItem = ({ activity }: { activity: ExtendedActivity }) => {
  const { mutateAsync: deleteActivity } = useDeleteActivity();

  const handleDelete = async () => {
    await deleteActivity(activity);
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <Badge>
          <h5 className="font-semibold text-lg">{activity.category?.name}</h5>
        </Badge>
      </CardHeader>
      <CardContent>
        <div className="flex items-center space-x-2 text-sm text-muted-foreground mt-1">
          <Iconify icon="solar:stopwatch-bold" width={20} />
          <span>
            {activity.description ? (
              <Tooltip arrow title={activity.description}>
                <span className="underline">{activity.duration}</span>
              </Tooltip>
            ) : (
              activity.duration
            )}
          </span>
        </div>
        <div className="flex items-center space-x-2 mt-2 text-sm text-muted-foreground">
          <Iconify icon="solar:calendar-date-bold" width={20} />
          <span>{formatDateFriendly(activity.date)}</span>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <ActivityEditForm
          initialValues={activity}
          triggerButton={
            <Button variant="outline" size="sm">
              <Iconify
                icon="solar:pen-new-square-bold-duotone"
                width={16}
                className="mr-1"
              />
              Edit
            </Button>
          }
        />
        <ButtonWithConfirmation
          variant="destructive"
          size="sm"
          buttonText="Delete"
          onConfirm={handleDelete}
          icon="solar:trash-bin-trash-bold"
        />
      </CardFooter>
    </Card>
  );
};

export default ActivityListItem;
