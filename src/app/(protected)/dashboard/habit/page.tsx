import DashboardHeader from "@/layouts/sidebar/dashboard-header";
import HabitForm from "@/components/Habits/HabitForm";
import HabitList from "@/components/Habits/HabitList";
import Loading from "./loading";
import { Suspense } from "react";

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
