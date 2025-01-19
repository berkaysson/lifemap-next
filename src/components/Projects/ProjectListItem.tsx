"use client";

import { useDeleteProject, useRemoveToDoFromProject, useRemoveTaskFromProject, useRemoveHabitFromProject } from "@/queries/projectQueries";
import ButtonWithConfirmation from "../ui/Buttons/ButtonWithConfirmation";
import { ExtendedProject } from "@/types/Entitities";
import ProjectEditForm from "./ProjectEditForm";
import { Button } from "../ui/Buttons/button";
import { useFetchTodos } from "@/queries/todoQueries";
import { useFetchTasks } from "@/queries/taskQueries";
import { useFetchHabits } from "@/queries/habitQueries";

const ProjectListItem = ({ project }: { project: ExtendedProject }) => {
  const deleteProjectMutation = useDeleteProject();
  const { data: todos } = useFetchTodos();
  const { data: tasks } = useFetchTasks();
  const { data: habits } = useFetchHabits();
  const removeToDoMutation = useRemoveToDoFromProject();
  const removeTaskMutation = useRemoveTaskFromProject();
  const removeHabitMutation = useRemoveHabitFromProject();

  const handleDelete = async () => {
    await deleteProjectMutation.mutateAsync(project.id);
  };

  const { todos: _, tasks: __, habits: ___, ...projectOnly } = project;
  const initialValues = { ...projectOnly };

  const tasksOfProject = project.tasks;

  const habitsOfProject = project.habits;

  const todosOfProject = project.todos;

  return (
    <li className="flex flex-col gap-2 p-4 border-b">
      <div className="flex flex-row gap-2">
        <span>{project.name}</span>
        <span>{project.description}</span>
      </div>
      <div>
        {todosOfProject.length > 0 && (
          <div>
            <h3>ToDos</h3>
            <ul>
              {project.todos.map((todo) => (
                <li key={todo.id} className="flex flex-row gap-2 items-center">
                  <span>{todo.name}</span>
                  <Button
                    variant={"outline"}
                    size={"sm"}
                    onClick={() => removeToDoMutation.mutate({ 
                      entityId: todo.id, 
                      projectId: project.id 
                    })}
                  >
                    Remove
                  </Button>
                </li>
              ))}
            </ul>
          </div>
        )}

        {tasksOfProject.length > 0 && (
          <div>
            <h3>Tasks</h3>
            <ul>
              {project.tasks.map((task) => (
                <li key={task.id} className="flex flex-row gap-2 items-center">
                  <span>{task.name}</span>
                  <Button
                    variant={"outline"}
                    size={"sm"}
                    onClick={() => removeTaskMutation.mutate({ 
                      entityId: task.id, 
                      projectId: project.id 
                    })}
                  >
                    Remove
                  </Button>
                </li>
              ))}
            </ul>
          </div>
        )}

        {habitsOfProject.length > 0 && (
          <div>
            <h3>Habits</h3>
            <ul>
              {project.habits.map((habit) => (
                <li key={habit.id} className="flex flex-row gap-2 items-center">
                  <span>{habit.name}</span>
                  <Button
                    variant={"outline"}
                    size={"sm"}
                    onClick={() => removeHabitMutation.mutate({ 
                      entityId: habit.id, 
                      projectId: project.id 
                    })}
                  >
                    Remove
                  </Button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
      <div className="flex flex-row gap-2">
        <ButtonWithConfirmation
          variant="destructive"
          size={"sm"}
          buttonText={"Delete"}
          onConfirm={handleDelete}
        />
        <ProjectEditForm
          initialValues={initialValues}
          triggerButton={
            <Button variant={"outline"} size={"sm"}>
              Edit
            </Button>
          }
        />
      </div>
    </li>
  );
};

export default ProjectListItem;
