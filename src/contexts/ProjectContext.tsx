import { useToast } from "@/components/ui/use-toast";
import { ProjectSchema } from "@/schema";
import {
  createProject,
  deleteProject,
  getProjects,
  updateProject,
  addToDoToProject,
  addTaskToProject,
  addHabitToProject,
  deleteToDoFromProject,
  deleteTaskFromProject,
  deleteHabitFromProject,
} from "@/services/projectService";
import { ExtendedProject } from "@/types/Entitities";
import { ServiceResponse } from "@/types/ServiceResponse";
import { Project } from "@prisma/client";
import { useSession } from "next-auth/react";
import { createContext, ReactNode, useEffect, useMemo, useState } from "react";
import { z } from "zod";

interface ProjectContextValue {
  projects: ExtendedProject[];
  fetchProjects: () => Promise<ServiceResponse>;
  onCreateProject: (
    data: z.infer<typeof ProjectSchema>
  ) => Promise<ServiceResponse>;
  onUpdateProject: (data: Project) => Promise<ServiceResponse>;
  onDeleteProject: (id: string) => Promise<ServiceResponse>;
  onAddToDoToProject: (
    todoId: string,
    projectId: string
  ) => Promise<ServiceResponse>;
  onAddTaskToProject: (
    taskId: string,
    projectId: string
  ) => Promise<ServiceResponse>;
  onAddHabitToProject: (
    habitId: string,
    projectId: string
  ) => Promise<ServiceResponse>;
  onDeleteToDoFromProject: (
    todoId: string,
    projectId: string
  ) => Promise<ServiceResponse>;
  onDeleteTaskFromProject: (
    taskId: string,
    projectId: string
  ) => Promise<ServiceResponse>;
  onDeleteHabitFromProject: (
    habitId: string,
    projectId: string
  ) => Promise<ServiceResponse>;
}

const initialProjectContextValue: ProjectContextValue = {
  projects: [],
  fetchProjects: async () => {
    return {
      message: "",
      success: false,
    };
  },
  onCreateProject: async (data: z.infer<typeof ProjectSchema>) => {
    return {
      message: "",
      success: false,
    };
  },
  onUpdateProject: async (data: Project) => {
    return {
      message: "",
      success: false,
    };
  },
  onDeleteProject: async (id: string) => {
    return {
      message: "",
      success: false,
    };
  },
  onAddToDoToProject: async () => ({ message: "", success: false }),
  onAddTaskToProject: async () => ({ message: "", success: false }),
  onAddHabitToProject: async () => ({ message: "", success: false }),
  onDeleteToDoFromProject: async () => ({ message: "", success: false }),
  onDeleteTaskFromProject: async () => ({ message: "", success: false }),
  onDeleteHabitFromProject: async () => ({ message: "", success: false }),
};

export const ProjectContext = createContext<ProjectContextValue>(
  initialProjectContextValue
);

