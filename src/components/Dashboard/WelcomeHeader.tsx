"use client";

import { useSession } from "next-auth/react";
import React from "react";
import { WeeklyActivitiesSummaryRadialChart } from "../Progress/WeeklyActivitiesSummaryRadialChart";

export const WelcomeHeader = () => {
  const { data: session } = useSession();
  const currentHour = new Date().getHours();
  const greeting =
    currentHour < 12
      ? "Good morning"
      : currentHour < 17
      ? "Good afternoon"
      : "Good evening";

  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 rounded-2xl shadow-2xl p-6 sm:p-8 mb-6 sm:mb-8 text-white">
      {/* Animated background elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent"></div>
      <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-16 translate-x-16 animate-pulse"></div>
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-12 -translate-x-12 animate-pulse delay-1000"></div>

      <div className="relative z-10 text-center sm:text-left">
        <p className="text-white/80 text-sm sm:text-base font-medium mb-2 animate-fade-in">
          {greeting}
        </p>
        <h2 className="text-2xl sm:text-4xl font-bold mb-3 sm:mb-4 bg-gradient-to-r from-white to-white/90 bg-clip-text text-transparent animate-slide-up">
          Welcome back, {session?.user?.name || "User"}!
        </h2>
        <p className="text-white/70 text-sm sm:text-base animate-fade-in delay-300">
          Ready to tackle your goals today?
        </p>
      </div>

      <div className="relative z-10 mt-4">
        <WeeklyActivitiesSummaryRadialChart />
      </div>
    </div>
  );
};
