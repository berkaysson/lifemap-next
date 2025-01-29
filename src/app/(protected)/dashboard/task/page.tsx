import DashboardHeader from "@/layouts/sidebar/dashboard-header";
import TaskForm from "@/components/Tasks/TaskForm";
import TaskList from "@/components/Tasks/TaskList";

const TaskPage = () => {
  return (
    <div>
      <DashboardHeader title="Task" DialogComponent={<TaskForm />} />

      <TaskList />
    </div>
  );
};

export default TaskPage;
