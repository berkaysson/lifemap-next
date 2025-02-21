import DashboardHeader from "@/layouts/sidebar/dashboard-header";
import TaskList from "@/components/Tasks/TaskList";
import Loading from "./loading";
import { Suspense, lazy } from "react";

const TaskForm = lazy(() => import("@/components/Tasks/TaskForm"));

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