export const ProjectProvider = ({ children }: { children: ReactNode }) => {
  // Context should be inside of SessionProvider
  const { data: session, status } = useSession();
  const [projects, setProjects] = useState<ExtendedProject[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    if (!session || !session.user || status !== "authenticated") return;
    fetchProjects();
  }, [session, status]);

  const fetchProjects = async () => {
    if (!session || !session.user)
      return { message: "Session not exist", success: false };
    if (!session.user.id) return { message: "User not exist", success: false };
    const response = await getProjects(session.user.id);

    if (response.success && response.projects) {
      setProjects(response.projects);
    }

    return {
      message: response.message,
      success: response.success,
    };
  };

  const onCreateProject = async (data: z.infer<typeof ProjectSchema>) => {
    if (!session || !session.user)
      return {
        message: "Session not exist",
        success: false,
      };

    if (!session.user.id) return { message: "User not exist", success: false };
    const response = await createProject(data, session.user.id);
    if (response.success) {
      toast({
        title: "Project Created",
        description: "Project Created successfully",
        duration: 3000,
      });
      await fetchProjects();
      return response;
    }

    return response;
  };

  const onUpdateProject = async (data: Project) => {
    if (!session || !session.user)
      return {
        message: "Session not exist",
        success: false,
      };
    const response = await updateProject(data);
    if (response.success) {
      toast({
        title: "Project Updated",
        description: "Project Updated successfully",
        duration: 3000,
      });
      await fetchProjects();
    }

    return response;
  };

  const onDeleteProject = async (id: string) => {
    if (!session || !session.user || !id)
      return {
        message: "Session not exist",
        success: false,
      };
    try {
      const response = await deleteProject(id);
      if (response.success) {
        toast({
          title: "Project Deleted",
          description: "Project Deleted successfully",
          duration: 3000,
        });
        await fetchProjects();
      } else {
        toast({
          title: "Project Not Deleted",
          description: response.message,
          duration: 3000,
          variant: "destructive",
        });
      }

      return response;
    } catch (error) {
      return {
        message: `${error}`,
        success: false,
      };
    }
  };

  const onAddToDoToProject = async (todoId: string, projectId: string) => {
    if (!session || !session.user)
      return { message: "Session not exist", success: false };
    try {
      const response = await addToDoToProject(todoId, projectId);
      if (response) {
        toast({
          title: "Todo Added to Project",
          description: "Todo added to project successfully",
          duration: 3000,
        });
        await fetchProjects();
        return { message: "Todo added successfully", success: true };
      }
      return { message: "Failed to add todo to project", success: false };
    } catch (error) {
      return { message: `${error}`, success: false };
    }
  };

  const onAddTaskToProject = async (taskId: string, projectId: string) => {
    if (!session || !session.user)
      return { message: "Session not exist", success: false };
    try {
      const response = await addTaskToProject(taskId, projectId);
      if (response) {
        toast({
          title: "Task Added to Project",
          description: "Task added to project successfully",
          duration: 3000,
        });
        await fetchProjects();
        return { message: "Task added successfully", success: true };
      }
      return { message: "Failed to add task to project", success: false };
    } catch (error) {
      return { message: `${error}`, success: false };
    }
  };

  const onAddHabitToProject = async (habitId: string, projectId: string) => {
    if (!session || !session.user)
      return { message: "Session not exist", success: false };
    try {
      const response = await addHabitToProject(habitId, projectId);
      if (response) {
        toast({
          title: "Habit Added to Project",
          description: "Habit added to project successfully",
          duration: 3000,
        });
        await fetchProjects();
        return { message: "Habit added successfully", success: true };
      }
      return { message: "Failed to add habit to project", success: false };
    } catch (error) {
      return { message: `${error}`, success: false };
    }
  };

  const onDeleteToDoFromProject = async (todoId: string, projectId: string) => {
    if (!session || !session.user)
      return { message: "Session not exist", success: false };
    try {
      const response = await deleteToDoFromProject(todoId, projectId);
      if (response) {
        toast({
          title: "Todo Removed from Project",
          description: "Todo removed from project successfully",
          duration: 3000,
        });
        await fetchProjects();
        return { message: "Todo removed successfully", success: true };
      }
      return { message: "Failed to remove todo from project", success: false };
    } catch (error) {
      return { message: `${error}`, success: false };
    }
  };

  const onDeleteTaskFromProject = async (taskId: string, projectId: string) => {
    if (!session || !session.user)
      return { message: "Session not exist", success: false };
    try {
      const response = await deleteTaskFromProject(taskId, projectId);
      if (response) {
        toast({
          title: "Task Removed from Project",
          description: "Task removed from project successfully",
          duration: 3000,
        });
        await fetchProjects();
        return { message: "Task removed successfully", success: true };
      }
      return { message: "Failed to remove task from project", success: false };
    } catch (error) {
      return { message: `${error}`, success: false };
    }
  };

  const onDeleteHabitFromProject = async (
    habitId: string,
    projectId: string
  ) => {
    if (!session || !session.user)
      return { message: "Session not exist", success: false };
    try {
      const response = await deleteHabitFromProject(habitId, projectId);
      if (response) {
        toast({
          title: "Habit Removed from Project",
          description: "Habit removed from project successfully",
          duration: 3000,
        });
        await fetchProjects();
        return { message: "Habit removed successfully", success: true };
      }
      return { message: "Failed to remove habit from project", success: false };
    } catch (error) {
      return { message: `${error}`, success: false };
    }
  };

  const contextValue = useMemo(
    () => ({
      projects,
      fetchProjects,
      onCreateProject,
      onUpdateProject,
      onDeleteProject,
      onAddToDoToProject,
      onAddTaskToProject,
      onAddHabitToProject,
      onDeleteToDoFromProject,
      onDeleteTaskFromProject,
      onDeleteHabitFromProject,
    }),
    [projects, session]
  );

  return (
    <ProjectContext.Provider value={contextValue}>
      {children}
    </ProjectContext.Provider>
  );
};
