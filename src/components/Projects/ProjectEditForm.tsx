import { Project } from "@prisma/client";
import { useState } from "react";
import ModalDialog from "../ui/ModalDialog";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useUpdateProject } from "@/queries/projectQueries";

interface ProjectEditFormProps {
  initialValues: Project;
  triggerButton: JSX.Element;
}

const ProjectEditForm = ({
  initialValues,
  triggerButton,
}: ProjectEditFormProps) => {
  const [error, setError] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [newProject, setNewProject] = useState<Project>(initialValues);
  const updateProjectMutation = useUpdateProject();

  const handleSubmit = async () => {
    setError(null);
    try {
      await updateProjectMutation.mutateAsync(newProject);
      setIsOpen(false);
    } catch (error: any) {
      setError(error.message || "Failed to update project");
    }
  };

  const handleFieldChange = (value: string, field: keyof Project) => {
    setNewProject((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <ModalDialog
      title="Edit Project"
      description="Edit your project"
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      triggerButton={triggerButton}
    >
      <div className="flex flex-col gap-4">
        <Label>Name</Label>
        <Input
          type="text"
          defaultValue={initialValues.name}
          onChange={(e) => handleFieldChange(e.target.value, "name")}
          min={3}
          placeholder="My project..."
          disabled={updateProjectMutation.isPending}
        />

        <Label>Description</Label>
        <Input
          type="text"
          defaultValue={initialValues.description || ""}
          onChange={(e) => handleFieldChange(e.target.value, "description")}
          min={3}
          placeholder="My project is a great project..."
          disabled={updateProjectMutation.isPending}
        />

        {error && <p className="text-red-500">{error}</p>}

        <Button 
          variant={"outline"} 
          size={"sm"} 
          onClick={handleSubmit}
          disabled={updateProjectMutation.isPending}
        >
          {updateProjectMutation.isPending ? "Saving..." : "Save"}
        </Button>
      </div>
    </ModalDialog>
  );
};

export default ProjectEditForm;
