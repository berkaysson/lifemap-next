"use client";

import { useSession } from "next-auth/react";
import React, { useEffect, useState } from "react";
import { format } from "date-fns";
import {
  Sun,
  Moon,
  CloudSun,
  Sparkles,
  Calendar,
  BarChart3,
} from "lucide-react";
import Link from "next/link";

export const WelcomeHeader = () => {
  const { data: session } = useSession();
  const [mounted, setMounted] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    setMounted(true);
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  if (!mounted) return null;

  const currentHour = currentTime.getHours();

  const getGreetingData = () => {
    if (currentHour < 12)
      return {
        text: "Good morning",
        Icon: Sun,
        color: "text-amber-500",
        bg: "bg-amber-500/10",
      };
    if (currentHour < 18)
      return {
        text: "Good afternoon",
        Icon: CloudSun,
        color: "text-orange-500",
        bg: "bg-orange-500/10",
      };
    return {
      text: "Good evening",
      Icon: Moon,
      color: "text-indigo-500",
      bg: "bg-indigo-500/10",
    };
  };

  const { text: greeting, Icon, color, bg } = getGreetingData();
  const userName = session?.user?.name?.split(" ")[0] || "User";

  return (
    <div className="relative mb-2">
      <div className="group relative flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 sm:p-5 rounded-2xl bg-card border border-border/50 shadow-sm transition-all duration-300 hover:shadow-md hover:border-primary/20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

        <div className="relative z-10 flex items-center gap-4">
          <div
            className={`flex-shrink-0 w-12 h-12 rounded-xl ${bg} flex items-center justify-center border border-border/20 transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3`}
          >
            <Icon className={`w-6 h-6 ${color}`} />
          </div>

          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] sm:text-xs font-bold uppercase tracking-widest text-muted-foreground/80">
                {greeting}
              </span>
              <span className="w-1 h-1 rounded-full bg-border" />
              <div className="flex items-center gap-1.5 text-[10px] sm:text-xs font-medium text-muted-foreground/80">
                <Calendar className="w-3 h-3" />
                {format(currentTime, "EEEE, MMMM do")}
              </div>
            </div>

            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
              Welcome back,{" "}
              <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                {userName}
              </span>
              <Sparkles className="w-5 h-5 text-amber-400" />
            </h2>
          </div>
        </div>

        <Link
          href="/dashboard/progress"
          className="hover:border-secondary border-2 border-solid border-primary relative z-10 flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-primary/10 to-secondary/10"
        >
          <BarChart3 className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
          <span className="text-xs sm:text-sm font-semibold text-primary">
            Progress
          </span>
        </Link>
      </div>
    </div>
  );
};
