import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/components/ui/use-toast";
import { ProjectSchema } from "@/schema";

import { EntityMutationConfig, ExtendedProject } from "@/types/Entitities";
import { Project } from "@prisma/client";
import { useSession } from "next-auth/react";
import { z } from "zod";
import { validateSession } from "@/lib/session";
import { getProjects } from "@/services/project/getProjects";
import { createProject } from "@/services/project/createProject";
import { updateProject } from "@/services/project/updateProject";
import { deleteProject } from "@/services/project/deleteProject";
import {
  addHabitToProject,
  addTaskToProject,
  addToDoToProject,
} from "@/services/project/addEntityToProject";
import {
  deleteHabitFromProject,
  deleteTaskFromProject,
  deleteToDoFromProject,
} from "@/services/project/deleteEntitityFromProject";

export const PROJECT_QUERY_KEY = "projects";

// 1. Fetch Projects Query
export const useFetchProjects = () => {
  const { data: session } = useSession();
  const userId = session?.user?.id;

  return useQuery({
    queryKey: [PROJECT_QUERY_KEY, userId],
    queryFn: async () => {
      validateSession(session);
      const response = await getProjects(userId!);
      if (!response.success) throw new Error(response.message);
      return response.projects as ExtendedProject[];
    },
    enabled: !!userId,
    staleTime: 1000 * 60 * 5,
  });
};

// 2. Create Project Mutation
export const useCreateProject = () => {
  const { data: session } = useSession();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const userId = session?.user?.id;

  return useMutation({
    mutationFn: async (data: z.infer<typeof ProjectSchema>) => {
      validateSession(session);
      const response = await createProject(data, userId!);
      if (!response.success) throw new Error(response.message);
      return response;
    },
    onSuccess: () => {
      toast({
        title: "Project Created",
        description: "Project created successfully",
        duration: 3000,
      });
      queryClient.invalidateQueries({ queryKey: [PROJECT_QUERY_KEY, userId] });
    },
    onError: (error: any) => {
      toast({
        title: "Project Not Created",
        description:
          error.message || "An error occurred while creating the project.",
        duration: 3000,
        variant: "destructive",
      });
    },
  });
};

// 3. Update Project Mutation
export const useUpdateProject = () => {
  const { data: session } = useSession();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const userId = session?.user?.id;

  return useMutation({
    mutationFn: async (data: Project) => {
      validateSession(session);
      const response = await updateProject(data);
      if (!response.success) throw new Error(response.message);
      return response;
    },
    onMutate: async (updatedProject) => {
      await queryClient.cancelQueries({
        queryKey: [PROJECT_QUERY_KEY, userId],
      });
      const previousProjects = queryClient.getQueryData([
        PROJECT_QUERY_KEY,
        userId,
      ]);

      queryClient.setQueryData(
        [PROJECT_QUERY_KEY, userId],
        (old: ExtendedProject[] | undefined) => {
          if (!old) return [updatedProject];
          return old.map((project) =>
            project.id === updatedProject.id
              ? { ...project, ...updatedProject }
              : project
          );
        }
      );

      return { previousProjects };
    },
    onSuccess: () => {
      toast({
        title: "Project Updated",
        description: "Project updated successfully",
        duration: 3000,
      });
      queryClient.invalidateQueries({ queryKey: [PROJECT_QUERY_KEY, userId] });
    },
    onError: (error: any, _, context) => {
      queryClient.setQueryData(
        [PROJECT_QUERY_KEY, userId],
        context?.previousProjects
      );
      toast({
        title: "Project Not Updated",
        description:
          error.message || "An error occurred while updating the project.",
        duration: 3000,
        variant: "destructive",
      });
    },
  });
};

// 4. Delete Project Mutation
export const useDeleteProject = () => {
  const { data: session } = useSession();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const userId = session?.user?.id;

  return useMutation({
    mutationFn: async (id: string) => {
      validateSession(session);
      const response = await deleteProject(id);
      if (!response.success) throw new Error(response.message);
      return response;
    },
    onMutate: async (deletedId) => {
      await queryClient.cancelQueries({
        queryKey: [PROJECT_QUERY_KEY, userId],
      });
      const previousProjects = queryClient.getQueryData([
        PROJECT_QUERY_KEY,
        userId,
      ]);

      queryClient.setQueryData(
        [PROJECT_QUERY_KEY, userId],
        (old: ExtendedProject[] | undefined) => {
          if (!old) return [];
          return old.filter((project) => project.id !== deletedId);
        }
      );

      return { previousProjects };
    },
    onSuccess: () => {
      toast({
        title: "Project Deleted",
        description: "Project deleted successfully",
        duration: 3000,
      });
      queryClient.invalidateQueries({ queryKey: [PROJECT_QUERY_KEY, userId] });
    },
    onError: (error: any, _, context) => {
      queryClient.setQueryData(
        [PROJECT_QUERY_KEY, userId],
        context?.previousProjects
      );
      toast({
        title: "Project Not Deleted",
        description:
          error.message || "An error occurred while deleting the project.",
        duration: 3000,
        variant: "destructive",
      });
    },
  });
};

// Generic mutation factory for adding and removing entities from projects
const createEntityMutation = ({
  entityType,
  action,
  serviceFn,
}: EntityMutationConfig) => {
  return () => {
    const { data: session } = useSession();
    const queryClient = useQueryClient();
    const { toast } = useToast();
    const userId = session?.user?.id;

    return useMutation({
      mutationFn: async ({
        entityId,
        projectId,
      }: {
        entityId: string;
        projectId: string;
      }) => {
        validateSession(session);
        const response = await serviceFn(entityId, projectId);
        if (!response.success) throw new Error(response.message);
        return response;
      },
      onSuccess: () => {
        const actionText = action === "add" ? "added to" : "removed from";
        toast({
          title: `${entityType.charAt(0).toUpperCase() + entityType.slice(1)} ${
            action === "add" ? "Added" : "Removed"
          }`,
          description: `${
            entityType.charAt(0).toUpperCase() + entityType.slice(1)
          } ${actionText} project successfully`,
          duration: 3000,
        });
        queryClient.invalidateQueries({
          queryKey: [PROJECT_QUERY_KEY, userId],
        });
      },
      onError: (error: any) => {
        const actionText = action === "add" ? "adding" : "removing";
        toast({
          title: `Failed to ${action} ${entityType}`,
          description:
            error.message ||
            `An error occurred while ${actionText} ${entityType} ${
              action === "add" ? "to" : "from"
            } project.`,
          duration: 3000,
          variant: "destructive",
        });
      },
    });
  };
};

// Entity mutations using the factory
export const useAddToDoToProject = createEntityMutation({
  entityType: "todo",
  action: "add",
  serviceFn: addToDoToProject,
});

export const useAddTaskToProject = createEntityMutation({
  entityType: "task",
  action: "add",
  serviceFn: addTaskToProject,
});

export const useAddHabitToProject = createEntityMutation({
  entityType: "habit",
  action: "add",
  serviceFn: addHabitToProject,
});

export const useRemoveToDoFromProject = createEntityMutation({
  entityType: "todo",
  action: "remove",
  serviceFn: deleteToDoFromProject,
});

export const useRemoveTaskFromProject = createEntityMutation({
  entityType: "task",
  action: "remove",
  serviceFn: deleteTaskFromProject,
});

export const useRemoveHabitFromProject = createEntityMutation({
  entityType: "habit",
  action: "remove",
  serviceFn: deleteHabitFromProject,
});
