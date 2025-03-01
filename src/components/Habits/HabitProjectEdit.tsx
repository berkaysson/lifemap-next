"use client";

import type { Habit } from "@prisma/client";
import { type JSX, useEffect, useState } from "react";
import { Label } from "../ui/Forms/label";
import ProjectSelect from "../ui/Shared/ProjectSelect";
import { LoadingButton } from "../ui/Buttons/loading-button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  useAddHabitToProject,
  useRemoveHabitFromProject,
} from "@/queries/projectQueries";
import { toast } from "../ui/Misc/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import { HABIT_QUERY_KEY } from "@/queries/habitQueries";

interface HabitProjectEditProps {
  habit: Habit;
  triggerButton: JSX.Element;
}

const HabitProjectEdit = ({ habit, triggerButton }: HabitProjectEditProps) => {
  const queryClient = useQueryClient();

  const [error, setError] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(
    habit.projectId
  );
  const [isLoading, setIsLoading] = useState(false);

  const { mutateAsync: addHabitToProject } = useAddHabitToProject();
  const { mutateAsync: removeHabitFromProject } = useRemoveHabitFromProject();

  const handleSubmit = async () => {
    setError(null);
    setIsLoading(true);

    try {
      // If there was a previous project, remove the habit from it
      if (habit.projectId) {
        await removeHabitFromProject({
          entityId: habit.id,
          projectId: habit.projectId,
        });
      }

      // If a new project is selected, add the habit to it
      if (selectedProjectId) {
        await addHabitToProject({
          entityId: habit.id,
          projectId: selectedProjectId,
        });
      }
      toast({
        title: "Project Updated",
        description: "Habit project assignment updated successfully",
        duration: 3000,
      });
      queryClient.invalidateQueries({
        queryKey: [HABIT_QUERY_KEY, habit.userId],
      });
    } catch (error: any) {
      setError("An error occurred while updating the habit project.");
      toast({
        title: "Error",
        description: "Failed to update habit project",
        variant: "destructive",
        duration: 3000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    setSelectedProjectId(null);
    setError(null);
  }, []);
  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>{triggerButton}</PopoverTrigger>
      <PopoverContent className="w-80 p-4">
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-medium">Edit Habit Project</h3>
            <p className="text-sm text-muted-foreground">
              Select a new project for this habit
            </p>
          </div>

          <div className="flex flex-col gap-2">
            <Label>Project</Label>
            <ProjectSelect
              defaultValue={habit.projectId || ""}
              onSelect={setSelectedProjectId}
              value={selectedProjectId || ""}
            />

            {error && <p className="text-sm text-red-500">{error}</p>}

            <div className="flex justify-end mt-2">
              <LoadingButton
                isLoading={isLoading}
                loadingText="Saving..."
                variant={"outline"}
                size={"sm"}
                onClick={handleSubmit}
              >
                Save
              </LoadingButton>
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default HabitProjectEdit;
