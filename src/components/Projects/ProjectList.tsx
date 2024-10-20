"use client";

import { ProjectContext } from "@/contexts/ProjectContext";
import { useCallback, useContext, useEffect, useState } from "react";
import ProjectListItem from "./ProjectListItem";
import { sortArrayOfObjectsByKey } from "@/lib/utils";
import SelectSort from "../ui/SelectSort";
import { ExtendedProject } from "@/types/Entitities";

const ProjectList = () => {
  const { projects } = useContext(ProjectContext);
  const [sortedProjects, setSortedProjects] = useState(projects);

  useEffect(() => {
    setSortedProjects(projects);
  }, [projects]);

  const handleSort = useCallback(
    (sortBy: keyof ExtendedProject, direction: "asc" | "desc") => {
      const sorted = sortArrayOfObjectsByKey<ExtendedProject>(
        projects,
        sortBy,
        direction
      );
      setSortedProjects(sorted);
    },
    [projects]
  );

  return (
    <div className="flex flex-col gap-2 m-2">
      <SelectSort
        options={[
          { value: "name", label: "Name" },
        ]}
        onSelect={handleSort}
      />
      <ul className="border rounded-sm">
        {sortedProjects.map((project) => (
          <ProjectListItem key={project.id} project={project} />
        ))}
      </ul>
    </div>
  );
};

export default ProjectList;
