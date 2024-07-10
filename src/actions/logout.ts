"use server";

import { signOut } from "@/auth";

export const logout = async () => {
  // Sign out the user
  await signOut();
};
