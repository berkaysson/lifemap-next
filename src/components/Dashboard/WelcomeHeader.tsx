"use client";

import { useSession } from "next-auth/react";
import React from "react";

export const WelcomeHeader = () => {
  const { data: session } = useSession();
  return (
    <div className="bg-gradient-to-r from-secondary to-white rounded-lg shadow-lg p-6 mb-6 sm:mb-8 text-black text-center sm:text-left">
      <h2 className="text-xl sm:text-2xl font-bold mb-2 sm:mb-4">
        Welcome back, {session?.user?.name || "User"}
      </h2>
    </div>
  );
};
