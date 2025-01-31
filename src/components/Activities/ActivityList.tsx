"use client";

import { useCallback, useEffect, useState } from "react";
import ActivityListItem from "./ActivityListItem";
import SelectSort from "../ui/Shared/SelectSort";
import { sortArrayOfObjectsByKey } from "@/lib/utils";
import { Activity } from "@prisma/client";
import { ExtendedActivity } from "@/types/Entitities";
import { useFetchActivities } from "@/queries/activityQueries";
import ActivityTable from "./ActivityTable";
import ListViewToggle from "../ui/Buttons/list-view-toggle";

const ActivityList = () => {
  const [viewMode, setViewMode] = useState<"table" | "grid">("table");
  const { data: activities, isLoading, isError, error } = useFetchActivities();
  const [sortedActivities, setSortedActivities] = useState(activities || []);

  useEffect(() => {
    if (activities && activities.length > 0) {
      const sorted = sortArrayOfObjectsByKey<ExtendedActivity>(
        activities,
        "date",
        "desc"
      );
      setSortedActivities(sorted);
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
      <div className="flex sm:flex-row justify-between flex-col-reverse gap-2">
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
      {sortedActivities.length === 0 && !isLoading && (
        <div className="opacity-80 mt-2">No activities found.</div>
      )}

      {viewMode === "grid" && (
        <ul className="rounded-sm grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
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
