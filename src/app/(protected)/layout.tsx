"use client";

import { TodoProvider } from "@/contexts/TodoContext";
import Link from "next/link";

const ProtectedLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <TodoProvider>
      <nav className="flex gap-4 p-4 border-b">
        <Link href="/dashboard" className="font-bold text-lg hover:underline">
          Dashboard
        </Link>
        <Link href="/settings" className="font-bold text-lg hover:underline">
          Settings
        </Link>
      </nav>
      {children}
    </TodoProvider>
  );
};

export default ProtectedLayout;
