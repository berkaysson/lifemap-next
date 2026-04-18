"use client";

import { useFetchUpcomingHabits, GroupedHabitProgress } from "@/hooks/use-fetch-upcoming-habits";
import { useState, useMemo, useEffect } from "react";
import { Button } from "../ui/Buttons/button";
import { Iconify } from "../ui/iconify";
import { Card, CardContent } from "../ui/card";
import { useActivityDrawerState } from "@/hooks/use-activity-drawer-state";
import ActivityForm from "../Activities/ActivityForm";

/**
 * A carousel for items ending within the next 7 days.
 * Uses the same structure as DailyItemsCarousel but focuses on upcoming habits.
 */
export default function UpcomingItemsCarousel() {
  const { allGrouped, isLoading } = useFetchUpcomingHabits(7);

  const activityDrawerState = useActivityDrawerState();

  const [currentIndex, setCurrentIndex] = useState(0);

  // Reset index when data changes
  useEffect(() => {
    setCurrentIndex(0);
  }, [allGrouped.length]);

  const currentItem = useMemo(
    () => allGrouped[currentIndex],
    [allGrouped, currentIndex]
  );

  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : allGrouped.length - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev < allGrouped.length - 1 ? prev + 1 : 0));
  };

  const handleCompleteActivity = (categoryId: string, duration: number) => {
    activityDrawerState.open({
      categoryId,
      duration,
    });
  };

  if (isLoading) {
    return (
      <div className="w-full px-2 sm:px-4 text-center p-8 text-sm text-shade">
        Loading upcoming items...
      </div>
    );
  }

  if (allGrouped.length === 0) {
    return null; // Don't show anything if there are no upcoming items
  }

  return (
    <div className="w-full px-2 sm:px-4">
      <ActivityForm drawerState={activityDrawerState} />
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Upcoming Items (Next 7 Days)</h2>
        <span className="text-sm text-muted-foreground">
          {currentIndex + 1} of {allGrouped.length}
        </span>
      </div>
      <div className="mb-2 sm:mb-4">
        <span className="text-sm text-muted-foreground">
          You have {allGrouped.length} distinct item{allGrouped.length > 1 && "s"} coming up
        </span>
      </div>
      <div className="relative flex items-center justify-between flex-col sm:flex-row gap-3 sm:gap-0">
        <Button
          variant="outline"
          size="icon"
          onClick={handlePrevious}
          aria-label="Previous item"
          disabled={allGrouped.length <= 1}
          className=" mr-0 sm:mr-2"
        >
          <Iconify icon="solar:alt-arrow-left-bold" width={20} />
        </Button>

        <div className="w-full transition-all duration-300">
          <div className="relative">
            {allGrouped.length > 1 && (
              <>
                <div className="absolute inset-0 bg-background/80 backdrop-blur-sm rounded-lg transform translate-y-1 translate-x-1 shadow-md"></div>
                <div className="absolute inset-0 bg-background/80 backdrop-blur-sm rounded-lg transform translate-y-0.5 translate-x-0.5 shadow-md"></div>
              </>
            )}
            {currentItem && (
              <UpcomingActivityCard
                activity={currentItem as GroupedHabitProgress}
                onComplete={handleCompleteActivity}
              />
            )}
          </div>
        </div>

        <Button
          variant="outline"
          size="icon"
          onClick={handleNext}
          aria-label="Next item"
          disabled={allGrouped.length <= 1}
          className=" ml-0 sm:ml-3"
        >
          <Iconify icon="solar:alt-arrow-right-bold" width={20} />
        </Button>
      </div>
    </div>
  );
}

function UpcomingActivityCard({
  activity,
  onComplete,
}: {
  activity: GroupedHabitProgress;
  onComplete: (categoryId: string, minutesNeeded: number) => void;
}) {
  const minutesNeeded = activity.goalDuration - activity.completedDuration;

  return (
    <Card className="shadow-lg relative">
      <CardContent className="p-2 sm:p-4">
        <div className="flex items-center justify-between flex-col sm:flex-row gap-4 sm:gap-0">
          <div className="flex-1 mr-0 sm:mr-4">
            <p className="text-sm font-medium">
              Did you spend time on{" "}
              <span className="font-bold">
                {activity.habit?.category?.name || "Unknown"}
              </span>
              ?
            </p>
            <div className="flex flex-col gap-1 mt-1">
              <p className="text-xs text-muted-foreground">
                {minutesNeeded > 0
                  ? `${minutesNeeded} minutes needed`
                  : "Goal reached"}
              </p>
              {activity.occurrenceCount > 1 && (
                <p className="text-[10px] font-semibold text-primary/80 uppercase tracking-wider">
                  {activity.occurrenceCount} more occurrences in the next 7 days
                </p>
              )}
            </div>
          </div>
          <Button
            size="sm"
            onClick={() => onComplete(activity.categoryId, minutesNeeded)}
          >
            Yes, I did
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
