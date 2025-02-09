import DashboardHeader from "@/layouts/sidebar/dashboard-header";
import TaskForm from "@/components/Tasks/TaskForm";
import TaskList from "@/components/Tasks/TaskList";
import Loading from "./loading";
import { Suspense } from "react";

const TaskPage = () => {
  return (
    <div>
      <DashboardHeader title="Task" DialogComponent={<TaskForm />} />

      <Suspense fallback={<Loading />}>
        <TaskList />
      </Suspense>
    </div>
  );
};

export default TaskPage;
