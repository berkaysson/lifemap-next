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
import { Badge } from "../ui/badge";
import { Iconify } from "../ui/iconify";

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
                  <span>
                    {activity.description ? (
                      <Tooltip arrow title={activity.description}>
                        <span className="underline">{activity.duration}</span>
                      </Tooltip>
                    ) : (
                      activity.duration
                    )}
                  </span>
                </TableCell>
                <TableCell>
                  <Badge>{activity.category?.name}</Badge>
                </TableCell>
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
                          <Iconify
                            icon="solar:pen-new-square-outline"
                            width={16}
                          />
                        </Button>
                      }
                    />
                    <ButtonWithConfirmation
                      variant="destructive"
                      size="sm"
                      buttonText=""
                      onConfirm={() => handleDelete(activity)}
                      icon="solar:trash-bin-trash-bold"
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
