import { useQuery } from "@tanstack/react-query";
import { CACHE_STRATEGIES } from "./queryConfig";
import { useSession } from "next-auth/react";
import { validateSession } from "@/lib/session";
import { getDailyItemsToday } from "@/services/dashboard/getDailyItemsToday";

export const DAILY_ITEMS_TODAY_QUERY_KEY = "dailyItemsToday";

export const useFetchDailyItemsToday = () => {
  const { data: session } = useSession();
  const userId = session?.user?.id;

  return useQuery({
    queryKey: [DAILY_ITEMS_TODAY_QUERY_KEY, userId],
    queryFn: async () => {
      validateSession(session);
      const response = await getDailyItemsToday(userId!);
      if (!response.success) throw new Error(response.message);
      return response.data;
    },
    enabled: !!userId,
    ...CACHE_STRATEGIES.CRITICAL,
  });
};
