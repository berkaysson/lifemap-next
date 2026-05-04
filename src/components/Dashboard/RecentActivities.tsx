"use client";

import React from "react";
import { isToday } from "@/lib/time";
import { Button } from "../ui/Buttons/button";
import Link from "next/link";
import { useFetchRecentActivities } from "@/queries/activityQueries";
import { Badge } from "../ui/badge";
import { Iconify } from "../ui/iconify";
import Tooltip from "@mui/material/Tooltip";

const RecentActivities = () => {
  const { data } = useFetchRecentActivities(50);
  const activities = data?.activities || [];

  const todayActivities = activities
    ?.filter((activity: any) => {
      return isToday(new Date(activity.date));
    })
    ?.sort((a: any, b: any) => {
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    });

  if (!todayActivities || todayActivities.length === 0) {
    return null;
  }

  // Group activities by category
  const groupedActivities = todayActivities.reduce(
    (acc: any, activity: any) => {
      const categoryId = activity.categoryId;
      if (!acc[categoryId]) {
        acc[categoryId] = {
          category: activity.category,
          totalDuration: 0,
          activities: [],
        };
      }
      acc[categoryId].totalDuration += activity.duration;
      acc[categoryId].activities.push(activity);
      return acc;
    },
    {},
  );

  const groupedList: any[] = Object.values(groupedActivities);

  return (
    <div className="space-y-2 px-1 sm:px-3">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Today&apos;s Activities</h2>
        <Button asChild size="sm" variant="link" className="w-auto">
          <Link href={"/dashboard/activity"}>All Activities</Link>
        </Button>
      </div>

      <div className="flex flex-wrap gap-2">
        {groupedList.map((group: any) => {
          const isMultiple = group.activities.length > 1;
          const firstActivity = group.activities[0];
          const categoryId = group.category?.id || firstActivity.id;

          const badge = (
            <Badge
              variant="secondary"
              className="flex items-center gap-1 px-2 py-1 text-sm cursor-default"
              tooltipText={!isMultiple ? firstActivity.description : undefined}
            >
              <Iconify
                icon="solar:hashtag-square-linear"
                width={16}
                className="text-primary"
              />
              <span className="font-medium">{group.category?.name}</span>
              <span className="text-muted-foreground">|</span>
              <span className="font-semibold">{group.totalDuration}</span>
              {isMultiple && (
                <Iconify
                  icon="solar:info-circle-linear"
                  width={14}
                  className="text-muted-foreground"
                />
              )}
            </Badge>
          );

          if (isMultiple) {
            return (
              <Tooltip
                key={categoryId}
                title={
                  <div className="flex flex-col gap-1 p-1">
                    {group.activities.map((act: any) => (
                      <div
                        key={act.id}
                        className="flex items-center justify-between gap-4 text-xs"
                      >
                        <span className="opacity-80">
                          {group.category?.name}
                        </span>
                        <span className="font-bold">{act.duration}</span>
                      </div>
                    ))}
                  </div>
                }
                placement="top"
                arrow
              >
                <div>{badge}</div>
              </Tooltip>
            );
          }

          return <React.Fragment key={categoryId}>{badge}</React.Fragment>;
        })}
      </div>
    </div>
  );
};

export default RecentActivities;
