"use client";

import { useForm } from "react-hook-form";
import { Button } from "../ui/Buttons/button";
import { Input } from "../ui/Forms/input";
import { ProjectSchema } from "@/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState } from "react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/Forms/form";
import { useCreateProject } from "@/queries/projectQueries";

const ProjectForm = () => {
  const createProjectMutation = useCreateProject();
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);

  const form = useForm<z.infer<typeof ProjectSchema>>({
    resolver: zodResolver(ProjectSchema),
    defaultValues: {
      name: "",
      description: "",
    },
  });

  const { reset } = form;

  const onSubmit = async (data: z.infer<typeof ProjectSchema>) => {
    try {
      const response = await createProjectMutation.mutateAsync(data);
      if (response.success) {
        setIsError(false);
        setMessage("Project created successfully");
        reset();
      }
    } catch (error: any) {
      setIsError(true);
      setMessage(error.message || "Failed to create project");
    }
  };

  return (
    <div className="border p-4 m-2 rounded-sm">
      <h1>Create a Project</h1>
      <Form {...form}>
        <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
          <div className="flex flex-col gap-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input
                      disabled={createProjectMutation.isPending}
                      {...field}
                      placeholder="My project..."
                      type="text"
                    />
                  </FormControl>
                  {form.formState.errors.name && (
                    <FormMessage>
                      {form.formState.errors.name.message}
                    </FormMessage>
                  )}
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Input
                      disabled={createProjectMutation.isPending}
                      {...field}
                      placeholder="My project to improve my skills..."
                      type="text"
                    />
                  </FormControl>
                  {form.formState.errors.description && (
                    <FormMessage>
                      {form.formState.errors.description.message}
                    </FormMessage>
                  )}
                </FormItem>
              )}
            />
          </div>

          {message && (
            <FormMessage className={isError ? "text-red-500" : "text-green-500"}>
              {message}
            </FormMessage>
          )}

          <Button
            disabled={createProjectMutation.isPending}
            variant="default"
            type="submit"
            className="w-full"
          >
            {createProjectMutation.isPending ? "Creating..." : "Create"}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default ProjectForm;
