"use server";

import { checkIsProjectExistByProjectName } from "@/helpers/project";
import prisma from "@/lib/prisma";
import { logService } from "@/lib/utils";
import { ProjectSchema } from "@/schema";
import { Project } from "@prisma/client";
import { z } from "zod";

export const createProject = async (
  newProject: z.infer<typeof ProjectSchema>,
  userId: string
) => {
  logService("createProject");
  const validatedFields = ProjectSchema.safeParse(newProject);

  if (!validatedFields.success) {
    return { message: "Invalid fields!", success: false };
  }

  const isProjectExist = await checkIsProjectExistByProjectName(
    newProject.name,
    userId
  );

  if (isProjectExist) {
    return {
      message: "Project already exists",
      success: false,
    };
  }

  try {
    await prisma.project.create({
      data: {
        name: newProject.name,
        description: newProject.description,
        userId,
      },
    });

    return {
      message: "Successfully created project",
      success: true,
    };
  } catch (error) {
    return {
      message: `Failed to create project: ${error}`,
      success: false,
    };
  }
};

export const getProjects = async (userId: string) => {
  logService("getProjects");
  if (!userId) {
    return {
      message: "userId is required",
      success: false,
    };
  }
  try {
    const projects = await prisma.project.findMany({
      where: {
        userId,
      },
      include: {
        todos: true,
        tasks: true,
        habits: true,
      },
    });
    return {
      message: "Successfully fetched projects",
      success: true,
      projects,
    };
  } catch (error) {
    return {
      message: `Failed to fetch projects: ${error}`,
      success: false,
    };
  }
};

export const updateProject = async (data: Project) => {
  logService("updateProject");
  if (!data || !data.name || !data.id) {
    return {
      message: "data is required",
      success: false,
    };
  }

  const isProjectExist = await checkIsProjectExistByProjectName(
    data.name,
    data.userId,
    data.id
  );

  if (isProjectExist) {
    return {
      message: "Project already exists",
      success: false,
    };
  }

  try {
    await prisma.project.update({
      where: {
        id: data.id,
      },
      data: data,
    });
    return {
      message: "Successfully updated project",
      success: true,
    };
  } catch (error) {
    return {
      message: `Failed to update project: ${error}`,
      success: false,
    };
  }
};

export const deleteProject = async (id: string) => {
  logService("deleteProject");
  if (!id) {
    return {
      message: "id is required",
      success: false,
    };
  }

  try {
    await prisma.project.delete({
      where: {
        id: id,
      },
    });
    return {
      message: "Successfully deleted project",
      success: true,
    };
  } catch (error) {
    return {
      message: `Failed to delete project: ${error}`,
      success: false,
    };
  }
};

export const addToDoToProject = async (todoId: string, projectId: string) => {
  logService("addToDoToProject");
  try {
    const project = await prisma.project.update({
      where: {
        id: projectId,
      },
      data: {
        todos: {
          connect: {
            id: todoId,
          },
        },
      },
    });
    return {
      message: "Successfully added todo to project",
      success: true,
      project,
    };
  } catch (error) {
    return {
      message: `Failed to add todo to project: ${error}`,
      success: false,
    };
  }
};

export const deleteToDoFromProject = async (
  todoId: string,
  projectId: string
) => {
  logService("deleteToDoFromProject");
  try {
    const project = await prisma.project.update({
      where: {
        id: projectId,
      },
      data: {
        todos: {
          disconnect: {
            id: todoId,
          },
        },
      },
    });
    return {
      message: "Successfully removed todo from project",
      success: true,
      project,
    };
  } catch (error) {
    return {
      message: `Failed to remove todo from project: ${error}`,
      success: false,
    };
  }
};

export const addTaskToProject = async (taskId: string, projectId: string) => {
  logService("addTaskToProject");
  try {
    const project = await prisma.project.update({
      where: {
        id: projectId,
      },
      data: {
        tasks: {
          connect: {
            id: taskId,
          },
        },
      },
    });
    return {
      message: "Successfully added task to project",
      success: true,
      project,
    };
  } catch (error) {
    return {
      message: `Failed to add task to project: ${error}`,
      success: false,
    };
  }
};

export const deleteTaskFromProject = async (
  taskId: string,
  projectId: string
) => {
  logService("deleteTaskFromProject");
  try {
    const project = await prisma.project.update({
      where: {
        id: projectId,
      },
      data: {
        tasks: {
          disconnect: {
            id: taskId,
          },
        },
      },
    });
    return {
      message: "Successfully removed task from project",
      success: true,
      project,
    };
  } catch (error) {
    return {
      message: `Failed to remove task from project: ${error}`,
      success: false,
    };
  }
};

export const addHabitToProject = async (habitId: string, projectId: string) => {
  logService("addHabitToProject");
  try {
    const project = await prisma.project.update({
      where: {
        id: projectId,
      },
      data: {
        habits: {
          connect: {
            id: habitId,
          },
        },
      },
    });
    return {
      message: "Successfully added habit to project",
      success: true,
      project,
    };
  } catch (error) {
    return {
      message: `Failed to add habit to project: ${error}`,
      success: false,
    };
  }
};

export const deleteHabitFromProject = async (
  habitId: string,
  projectId: string
) => {
  logService("deleteHabitFromProject");
  try {
    const project = await prisma.project.update({
      where: {
        id: projectId,
      },
      data: {
        habits: {
          disconnect: {
            id: habitId,
          },
        },
      },
    });
    return {
      message: "Successfully removed habit from project",
      success: true,
      project,
    };
  } catch (error) {
    return {
      message: `Failed to remove habit from project: ${error}`,
      success: false,
    };
  }
};
