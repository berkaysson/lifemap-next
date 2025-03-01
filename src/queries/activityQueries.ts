import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/components/ui/Misc/use-toast";
import { ActivitySchema } from "@/schema";
import { Activity } from "@prisma/client";
import { useSession } from "next-auth/react";
import { z } from "zod";
import { validateSession } from "@/lib/session";
import { ExtendedActivity } from "@/types/Entitities";
import { TASK_QUERY_KEY } from "./taskQueries";
import { HABIT_QUERY_KEY } from "./habitQueries";
import { getActivities } from "@/services/activity/getActivites";
import { createActivity } from "@/services/activity/createActivity";
import { updateActivity } from "@/services/activity/updateActivity";
import { deleteActivity } from "@/services/activity/deleteActivity";

export const ACTIVITY_QUERY_KEY = "activities";

// 1. Fetch Activities Query with Pagination
export const useFetchActivities = (page: number = 1, pageSize: number = 25) => {
  const { data: session } = useSession();
  const userId = session?.user?.id;

  return useQuery({
    queryKey: [ACTIVITY_QUERY_KEY, userId, page, pageSize],
    queryFn: async () => {
      validateSession(session);
      const response = await getActivities(userId!, page, pageSize);
      if (!response.success) throw new Error(response.message);
      return response;
    },
    enabled: !!userId,
    staleTime: 1000 * 60 * 5,
  });
};

// 2. Create Activity Mutation
export const useCreateActivity = () => {
  const { data: session } = useSession();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const userId = session?.user?.id;

  return useMutation({
    mutationFn: async (data: z.infer<typeof ActivitySchema>) => {
      validateSession(session);
      const response = await createActivity(data, userId!);
      if (!response.success) throw new Error(response.message);
      return response;
    },
    onSuccess: () => {
      toast({
        title: "Activity Created",
        description: "Activity created successfully",
        duration: 3000,
      });

      queryClient.invalidateQueries({ queryKey: [ACTIVITY_QUERY_KEY, userId] });
      queryClient.invalidateQueries({ queryKey: [TASK_QUERY_KEY, userId] });
      queryClient.invalidateQueries({ queryKey: [HABIT_QUERY_KEY, userId] });
      queryClient.invalidateQueries({
        queryKey: ["habitProgressesEndingToday", userId],
      });
      queryClient.invalidateQueries({ queryKey: ["combinedDailyItems", userId] });
    },
    onError: (error: any) => {
      toast({
        title: "Activity Not Created",
        description: "An error occurred while creating the activity.",
        duration: 3000,
        variant: "destructive",
      });
    },
  });
};

// 3. Update Activity Mutation
export const useUpdateActivity = () => {
  const { data: session } = useSession();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const userId = session?.user?.id;

  return useMutation({
    mutationFn: async (data: Activity) => {
      validateSession(session);
      const response = await updateActivity(data);
      if (!response.success) throw new Error(response.message);
      return response;
    },
    onMutate: async (updatedActivity) => {
      await queryClient.cancelQueries({
        queryKey: [ACTIVITY_QUERY_KEY, userId],
      });

      const previousActivities = queryClient.getQueryData([
        ACTIVITY_QUERY_KEY,
        userId,
      ]);

      queryClient.setQueryData(
        [ACTIVITY_QUERY_KEY, userId],
        (old: ExtendedActivity[] | undefined) => {
          if (!old) return [updatedActivity];
          return old.map((activity) =>
            activity.id === updatedActivity.id
              ? { ...activity, ...updatedActivity }
              : activity
          );
        }
      );

      return { previousActivities };
    },
    onSuccess: () => {
      toast({
        title: "Activity Updated",
        description: "Activity updated successfully",
        duration: 3000,
      });
      queryClient.invalidateQueries({ queryKey: [ACTIVITY_QUERY_KEY, userId] });
      queryClient.invalidateQueries({ queryKey: [TASK_QUERY_KEY, userId] });
      queryClient.invalidateQueries({ queryKey: [HABIT_QUERY_KEY, userId] });
    },
    onError: (error: any, _, context) => {
      queryClient.setQueryData(
        [ACTIVITY_QUERY_KEY, userId],
        context?.previousActivities
      );
      toast({
        title: "Activity Not Updated",
        description: "An error occurred while updating the activity.",
        duration: 3000,
        variant: "destructive",
      });
    },
  });
};

// 4. Delete Activity Mutation
export const useDeleteActivity = () => {
  const { data: session } = useSession();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const userId = session?.user?.id;

  return useMutation({
    mutationFn: async (activity: ExtendedActivity) => {
      validateSession(session);
      const response = await deleteActivity(activity);
      if (!response.success) throw new Error(response.message);
      return response;
    },
    onMutate: async (deletedActivity) => {
      await queryClient.cancelQueries({
        queryKey: [ACTIVITY_QUERY_KEY, userId],
      });

      const previousActivities = queryClient.getQueryData([
        ACTIVITY_QUERY_KEY,
        userId,
      ]);

      queryClient.setQueryData(
        [ACTIVITY_QUERY_KEY, userId],
        (old: ExtendedActivity[] | undefined) => {
          if (!old) return [];
          return old.filter((activity) => activity.id !== deletedActivity.id);
        }
      );

      return { previousActivities };
    },
    onSuccess: () => {
      toast({
        title: "Activity Deleted",
        description: "Activity deleted successfully",
        duration: 3000,
      });
      queryClient.invalidateQueries({ queryKey: [ACTIVITY_QUERY_KEY, userId] });
      queryClient.invalidateQueries({ queryKey: [TASK_QUERY_KEY, userId] });
      queryClient.invalidateQueries({ queryKey: [HABIT_QUERY_KEY, userId] });
    },
    onError: (error: any, _, context) => {
      queryClient.setQueryData(
        [ACTIVITY_QUERY_KEY, userId],
        context?.previousActivities
      );
      toast({
        title: "Activity Not Deleted",
        description: "An error occurred while deleting the activity.",
        duration: 3000,
        variant: "destructive",
      });
    },
  });
};
