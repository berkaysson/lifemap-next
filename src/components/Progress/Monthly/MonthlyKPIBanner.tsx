"use client";

import { Clock, CheckCircle2, ListChecks, CheckSquare, FileText } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { MonthlyReportData } from "@/services/progress/getMonthlyReport";

type Props = {
  data: MonthlyReportData | null | undefined;
  isLoading: boolean;
  isError: boolean;
};

const formatDuration = (totalMinutes: number) => {
  const hours = Math.floor(totalMinutes / 60);
  const minutes = Math.round(totalMinutes % 60);
  if (hours > 0 && minutes > 0) return `${hours}h ${minutes}m`;
  if (hours > 0) return `${hours}h`;
  return `${minutes}m`;
};

const KPI_CONFIG = [
  {
    key: "totalActivityMinutes" as const,
    label: "Activity Time",
    icon: Clock,
    format: (v: number) => formatDuration(v),
    gradient: "from-violet-500/20 to-purple-500/10",
    iconColor: "text-violet-500",
    border: "border-violet-500/20",
  },
  {
    key: "habitsCompleted" as const,
    label: "Habits Done",
    icon: CheckCircle2,
    format: (v: number) => `${v}`,
    gradient: "from-emerald-500/20 to-green-500/10",
    iconColor: "text-emerald-500",
    border: "border-emerald-500/20",
  },
  {
    key: "tasksCompleted" as const,
    label: "Tasks Done",
    icon: ListChecks,
    format: (v: number) => `${v}`,
    gradient: "from-blue-500/20 to-cyan-500/10",
    iconColor: "text-blue-500",
    border: "border-blue-500/20",
  },
  {
    key: "todosCompleted" as const,
    label: "Todos Done",
    icon: CheckSquare,
    format: (v: number) => `${v}`,
    gradient: "from-amber-500/20 to-orange-500/10",
    iconColor: "text-amber-500",
    border: "border-amber-500/20",
  },
  {
    key: "notesCreated" as const,
    label: "Notes Written",
    icon: FileText,
    format: (v: number) => `${v}`,
    gradient: "from-rose-500/20 to-pink-500/10",
    iconColor: "text-rose-500",
    border: "border-rose-500/20",
  },
];

export function MonthlyKPIBanner({ data, isLoading, isError }: Props) {
  if (isError) {
    return (
      <div className="flex items-center justify-center rounded-xl border border-destructive/30 bg-destructive/5 p-6">
        <p className="text-sm text-destructive">Failed to load monthly stats.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
      {KPI_CONFIG.map(({ key, label, icon: Icon, format, gradient, iconColor, border }) => {
        const value = data?.kpi[key] ?? 0;
        return (
          <Card
            key={key}
            className={`relative overflow-hidden border ${border} bg-gradient-to-br ${gradient} backdrop-blur-sm transition-all duration-200 hover:scale-[1.02] hover:shadow-md`}
          >
            <CardContent className="p-4">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <p className="text-xs font-medium text-muted-foreground">{label}</p>
                  {isLoading ? (
                    <Skeleton className="mt-1.5 h-7 w-16" />
                  ) : (
                    <p className="mt-1 truncate text-2xl font-bold tracking-tight text-foreground">
                      {format(value)}
                    </p>
                  )}
                </div>
                <div className={`rounded-lg bg-background/40 p-2 ${iconColor}`}>
                  <Icon className="h-4 w-4" />
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
