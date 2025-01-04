"use server";

import { checkIsProjectExistByProjectName } from "@/helpers/project";
import prisma from "@/lib/prisma";
import { logService } from "@/lib/utils";
import { ProjectSchema } from "@/schema";
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
