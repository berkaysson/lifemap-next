import React, { useEffect } from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "../select";
import { useFetchProjects } from "@/queries/projectQueries";
import { X } from "lucide-react";
import { Button } from "../Buttons/button";

interface ProjectSelectProps {
  onSelect: (value: string | null) => void;
  defaultValue?: string;
  value?: string;
}

const ProjectSelect: React.FC<ProjectSelectProps> = ({
  onSelect,
  defaultValue,
  value,
}) => {
  const { data: projects = [] } = useFetchProjects();

  useEffect(() => {
    if (defaultValue) {
      onSelect(defaultValue || null);
    }
  }, [defaultValue, onSelect]);

  const selectedProjectName =
    projects.find((project) => project.id === defaultValue)?.name ||
    "Select a Project";

  return (
    <div className="flex flex-col gap-2">
      {projects.length > 0 ? (
        <div className="flex items-center gap-1">
          <Select
            value={value || ""}
            onValueChange={(val) => onSelect(val || null)}
            defaultValue={defaultValue}
          >
            <SelectTrigger className="w-[200px] relative">
              <SelectValue placeholder={selectedProjectName} />
            </SelectTrigger>
            <SelectContent className="bg-background brightness-110">
              <SelectGroup>
                <SelectLabel className="text-shade">Projects</SelectLabel>
                {projects.map((project) => (
                  <SelectItem
                    key={project.id}
                    value={project.id}
                    className="hover:bg-background hover:brightness-90"
                  >
                    {project.name}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
          {value && (
            <Button
              variant="default"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                onSelect(null);
              }}
              className="p-0 h-4 w-4 hover:w-5 hover:h-5"
            >
              <X className="h-3 w-3" />
            </Button>
          )}
        </div>
      ) : (
        <p>No projects found</p>
      )}
    </div>
  );
};

export default ProjectSelect;
