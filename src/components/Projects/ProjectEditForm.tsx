import { ProjectContext } from "@/contexts/ProjectContext";
import { Project } from "@prisma/client";
import { useContext, useEffect, useState } from "react";
import ModalDialog from "../ui/ModalDialog";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";

interface ProjectEditFormProps {
  initialValues: Project;
  triggerButton: JSX.Element;
}

const ProjectEditForm = ({
  initialValues,
  triggerButton,
}: ProjectEditFormProps) => {
  const [error, setError] = useState<string | null>(null);
  const { onUpdateProject } = useContext(ProjectContext);
  const [isOpen, setIsOpen] = useState(false);
  const [newProject, setNewProject] = useState<Project>(initialValues);

  const handleSubmit = async () => {
    setError(null);

    const response = await onUpdateProject(newProject);
    if (response.success) {
      setIsOpen(false);
    } else {
      setError(response.message);
    }
  };

  const handleFieldChange = (value: any, field: keyof Project) => {
    if (initialValues[field] === value) return;
    setNewProject({ ...newProject, [field]: value });
  };

  useEffect(() => {
    setNewProject({
      ...initialValues,
    });
    setError(null);
  }, [isOpen]);

  return (
    <ModalDialog
      triggerButton={triggerButton}
      title="Edit project"
      description="Edit your project or new tasks, todos, and habits"
      isOpen={isOpen}
      setIsOpen={setIsOpen}
    >
      <div className="flex flex-col gap-2">
        <Label>Name</Label>
        <Input
          type="text"
          defaultValue={initialValues.name}
          onChange={(e) => handleFieldChange(e.target.value, "name")}
          min={3}
          placeholder="My project..."
        />

        <Label>Description</Label>
        <Input
          type="text"
          defaultValue={initialValues.description || ""}
          onChange={(e) => handleFieldChange(e.target.value, "description")}
          min={3}
          placeholder="My project is a great project..."
        />

        {error && <p className="text-red-500">{error}</p>}

        <Button variant={"outline"} size={"sm"} onClick={handleSubmit}>
          Save
        </Button>
      </div>
    </ModalDialog>
  );
};

export default ProjectEditForm;
