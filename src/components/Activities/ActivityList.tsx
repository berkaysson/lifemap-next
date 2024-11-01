"use client";

import { useCallback, useEffect, useState } from "react";
import ActivityListItem from "./ActivityListItem";
import SelectSort from "../ui/SelectSort";
import { sortArrayOfObjectsByKey } from "@/lib/utils";
import { Activity } from "@prisma/client";
import { ExtendedActivity } from "@/types/Entitities";
import { useFetchActivities } from "@/queries/activityQueries";

const ActivityList = () => {
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
      <SelectSort
        options={[
          { value: "date", label: "Date" },
          { value: "duration", label: "Duration" },
          { value: "categoryId", label: "Category" },
        ]}
        onSelect={handleSort}
      />
      {isLoading && <div>Loading activities...</div>}
      {isError && <div>Error loading activities: {error.message}</div>}
      <ul className="border rounded-sm">
        {sortedActivities.map((activity) => (
          <ActivityListItem key={activity.id} activity={activity} />
        ))}
      </ul>
    </div>
  );
};

export default ActivityList;
