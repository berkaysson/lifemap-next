import DashboardHeader from "@/components/Dashboard/dashboard-header";
import ProjectForm from "@/components/Projects/ProjectForm";
import ProjectList from "@/components/Projects/ProjectList";

const ProjectPage = () => {
  return (
    <div>
      <DashboardHeader title="Project" />

      <ProjectList />

      <ProjectForm />
    </div>
  );
};

export default ProjectPage;
