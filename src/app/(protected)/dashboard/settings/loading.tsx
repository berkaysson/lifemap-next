import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import DashboardHeader from "@/layouts/sidebar/dashboard-header";

export default function Loading() {
  return (
    <div>
      <DashboardHeader title="Settings" />
      <div className="w-full max-w-md mx-auto my-8 p-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <Skeleton className="h-4 w-16" /> {/* Name label skeleton */}
            <Skeleton className="h-10 w-full" /> {/* Name input skeleton */}
          </div>
          <div className="space-y-2">
            <Skeleton className="h-4 w-16" /> {/* Email label skeleton */}
            <Skeleton className="h-10 w-full" /> {/* Email input skeleton */}
          </div>
        </div>
        <Separator className="my-6" />
        <div className="flex flex-col items-start space-y-4">
          <Skeleton className="h-10 w-full" />{" "}
          {/* Request Password Reset button skeleton */}
        </div>
      </div>
    </div>
  );
}
