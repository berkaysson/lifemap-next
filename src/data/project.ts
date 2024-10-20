import prisma from "@/lib/prisma";

export const checkIsProjectExistByProjectName = async (
  projectName: string,
  userId: string,
  projectId?: string
) => {
  const project = await prisma.project.findFirst({
    where: { name: projectName, userId, NOT: { id: projectId } },
  });
  if (!project) return false;
  return true;
};
