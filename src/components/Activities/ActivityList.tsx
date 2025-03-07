"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import ActivityListItem from "./ActivityListItem";
import SelectSort from "../ui/Shared/SelectSort";
import { sortArrayOfObjectsByKey } from "@/lib/utils";
import type { Activity } from "@prisma/client";
import type { ExtendedActivity } from "@/types/Entitities";
import { useFetchActivities } from "@/queries/activityQueries";
import ActivityTable from "./ActivityTable";
import ListViewToggle from "../ui/Buttons/list-view-toggle";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "../ui/pagination";
import { Separator } from "../ui/separator";
import Loading from "@/app/(protected)/dashboard/activity/loading";

const ActivityList = () => {
  const [viewMode, setViewMode] = useState<"table" | "grid">("table");
  const [page, setPage] = useState(1);
  const pageSize = 10;

  const { data, isLoading, isError, error } = useFetchActivities(
    page,
    pageSize
  );

  const activities = useMemo(() => data?.activities || [], [data?.activities]);
  const total = data?.total || 0;
  const totalPages = Math.ceil(total / pageSize);

  const [sortedActivities, setSortedActivities] = useState(activities);

  useEffect(() => {
    if (activities) {
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
      if (!activities || activities.length === 0) return;
      const sorted = sortArrayOfObjectsByKey<ExtendedActivity>(
        activities,
        sortBy,
        direction
      );
      setSortedActivities(sorted);
    },
    [activities]
  );

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className="flex flex-col gap-2 m-2">
      <div className="flex sm:flex-row justify-between flex-col-reverse gap-2 mb-2">
        <SelectSort
          options={[
            { value: "date", label: "Date" },
            { value: "duration", label: "Duration" },
            { value: "categoryId", label: "Activity Type" },
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

      {isError && (
        <div className="opacity-80 mt-2 text-error">Error loading activities: {(error as Error).message}</div>
      )}
      {sortedActivities.length === 0 && !isLoading && (
        <div className="opacity-80 mt-2 text-shade">No activities found.</div>
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

      <Separator className="my-2" />

      {/* Pagination Controls */}
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              onClick={() => handlePageChange(Math.max(page - 1, 1))}
              className={page === 1 ? "pointer-events-none opacity-50" : ""}
            />
          </PaginationItem>
          {[...Array(totalPages)].map((_, index) => (
            <PaginationItem key={index}>
              <PaginationLink
                onClick={() => handlePageChange(index + 1)}
                isActive={page === index + 1}
              >
                {index + 1}
              </PaginationLink>
            </PaginationItem>
          ))}
          <PaginationItem>
            <PaginationNext
              onClick={() => handlePageChange(Math.min(page + 1, totalPages))}
              className={
                page === totalPages ? "pointer-events-none opacity-50" : ""
              }
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
};

export default ActivityList;
