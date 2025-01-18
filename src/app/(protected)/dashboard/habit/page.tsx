import DashboardHeader from "@/components/Dashboard/dashboard-header";
import HabitForm from "@/components/Habits/HabitForm";
import HabitList from "@/components/Habits/HabitList";

const HabitPage = () => {
  return (
    <div>
      <DashboardHeader title="Habit" />

      <HabitList />

      <HabitForm />
    </div>
  );
};

export default HabitPage;
