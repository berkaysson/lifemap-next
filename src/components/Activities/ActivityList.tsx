"use client";

import { useCallback, useEffect, useState } from "react";
import ActivityListItem from "./ActivityListItem";
import SelectSort from "../ui/Shared/SelectSort";
import { sortArrayOfObjectsByKey } from "@/lib/utils";
import { Activity } from "@prisma/client";
import { ExtendedActivity } from "@/types/Entitities";
import { useFetchActivities } from "@/queries/activityQueries";
import ActivityTable from "./ActivityTable";
import { IconButton } from "@mui/material";
import ListViewToggle from "../ui/Buttons/list-view-toggle";

const ActivityList = () => {
  const [viewMode, setViewMode] = useState<"table" | "grid">("table");
  const { data: activities, isLoading, isError, error } = useFetchActivities();
  const [sortedActivities, setSortedActivities] = useState(activities || []);

  useEffect(() => {
    if (activities) {
      setSortedActivities(activities);
    }
  }, [activities]);

  const handleSort = useCallback(
    (sortBy: keyof Activity, direction: "asc" | "desc") => {
      if (!activities) return;
      const sorted = sortArrayOfObjectsByKey<ExtendedActivity>(
        activities,
        sortBy,
        direction
      );
      setSortedActivities(sorted);
    },
    [activities]
  );

  return (
    <div className="flex flex-col gap-2 m-2">
      <div className="flex flex-row justify-between">
        <SelectSort
          options={[
            { value: "date", label: "Date" },
            { value: "duration", label: "Duration" },
            { value: "categoryId", label: "Category" },
          ]}
          onSelect={handleSort}
        />
        <div>
          <ListViewToggle
            currentView={viewMode}
            onSelect={(view) => setViewMode(view)}
          />
        </div>
      </div>

      {isLoading && <div>Loading activities...</div>}
      {isError && <div>Error loading activities: {error.message}</div>}

      {viewMode === "grid" && (
        <ul className="border rounded-sm">
          {sortedActivities.map((activity) => (
            <ActivityListItem key={activity.id} activity={activity} />
          ))}
        </ul>
      )}

      {viewMode === "table" && (
        <ActivityTable sortedActivities={sortedActivities} />
      )}
    </div>
  );
};

export default ActivityList;
