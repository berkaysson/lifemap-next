"use server";

import { checkIsProjectExistByProjectName } from "@/data/project";
import prisma from "@/lib/prisma";
import { ProjectSchema } from "@/schema";
import { Project } from "@prisma/client";
import { z } from "zod";

export const createProject = async (
  newProject: z.infer<typeof ProjectSchema>,
  userId: string
) => {
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
    return project;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const deleteToDoFromProject = async (
  todoId: string,
  projectId: string
) => {
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
    return project;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const addTaskToProject = async (taskId: string, projectId: string) => {
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
    return project;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const deleteTaskFromProject = async (
  taskId: string,
  projectId: string
) => {
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
    return project;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const addHabitToProject = async (habitId: string, projectId: string) => {
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
    return project;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const deleteHabitFromProject = async (
  habitId: string,
  projectId: string
) => {
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
    return project;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
