"use client";

import { isToday } from "@/lib/time";
import { Button } from "../ui/Buttons/button";
import Link from "next/link";
import { useFetchRecentActivities } from "@/queries/activityQueries";
import { Badge } from "../ui/badge";
import { Iconify } from "../ui/iconify";

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

  return (
    <div className="space-y-2 px-1 sm:px-3">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Today&apos;s Activities</h2>
        <Button asChild size="sm" variant="link" className="w-auto">
          <Link href={"/dashboard/activity"}>All Activities</Link>
        </Button>
      </div>

      <div className="flex flex-wrap gap-2">
        {todayActivities.map((activity: any) => (
          <Badge
            key={activity.id}
            variant="secondary"
            className="flex items-center gap-1 px-2 py-1 text-sm"
            tooltipText={activity.description || undefined}
          >
            <Iconify
              icon="solar:hashtag-square-linear"
              width={16}
              className="text-primary"
            />
            <span className="font-medium">{activity.category?.name}</span>
            <span className="text-muted-foreground">|</span>
            <span className="font-semibold">{activity.duration}</span>
          </Badge>
        ))}
      </div>
    </div>
  );
};

export default RecentActivities;
