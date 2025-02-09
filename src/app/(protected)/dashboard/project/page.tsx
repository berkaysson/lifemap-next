import DashboardHeader from "@/layouts/sidebar/dashboard-header";
import ProjectForm from "@/components/Projects/ProjectForm";
import ProjectList from "@/components/Projects/ProjectList";
import Loading from "./loading";
import { Suspense } from "react";

const ProjectPage = () => {
  return (
    <div>
      <DashboardHeader title="Project" DialogComponent={<ProjectForm />} />

      <Suspense fallback={<Loading />}>
        <ProjectList />
      </Suspense>
    </div>
  );
};

export default ProjectPage;
