"use server";

import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { logout } from "./logout";

export const deleteAccount = async () => {
  const session = await auth();
  if (!session || !session.user || !session.user.id) {
    throw new Error("Unauthorized");
  }

  try {
    await prisma.user.delete({
      where: {
        id: session.user.id,
      },
    });

    await logout();

    return { message: "Account deleted successfully", success: true };
  } catch (error) {
    console.error("Error while deleting user:", error);
    throw error;
  }
};
