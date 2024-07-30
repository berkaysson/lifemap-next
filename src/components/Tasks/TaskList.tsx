"use client";

import { useContext } from "react";
import TaskListItem from "./TaskListItem";
import { TaskContext } from "@/contexts/TaskContext";

const TaskList = () => {
  const { tasks } = useContext(TaskContext);
  return (
    <div className="flex flex-col gap-2 m-2 border rounded-sm">
      {tasks.map((task) => (
        <TaskListItem key={task.id} task={task} />
      ))}
    </div>
  );
};

export default TaskList;
