"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import ButtonWithConfirmation from "@/components/ui/Buttons/ButtonWithConfirmation";
import { formatDateFriendly } from "@/lib/time";
import { Tooltip } from "@mui/material";
import { Badge } from "../ui/badge";
import { useDeleteArchivedTodo } from "@/queries/todoQueries";
import { useFetchProjects } from "@/queries/projectQueries";
import ColorCircle from "../ui/Shared/ColorCircle";
import IsCompleted from "../ui/Shared/IsCompleted";
import { Iconify } from "../ui/iconify";
import { ScrollArea, ScrollBar } from "../ui/scroll-area";

const ArchiveTodoTable = ({ sortedTodos }: { sortedTodos: any[] }) => {
  const { mutateAsync: deleteArchivedTodo } = useDeleteArchivedTodo();
  const { data: projects = [] } = useFetchProjects();

  const handleDelete = async (todo: any) => {
    await deleteArchivedTodo(todo.id);
  };

  return (
    <div className="space-y-4 flex">
      <ScrollArea type="always" className="w-1 flex-1">
        <div className="w-full whitespace-nowrap">
          <Table className="relative min-w-full">
            <TableHeader>
              <TableRow>
                <TableHead></TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Project</TableHead>
                <TableHead>Due Date</TableHead>
                <TableHead>Archived At</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedTodos.map((todo) => {
                const todoProject = projects.find(
                  (project) => project.id === todo.projectId
                );

                return (
                  <TableRow key={todo.id}>
                    <TableCell>
                      <IsCompleted
                        isCompleted={todo.completed}
                        isExpired={false}
                      />
                    </TableCell>
                    <TableCell className="max-w-sm truncate">
                      <ColorCircle colorCode={todo.colorCode || "darkblue"} />
                      <span className="ml-1">
                        {todo.description ? (
                          <Tooltip arrow title={todo.description}>
                            <span className="underline">{todo.name}</span>
                          </Tooltip>
                        ) : (
                          todo.name
                        )}
                      </span>
                    </TableCell>
                    <TableCell>
                      {todoProject && (
                        <Badge
                          tooltipText="Project"
                          variant="outline"
                          style={{
                            backgroundColor: todo.colorCode || "darkblue",
                          }}
                          className="text-white whitespace-nowrap"
                        >
                          <Iconify
                            icon="solar:folder-with-files-bold"
                            width={14}
                            className="mr-1"
                          />
                          {todoProject.name}
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      {todo.endDate && formatDateFriendly(todo.endDate)}
                    </TableCell>
                    <TableCell>
                      {todo.archivedAt && formatDateFriendly(todo.archivedAt)}
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <ButtonWithConfirmation
                          variant="destructive"
                          size="sm"
                          buttonText=""
                          onConfirm={() => handleDelete(todo)}
                          icon="solar:trash-bin-trash-bold"
                        />
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </div>
  );
};

export default ArchiveTodoTable;
