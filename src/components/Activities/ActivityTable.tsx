"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { ExtendedActivity } from "@/types/Entitities";
import { useDeleteActivity } from "@/queries/activityQueries";
import ButtonWithConfirmation from "@/components/ui/Buttons/ButtonWithConfirmation";
import { formatDate, getRemainingTime, isExpired } from "@/lib/time";
import ActivityEditForm from "./AcitivityEditForm";
import { Button } from "../ui/Buttons/button";
import { Tooltip } from "@mui/material";

const ActivityTable = ({
  sortedActivities,
}: {
  sortedActivities: ExtendedActivity[];
}) => {
  const { mutateAsync: deleteActivity } = useDeleteActivity();

  const handleDelete = async (activity: ExtendedActivity) => {
    await deleteActivity(activity);
  };

  return (
    <div className="space-y-4">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Duration</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedActivities.map((activity) => {
            const expired = isExpired(activity.date);
            const remained = getRemainingTime(activity.date);

            return (
              <TableRow key={activity.id}>
                <TableCell>
                  {activity.description ? (
                    <Tooltip arrow title={activity.description}>
                      <span>{activity.duration}</span>
                    </Tooltip>
                  ) : (
                    activity.duration
                  )}
                </TableCell>
                <TableCell>{activity.category?.name}</TableCell>
                <TableCell>
                  {formatDate(activity.date)} / {remained}{" "}
                  {expired ? "" : "remaining"}
                </TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <ActivityEditForm
                      initialValues={activity}
                      triggerButton={
                        <Button variant="outline" size="sm">
                          Edit
                        </Button>
                      }
                    />
                    <ButtonWithConfirmation
                      variant="destructive"
                      size="sm"
                      buttonText="Delete"
                      onConfirm={() => handleDelete(activity)}
                    />
                  </div>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
};

export default ActivityTable;
