import { ExtendedTask } from "@/types/Entitities";
import TaskListItem from "../Tasks/TaskListItem";

const ExampleTask = () => {
  const taskData: ExtendedTask = {
    id: "cm7ou6cdl000diwzkh1s4m7eu",
    name: "I want to finish my book in 30 days",
    description: "Read for a total of 300 minutes over the next 30 days.",
    colorCode: "#4B0082",
    completed: false,
    completedDuration: 100,
    goalDuration: 300,
    startDate: new Date(),
    endDate: new Date(new Date().setDate(new Date().getDate() + 30)),
    categoryId: "cm7ou69ru0005iwzkyslylsvv",
    userId: "1",
    projectId: null,
    category: {
      id: "cm7ou69ru0005iwzkyslylsvv",
      name: "Finishing the Book",
      date: new Date("2025-02-28T16:55:55.057Z"),
      userId: "1",
    },
  };

  return (
    <div className="w-full">
      <h2 className="text-xl font-semibold">Create Your Tasks</h2>
      <p className="text-sm text-muted-foreground">
        Want to finish your book? Create a task to track your progress.
      </p>
      <p className="text-sm text-muted-foreground mb-4">
        Below is a sample task that helps you stay on track by showing your
        progress.
      </p>
      <TaskListItem task={taskData} mode="light" />
    </div>
  );
};

export default ExampleTask;
