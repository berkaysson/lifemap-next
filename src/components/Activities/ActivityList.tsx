"use client";

import { useMemo, useState } from "react";
import ActivityListItem from "./ActivityListItem";
import SelectSort from "../ui/Shared/SelectSort";
import type { Activity } from "@prisma/client";
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
import { useIsMobile } from "@/hooks/use-mobile";

const ActivityList = () => {
  const [viewMode, setViewMode] = useState<"table" | "grid">("table");
  const isMobile = useIsMobile();

  const [page, setPage] = useState(1);
  const pageSize = 10;
  const [sortField, setSortField] = useState<keyof Activity>("date");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  const { data, isLoading } = useFetchActivities(
    page,
    pageSize,
    sortField,
    sortOrder
  );

  const activities = useMemo(() => data?.activities || [], [data?.activities]);
  const total = data?.total || 0;
  const totalPages = Math.ceil(total / pageSize);

  const handleSort = (sortBy: keyof Activity, direction: "asc" | "desc") => {
    if (isLoading) return;
    setSortField(sortBy);
    setSortOrder(direction);
    setPage(1);
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

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
            onSelect={(view) => !isLoading && setViewMode(view)}
          />
        </div>
      </div>

      {isLoading && <Loading />}

      {activities.length === 0 && !isLoading && (
        <div className="opacity-80 mt-2 text-shade">No activities found.</div>
      )}

      {viewMode === "grid" && !isLoading && (
        <ul className="rounded-sm grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {activities.map((activity) => (
            <ActivityListItem key={activity.id} activity={activity} />
          ))}
        </ul>
      )}

      {viewMode === "table" && !isLoading && (
        <ActivityTable sortedActivities={activities} />
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

          {totalPages > 0 && (
            <>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (pageNumber) => {
                  const isFirst = pageNumber === 1;
                  const isLast = pageNumber === totalPages;
                  const isCurrent = pageNumber === page;
                  const shouldShow = isMobile
                    ? isFirst || isLast || isCurrent
                    : isFirst || isLast || Math.abs(pageNumber - page) <= 1;

                  return shouldShow ? (
                    <PaginationItem key={pageNumber}>
                      <PaginationLink
                        onClick={() => handlePageChange(pageNumber)}
                        isActive={page === pageNumber}
                      >
                        {pageNumber}
                      </PaginationLink>
                    </PaginationItem>
                  ) : (
                    // Show ellipsis between gaps
                    (pageNumber === 2 || pageNumber === totalPages - 1) && (
                      <PaginationItem key={`ellipsis-${pageNumber}`}>
                        <span className="px-1 py-1">...</span>
                      </PaginationItem>
                    )
                  );
                }
              )}
            </>
          )}

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
