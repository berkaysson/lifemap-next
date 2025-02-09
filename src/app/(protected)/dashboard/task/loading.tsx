import { Skeleton } from "@/components/ui/skeleton";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";

export default function Loading() {
  return (
    <section className="flex flex-col gap-2 m-2">
      <Skeleton className="h-10 w-[200px] mb-4" />{" "}
      {/* Skeleton for SelectSort */}
      <ul className="rounded-sm grid grid-cols-1 gap-4 mt-4">
        {[...Array(5)].map((_, index) => (
          <TaskListItemSkeleton key={index} />
        ))}
      </ul>
    </section>
  );
}

function TaskListItemSkeleton() {
  return (
    <Card className="w-full mb-4 shadow-md">
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
        <Skeleton className="h-6 w-3/4" /> {/* Task name skeleton */}
      </CardHeader>
      <CardContent className="p-2 sm:p-3">
        <Skeleton className="h-4 w-full mb-2" /> {/* Description skeleton */}
        <Skeleton className="h-4 w-5/6 mb-2" />
        <div className="flex justify-between flex-col sm:flex-row gap-1 sm:gap-4 mb-4 mt-1">
          <Skeleton className="h-4 w-40" /> {/* Date range skeleton */}
          <Skeleton className="h-4 w-32" /> {/* Remaining time skeleton */}
        </div>
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <Skeleton className="h-4 w-16" /> {/* Progress label skeleton */}
            <Skeleton className="h-4 w-24" /> {/* Progress value skeleton */}
          </div>
          <Skeleton className="h-2 w-full" /> {/* Progress bar skeleton */}
        </div>
      </CardContent>
      <CardFooter className="flex justify-end space-x-2">
        <Skeleton className="h-8 w-16" /> {/* Edit button skeleton */}
        <Skeleton className="h-8 w-8" /> {/* Delete button skeleton */}
        <Skeleton className="h-8 w-8" /> {/* Archive button skeleton */}
      </CardFooter>
    </Card>
  );
}
