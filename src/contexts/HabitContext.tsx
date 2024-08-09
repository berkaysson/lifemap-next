import { useToast } from "@/components/ui/use-toast";
import { HabitSchema } from "@/schema";
import { createHabit, deleteHabit, getHabits } from "@/services/habitService";
import { ServiceResponse } from "@/types/ServiceResponse";
import { Habit } from "@prisma/client";
import { useSession } from "next-auth/react";
import { createContext, ReactNode, useEffect, useMemo, useState } from "react";
import { z } from "zod";

interface HabitContextValue {
  habits: Habit[];
  fetchHabits: () => Promise<ServiceResponse>;
  onCreateHabit: (
    data: z.infer<typeof HabitSchema>
  ) => Promise<ServiceResponse>;
  onDeleteHabit: (id: string) => Promise<ServiceResponse>;
  onUpdateHabit: (id: string, data: Partial<Habit>) => Promise<ServiceResponse>;
}

const initialHabitContextValue: HabitContextValue = {
  habits: [],
  fetchHabits: async () => ({ message: "", success: false }),
  onCreateHabit: async () => ({ message: "", success: false }),
  onDeleteHabit: async () => ({ message: "", success: false }),
  onUpdateHabit: async () => ({ message: "", success: false }),
};

export const HabitContext = createContext(initialHabitContextValue);

export const HabitProvider = ({ children }: { children: ReactNode }) => {
  const { data: session, status } = useSession();
  const [habits, setHabits] = useState<Habit[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    if (!session || !session.user || status !== "authenticated") return;
    fetchHabits();
  }, [session, status]);

  const fetchHabits = async () => {
    if (!session || !session.user) {
      return { message: "Session not exist", success: false };
    }
    if (!session.user.id) return { message: "User not exist", success: false };
    const response = await getHabits(session.user.id);
    if (response.success && response.habits) {
      setHabits(response.habits);
    }

    return {
      message: response.message,
      success: response.success,
    };
  };

  const onCreateHabit = async (data: z.infer<typeof HabitSchema>) => {
    if (!session || !session.user || !data) {
      return { message: "Session or data not exist", success: false };
    }
    if (!session.user.id) return { message: "User not exist", success: false };
    const response = await createHabit(data, session.user.id);
    if (response.success) {
      toast({
        title: "Habit Created",
        description: "Habit Created successfully",
        duration: 3000,
      });
      await fetchHabits();
      return response;
    }
    return response;
  };

  const onUpdateHabit = async (id: string, data: Partial<Habit>) => {
    if (!session || !session.user || !data) {
      return { message: "Session or data not exist", success: false };
    }
    if (!session.user.id) return { message: "User not exist", success: false };
    return { message: "", success: false };
  };

  const onDeleteHabit = async (id: string) => {
    if (!session || !session.user) {
      return { message: "Session or data not exist", success: false };
    }
    try {
      const response = await deleteHabit(id);
      if (response.success) {
        toast({
          title: "Habit Deleted",
          description: "Habit Deleted successfully",
          duration: 3000,
        });
        await fetchHabits();
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

  const contextValue = useMemo(
    () => ({ habits, fetchHabits, onCreateHabit, onUpdateHabit, onDeleteHabit }),
    [habits]
  );
  return (
    <HabitContext.Provider value={contextValue}>
      {children}
    </HabitContext.Provider>
  );
};
