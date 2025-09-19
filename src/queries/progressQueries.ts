import { validateSession } from "@/lib/session";
import { getWeeklyActivitiesSummary } from "@/services/progress/getWeeklyActivitiesSummary";
import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";

export const PROGRESSES_QUERY_KEY = "progresses";

// 1. Fetch Activities Summary by Weekly Query
export const useFetchWeeklyActivitiesSummary = (monthOffset: number) => {
  const { data: session } = useSession();
  const userId = session?.user?.id;

  return useQuery({
    queryKey: [PROGRESSES_QUERY_KEY, userId, monthOffset],
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
