import DashboardHeader from "@/layouts/sidebar/dashboard-header";
import ProjectList from "@/components/Projects/ProjectList";
import Loading from "./loading";
import { Suspense, lazy } from "react";

const ProjectForm = lazy(() => import("@/components/Projects/ProjectForm"));

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
