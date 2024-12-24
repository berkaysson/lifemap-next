import TaskForm from "@/components/Tasks/TaskForm";
import TaskList from "@/components/Tasks/TaskList";

const TaskPage = () => {
  return (
    <div>
      <TaskList />

      <TaskForm />
    </div>
  );
};

export default TaskPage;
