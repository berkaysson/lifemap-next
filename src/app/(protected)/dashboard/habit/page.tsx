import DashboardHeader from "@/layouts/sidebar/dashboard-header";
import HabitList from "@/components/Habits/HabitList";
import Loading from "./loading";
import { Suspense, lazy } from "react";

const HabitForm = lazy(() => import("@/components/Habits/HabitForm"));

const HabitPage = () => {
  return (
    <div>
      <DashboardHeader title="Habit" DialogComponent={<HabitForm />} />

      <Suspense fallback={<Loading />}>
        <HabitList />
      </Suspense>
    </div>
  );
};

export default HabitPage;
