"use client";

import { Button } from "../ui/Buttons/button";
import { formatDateFriendly, getRemainingTime, isExpired } from "@/lib/time";
import IsCompleted from "../ui/Shared/IsCompleted";
import ColorCircle from "../ui/Shared/ColorCircle";
import TodoEditForm from "./TodoEditForm";
import ButtonWithConfirmation from "../ui/Buttons/ButtonWithConfirmation";
import {
  useDeleteTodo,
  useUpdateTodo,
  useArchiveTodo,
} from "@/queries/todoQueries";
import { useFetchProjects } from "@/queries/projectQueries";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Badge } from "../ui/badge";
import { Iconify } from "../ui/iconify";
import { LoadingButton } from "../ui/Buttons/loading-button";
import { Separator } from "../ui/separator";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../ui/accordion";

const TodoListItem = ({ todo }) => {
  const { data: projects = [] } = useFetchProjects();
  const { mutateAsync: deleteTodo } = useDeleteTodo();
  const updateTodoMutation = useUpdateTodo();
  const { mutateAsync: archiveTodo } = useArchiveTodo();

  const todoProject = projects.find((project) => project.id === todo.projectId);
  const expired = isExpired(todo.endDate);
  const remained = todo.endDate && getRemainingTime(todo.endDate);

  const handleDelete = async () => {
    await deleteTodo(todo.id);
  };

  const handleComplete = async () => {
    const updatedTodo = { ...todo, completed: !todo.completed };
    await updateTodoMutation.mutateAsync(updatedTodo);
  };

  const handleArchive = async () => {
    await archiveTodo(todo.id);
  };

  return (
    <Card className="w-full max-w-md">
      <div className="flex justify-between p-1 pb-0">
        <ColorCircle colorCode={todo.colorCode || "darkblue"} />
        <Badge
          variant="outline"
          style={{ backgroundColor: todo.colorCode || "darkblue" }}
          className="text-white"
        >
          {todoProject ? todoProject.name : "No Project"}
        </Badge>
      </div>

      <CardHeader className="p-3 pt-1">
        <div className="flex items-center justify-between">
          <CardTitle className="text-md font-semibold flex items-center gap-1">
            <span className="mr-2 text-xl flex gap-2">
              <LoadingButton
                isLoading={updateTodoMutation.isPending}
                loadingText=""
                variant={"outline"}
                size={"icon"}
                onClick={handleComplete}
              >
                <IsCompleted isCompleted={todo.completed} isExpired={expired} />
              </LoadingButton>
            </span>
            {todo.name}
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent className="px-3">
        <CardDescription>{todo.description}</CardDescription>
        <div className="flex flex-col gap-2">
          {todo.endDate && (
            <div className="flex items-center text-sm text-muted-foreground">
              <Iconify
                icon="solar:calendar-date-bold"
                width={20}
                className="mr-2"
              />
              {formatDateFriendly(todo.endDate)}
            </div>
          )}
          {!todo.completed && todo.endDate && (
            <div className="flex items-center text-sm text-muted-foreground">
              <Iconify
                icon="solar:stopwatch-bold"
                width={20}
                className="mr-2"
              />
              <span>
                {remained} {expired ? "expired" : "remaining"}
              </span>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="px-3 pb-1">
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="actions">
            <AccordionTrigger>Actions</AccordionTrigger>
            <AccordionContent>
              <div className="flex flex-wrap gap-2">
                <TodoEditForm
                  initialValues={todo}
                  triggerButton={
                    <Button variant="outline" size="sm">
                      <Iconify
                        icon="solar:pen-new-square-bold-duotone"
                        width={16}
                        className="mr-1"
                      />
                      Edit
                    </Button>
                  }
                />
                <Separator orientation="vertical" className="h-9" />
                <ButtonWithConfirmation
                  variant="destructive"
                  size="sm"
                  buttonText="Delete"
                  onConfirm={handleDelete}
                  icon="solar:trash-bin-trash-bold"
                />
                <ButtonWithConfirmation
                  variant="destructive"
                  size="sm"
                  buttonText="Archive"
                  onConfirm={handleArchive}
                  icon="solar:archive-bold"
                />
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </CardFooter>
    </Card>
  );
};

export default TodoListItem;
