import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export default function Loading() {
  return (
    <section className="flex flex-col gap-2 m-2">
      <Skeleton className="h-10 w-[200px] mb-4" />{" "}
      {/* Skeleton for SelectSort */}
      <ul className="rounded-sm grid grid-cols-1 gap-4 mt-4">
        {[...Array(5)].map((_, index) => (
          <HabitListItemSkeleton key={index} />
        ))}
      </ul>
    </section>
  );
}

function HabitListItemSkeleton() {
  return (
    <Card className="w-full mb-4 shadow-md hover:shadow-lg transition-shadow duration-300">
      <div className="flex justify-between p-1 pb-0 items-start sm:flex-row flex-col gap-1">
        <div className="flex gap-1 sm:gap-2 sm:justify-start sm:w-auto w-full justify-between">
          <Skeleton className="h-6 w-6 rounded-full" />{" "}
          {/* ColorCircle skeleton */}
          <Skeleton className="h-6 w-6" /> {/* IsCompleted skeleton */}
        </div>
        <div className="flex gap-1 sm:gap-2">
          <Skeleton className="h-6 w-20" /> {/* Category badge skeleton */}
          <Skeleton className="h-6 w-24" /> {/* Project badge skeleton */}
        </div>
      </div>
      <CardHeader className="pb-1">
        <Skeleton className="h-6 w-3/4" /> {/* Habit name skeleton */}
      </CardHeader>
      <CardContent className="p-2 sm:p-3">
        <Skeleton className="h-4 w-full mb-2" /> {/* Description skeleton */}
        <Skeleton className="h-4 w-5/6 mb-2" />
        <div className="flex justify-between flex-col sm:flex-row gap-1 sm:gap-4 mb-1 mt-1">
          <Skeleton className="h-4 w-40" /> {/* Date range skeleton */}
          <Skeleton className="h-4 w-32" /> {/* Remaining time skeleton */}
        </div>
        <Skeleton className="h-4 w-40 mb-3" /> {/* Best Streak skeleton */}
        <div className="flex justify-end space-x-2">
          <Skeleton className="h-8 w-16" /> {/* Edit button skeleton */}
          <Skeleton className="h-8 w-8" /> {/* Delete button skeleton */}
          <Skeleton className="h-8 w-8" /> {/* Archive button skeleton */}
        </div>
      </CardContent>
    </Card>
  );
}
