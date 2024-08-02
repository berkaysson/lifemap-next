import { ActivitySchema } from "@/schema";
import {
  createActivity,
  deleteActivity,
  getActivities,
  updateActivity,
} from "@/services/activityService";
import { Activity } from "@prisma/client";
import { useSession } from "next-auth/react";
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { z } from "zod";
import { TaskContext } from "./TaskContext";
import { ServiceResponse } from "@/types/ServiceResponse";

interface ActivityContextValue {
  activities: Activity[];
  fetchActivities: () => Promise<ServiceResponse>;
  onCreateActivity: (
    data: z.infer<typeof ActivitySchema>
  ) => Promise<ServiceResponse>;
  onUpdateActivity: (data: Activity) => Promise<ServiceResponse>;
  onDeleteActivity: (id: string) => Promise<ServiceResponse>;
}

const initialActivityContextValue: ActivityContextValue = {
  activities: [],
  fetchActivities: async () => {
    return { message: "", success: false };
  },
  onCreateActivity: async () => {
    return { message: "", success: false };
  },
  onUpdateActivity: async () => {
    return { message: "", success: false };
  },
  onDeleteActivity: async () => {
    return { message: "", success: false };
  },
};

export const ActivityContext = createContext<ActivityContextValue>(
  initialActivityContextValue
);

export const ActivityProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { data: session, status } = useSession();
  const [activities, setActivities] = useState<Activity[]>([]);
  const { fetchTasks } = useContext(TaskContext);

  useEffect(() => {
    if (!session || !session.user || status !== "authenticated") return;
    fetchActivities();
  }, [session, status]);

  useEffect(() => {
    if (activities) {
      fetchTasks();
    }
  }, [activities]);

  const fetchActivities = async () => {
    if (!session || !session.user) {
      return { message: "Session not exist", success: false };
    }
    if (!session.user.id) return { message: "User not exist", success: false };
    const response = await getActivities(session.user.id);
    if (response.success && response.activities) {
      setActivities(response.activities);
    }

    return {
      message: response.message,
      success: response.success,
    };
  };

  const onCreateActivity = async (data: z.infer<typeof ActivitySchema>) => {
    if (!session || !session.user || !data) {
      return { message: "Session or data not exist", success: false };
    }
    if (!session.user.id) return { message: "User not exist", success: false };
    const response = await createActivity(data, session.user.id);
    if (response.success) {
      await fetchActivities();
      return response;
    }
    return response;
  };

  const onUpdateActivity = async (data: Activity) => {
    if (!session || !session.user || !data) {
      return { message: "Session or data not exist", success: false };
    }
    if (!session.user.id) return { message: "User not exist", success: false };
    const response = await updateActivity(data);
    if (response.success) {
      await fetchActivities();
      return response;
    }
    return response;
  };

  const onDeleteActivity = async (id: string) => {
    if (!session || !session.user || !id) {
      return { message: "Session or id not exist", success: false };
    }
    try {
      const response = await deleteActivity(id);
      if (response.success) {
        await fetchActivities();
        return response;
      }
      return response;
    } catch (error) {
      return {
        message: `${error}`,
        success: false,
      };
    }
  };

  const contextValue = useMemo(() => {
    return {
      activities,
      fetchActivities,
      onCreateActivity,
      onUpdateActivity,
      onDeleteActivity,
    };
  }, [activities, session]);

  return (
    <ActivityContext.Provider value={contextValue}>
      {children}
    </ActivityContext.Provider>
  );
};
