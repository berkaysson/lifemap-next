import { TaskSchema } from "@/schema";
import { createTask, deleteTask, getTasks } from "@/services/taskService";
import { Task } from "@prisma/client";
import { useSession } from "next-auth/react";
import { createContext, ReactNode, useEffect, useMemo, useState } from "react";
import { z } from "zod";

interface ResponseValue {
  message: string;
  success: boolean;
}

interface TaskContextValue {
  tasks: Task[];
  fetchTasks: () => Promise<ResponseValue>;
  onCreateTask: (data: z.infer<typeof TaskSchema>) => Promise<ResponseValue>;
  onDeleteTask: (id: string) => Promise<ResponseValue>;
}

const initialTaskContextValue: TaskContextValue = {
  tasks: [],
  fetchTasks: async () => ({ message: "", success: false }),
  onCreateTask: async () => ({ message: "", success: false }),
  onDeleteTask: async () => ({ message: "", success: false }),
};

export const TaskContext = createContext(initialTaskContextValue);

export const TaskProvider = ({ children }: { children: ReactNode }) => {
  const { data: session, status } = useSession();
  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
    if (!session || !session.user || status !== "authenticated") return;
    fetchTasks();
  }, [session, status]);

  const fetchTasks = async () => {
    if (!session || !session.user) {
      return { message: "Session not exist", success: false };
    }
    if (!session.user.id) return { message: "User not exist", success: false };
    const response = await getTasks(session.user.id);
    if (response.success && response.tasks) {
      setTasks(response.tasks);
    }

    return {
      message: response.message,
      success: response.success,
    };
  };

  const onCreateTask = async (data: z.infer<typeof TaskSchema>) => {
    if (!session || !session.user || !data) {
      return { message: "Session or data not exist", success: false };
    }
    if (!session.user.id) return { message: "User not exist", success: false };
    const response = await createTask(data, session.user.id);
    if (response.success) {
      await fetchTasks();
      return response;
    }
    return response;
  };

  const onUpdateTask = async () => {};

  const onDeleteTask = async (id: string) => {
    if (!session || !session.user || !id) {
      return { message: "Session or id not exist", success: false };
    }
    try {
      const response = await deleteTask(id);
      if (response.success) {
        await fetchTasks();
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
    () => ({ tasks, fetchTasks, onCreateTask, onDeleteTask }),
    [tasks]
  );

  return (
    <TaskContext.Provider value={contextValue}>{children}</TaskContext.Provider>
  );
};
