import DashboardHeader from "@/layouts/sidebar/dashboard-header";
import TaskForm from "@/components/Tasks/TaskForm";
import TaskList from "@/components/Tasks/TaskList";

const TaskPage = () => {
  return (
    <div>
      <DashboardHeader title="Task" />

      <TaskList />

      <TaskForm />
    </div>
  );
};

export default TaskPage;
