import DashboardHeader from "@/layouts/sidebar/dashboard-header";
import HabitForm from "@/components/Habits/HabitForm";
import HabitList from "@/components/Habits/HabitList";

const HabitPage = () => {
  return (
    <div>
      <DashboardHeader title="Habit" DialogComponent={<HabitForm />} />

      <HabitList />
    </div>
  );
};

export default HabitPage;
