import DashboardHeader from "@/layouts/sidebar/dashboard-header";
import ProjectForm from "@/components/Projects/ProjectForm";
import ProjectList from "@/components/Projects/ProjectList";

const ProjectPage = () => {
  return (
    <div>
      <DashboardHeader title="Project" DialogComponent={<ProjectForm />} />

      <ProjectList />
    </div>
  );
};

export default ProjectPage;
