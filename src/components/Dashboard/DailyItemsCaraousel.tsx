"use client";

import { useFetchDailyItems } from "@/hooks/use-fetch-daily-items";
import { useState } from "react";
import { Button } from "../ui/Buttons/button";
import { Iconify } from "../ui/iconify";
import RecentTodoItem from "./RecentTodoItem";
import { ToDo } from "@prisma/client";
import { Card, CardContent } from "../ui/card";
import { useActivityDrawerState } from "@/hooks/use-activity-drawer-state";
import ActivityForm from "../Activities/ActivityForm";

export default function DailyItemsCarousel() {
  const { todos, tasks, habitProgresses, isLoading } = useFetchDailyItems();

  const activityDrawerState = useActivityDrawerState();

  const allItems = [
    ...todos.map((todo) => ({ type: "todo", item: todo })),
    ...tasks
      .map((task) => ({ type: "activity", item: task }))
      .filter((item) => !item.item.completed),
    ...habitProgresses
      .map((progress) => ({
        type: "activity",
        item: progress,
      }))
      .filter((item) => !item.item.completed),
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : allItems.length - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev < allItems.length - 1 ? prev + 1 : 0));
  };

  const handleCompleteActivity = (categoryId: string, duration: number) => {
    activityDrawerState.open({
      categoryId,
      duration,
    });
  };

  if (allItems.length === 0 || isLoading) {
    return (
      <div className="text-center p-3 text-sm text-shade">
        No daily items found!
      </div>
    );
  }

  const currentItem = allItems[currentIndex];

  return (
    <div className="w-full px-2 sm:px-4">
      <ActivityForm drawerState={activityDrawerState} />
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Daily Items</h2>
        <span className="text-sm text-muted-foreground">
          {currentIndex + 1} of {allItems.length}
        </span>
      </div>
      <div className="mb-2 sm:mb-4">
        <span className="text-sm text-muted-foreground">
          You have {allItems.length} todos, tasks, or habit steps to complete
        </span>
      </div>
      <div className="relative flex items-center justify-between flex-col sm:flex-row gap-3 sm:gap-0">
        <Button
          variant="outline"
          size="icon"
          onClick={handlePrevious}
          aria-label="Previous item"
          className="z-10 mr-0 sm:mr-2"
        >
          <Iconify icon="solar:alt-arrow-left-bold" width={20} />
        </Button>

        <div className="w-full transition-all duration-300">
          <div className="relative">
            {allItems.length > 1 && (
              <>
                <div className="absolute inset-0 bg-background/80 backdrop-blur-sm rounded-lg transform translate-y-1 translate-x-1 shadow-md"></div>
                <div className="absolute inset-0 bg-background/80 backdrop-blur-sm rounded-lg transform translate-y-0.5 translate-x-0.5 shadow-md"></div>
              </>
            )}
            {currentItem.type === "todo" && (
              <Card className="shadow-lg relative z-10">
                <CardContent className="p-2 sm:p-4 py-2">
                  <RecentTodoItem
                    key={currentItem.item.id}
                    todo={currentItem.item as ToDo}
                  />
                </CardContent>
              </Card>
            )}
            {currentItem.type === "activity" && (
              <ActivityCard
                activity={currentItem.item}
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
          className="z-10 ml-0 sm:ml-3"
        >
          <Iconify icon="solar:alt-arrow-right-bold" width={20} />
        </Button>
      </div>
    </div>
  );
}

function ActivityCard({
  activity,
  onComplete,
}: {
  activity: any;
  onComplete: (categoryId: string, minutesNeeded: number) => void;
}) {
  const minutesNeeded = activity.goalDuration - activity.completedDuration;

  return (
    <Card className="shadow-lg relative z-10">
      <CardContent className="p-2 sm:p-4">
        <div className="flex items-center justify-between flex-col sm:flex-row gap-4 sm:gap-0">
          <div className="flex-1 mr-0 sm:mr-4">
            <p className="text-sm font-medium">
              Did you spend time on{" "}
              <span className="font-bold">
                {activity.category?.name ||
                  activity.habit?.category?.name ||
                  "Unknown"}
              </span>
              ?
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              {minutesNeeded > 0
                ? `${minutesNeeded} minutes needed`
                : "Goal reached"}
            </p>
          </div>
          {!activity.completed && (
            <Button
              size="sm"
              onClick={() => onComplete(activity.categoryId, minutesNeeded)}
            >
              Yes, I did
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
