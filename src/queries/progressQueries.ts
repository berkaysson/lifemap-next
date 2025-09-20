import { validateSession } from "@/lib/session";
import { getWeeklyActivitiesSummary } from "@/services/progress/getWeeklyActivitiesSummary";
import { getWeeklyCategoryActivitiesSummary } from "@/services/progress/getWeeklyCategoryActivitiesSummary";
import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";

export const WEEKLY_ACTIVITIES_SUMMARY_QUERY_KEY = "weeklyActivitiesSummary";
export const CATEGORY_ACTIVITIES_SUMMARY_QUERY_KEY =
  "categoryActivitiesSummary";

// 1. Fetch Activities Summary by Weekly Query
export const useFetchWeeklyActivitiesSummary = (monthOffset: number) => {
  const { data: session } = useSession();
  const userId = session?.user?.id;

  return useQuery({
    queryKey: [WEEKLY_ACTIVITIES_SUMMARY_QUERY_KEY, userId, monthOffset],
    queryFn: async () => {
      validateSession(session);
      const response = await getWeeklyActivitiesSummary(userId!, monthOffset);
      if (!response.success) throw new Error(response.message);
      return response;
    },
    enabled: !!userId && typeof monthOffset === "number",
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

// 2. Fetch Weekly Category Activities Summary Query
export const useFetchWeeklyCategoryActivitiesSummary = ({
  categoryId,
  weekOffset,
}: {
  categoryId: string;
  weekOffset: number;
}) => {
  const { data: session } = useSession();
  const userId = session?.user?.id;

  return useQuery({
    queryKey: [
      CATEGORY_ACTIVITIES_SUMMARY_QUERY_KEY,
      userId,
      categoryId,
      weekOffset,
    ],
    queryFn: async () => {
      validateSession(session);
      const response = await getWeeklyCategoryActivitiesSummary(
        userId!,
        categoryId,
        weekOffset
      );
      if (!response.success) throw new Error(response.message);
      return response.data;
    },
    enabled: !!userId && !!categoryId && typeof weekOffset === "number",
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};
