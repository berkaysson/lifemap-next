"use client";

import { ActivityContext } from "@/contexts/ActivityContext";
import { useCallback, useContext, useEffect, useState } from "react";
import ActivityListItem from "./ActivityListItem";
import SelectSort from "../ui/SelectSort";
import { sortArrayOfObjectsByKey } from "@/lib/utils";
import { Activity } from "@prisma/client";

const ActivityList = () => {
  const { activities } = useContext(ActivityContext);
  const [sortedActivities, setSortedActivities] = useState(activities);

  const handleSort = useCallback((sortBy: keyof Activity, direction: 'asc' | 'desc') => {
    const sorted = sortArrayOfObjectsByKey<Activity>(activities, sortBy, direction);
    setSortedActivities(sorted);
  }, [activities]);

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
      <div className="border rounded-sm">
        {sortedActivities.map((activity) => (
          <ActivityListItem key={activity.id} activity={activity} />
        ))}
      </div>
    </div>
  );
};

export default ActivityList;
