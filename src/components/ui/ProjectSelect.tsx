import React, { useEffect, useState } from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "./select";
import { useFetchProjects } from "@/queries/projectQueries";

interface ProjectSelectProps {
  onSelect: (projectId: string) => void;
  defaultValue?: string;
}

const ProjectSelect: React.FC<ProjectSelectProps> = ({
  onSelect,
  defaultValue,
}) => {
  const { data: projects = [] } = useFetchProjects();
  const [selectedProjectId, setSelectedProjectId] = useState("");

  const handleProjectChange = (projectId: string) => {
    setSelectedProjectId(projectId);
    onSelect(projectId);
  };

  useEffect(() => {
    if (defaultValue) {
      setSelectedProjectId(defaultValue);
      onSelect(defaultValue);
    }
  }, [defaultValue, onSelect]);

  const selectedProjectName =
    projects.find((project) => project.id === defaultValue)?.name ||
    "Select a Project";

  return (
    <div className="flex flex-col gap-2">
      {projects.length > 0 ? (
        <Select onValueChange={handleProjectChange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder={selectedProjectName} />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Projects</SelectLabel>
              {projects.map((project) => (
                <SelectItem key={project.id} value={project.id}>
                  {project.name}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      ) : (
        <p>No projects found</p>
      )}
    </div>
  );
};

export default ProjectSelect;
