import { Skeleton } from "@/components/ui/skeleton";
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
} from "@/components/ui/card";

export default function Loading() {
  return (
    <div className="flex flex-col gap-4 m-2">
      <Skeleton className="h-10 w-[200px] mb-4" />{" "}
      {/* Skeleton for SelectSort */}
      <ul className="rounded-sm grid grid-cols-1 gap-3">
        {[...Array(3)].map((_, index) => (
          <ProjectListItemSkeleton key={index} />
        ))}
      </ul>
    </div>
  );
}

function ProjectListItemSkeleton() {
  return (
    <Card className="w-full mx-auto mb-6">
      <CardHeader>
        <Skeleton className="h-8 w-1/3 mb-2" /> {/* Project name skeleton */}
        <Skeleton className="h-4 w-2/3" /> {/* Project description skeleton */}
      </CardHeader>
      <CardContent className="space-y-4">
        {/* ToDos button skeleton */}
        <Skeleton className="h-10 w-full" />

        {/* Tasks button skeleton */}
        <Skeleton className="h-10 w-full" />

        {/* Habits button skeleton */}
        <Skeleton className="h-10 w-full" />
      </CardContent>
      <CardFooter className="flex justify-between">
        <Skeleton className="h-9 w-24" /> {/* Delete button skeleton */}
        <Skeleton className="h-9 w-24" /> {/* Edit button skeleton */}
      </CardFooter>
    </Card>
  );
}
