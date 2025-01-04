"use server";

import { checkIsProjectExistByProjectName } from "@/helpers/project";
import prisma from "@/lib/prisma";
import { logService } from "@/lib/utils";
import { Project } from "@prisma/client";

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
