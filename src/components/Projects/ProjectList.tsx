"use client";

import { useCallback, useEffect, useState } from "react";
import ProjectListItem from "./ProjectListItem";
import { sortArrayOfObjectsByKey } from "@/lib/utils";
import SelectSort from "../ui/Shared/SelectSort";
import { ExtendedProject } from "@/types/Entitities";
import { useFetchProjects } from "@/queries/projectQueries";

const ProjectList = () => {
  const { data: projects, isLoading, isError, error } = useFetchProjects();
  const [sortedProjects, setSortedProjects] = useState(projects || []);

  useEffect(() => {
    if (projects && projects.length > 0) {
      const sorted = sortArrayOfObjectsByKey<ExtendedProject>(
        projects,
        "name",
        "desc"
      );
      setSortedProjects(sorted);
    }
  }, [projects]);

  const handleSort = useCallback(
    (sortBy: keyof ExtendedProject, direction: "asc" | "desc") => {
      if (!projects) return;
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
        options={[{ value: "name", label: "Name" }]}
        onSelect={handleSort}
      />

      {isLoading && <div>Loading projects...</div>}
      {isError && <div>Error loading projects: {error.message}</div>}
      {sortedProjects.length === 0 && !isLoading && (
        <div className="opacity-80 mt-2">No projects found.</div>
      )}
      <ul className="rounded-sm grid grid-cols-1 gap-4">
        {sortedProjects.map((project) => (
          <ProjectListItem key={project.id} project={project} />
        ))}
      </ul>
    </div>
  );
};

export default ProjectList;
