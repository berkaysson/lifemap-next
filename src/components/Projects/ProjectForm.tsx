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
import { LoadingButton } from "../ui/Buttons/loading-button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/Modals/dialog";
import { Iconify } from "../ui/iconify";

const ProjectForm = () => {
  const createProjectMutation = useCreateProject();
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const form = useForm<z.infer<typeof ProjectSchema>>({
    resolver: zodResolver(ProjectSchema),
    defaultValues: {
      name: "",
      description: "",
    },
  });

  const { reset } = form;

  const onSubmit = async (data: z.infer<typeof ProjectSchema>) => {
    setIsLoading(true);
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
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm">
          <Iconify
            icon="solar:add-square-linear"
            width={32}
            className="mr-0 sm:mr-1"
          />
          <span className="sm:inline hidden">Create Project</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create a Project</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
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
                    />
                  </FormControl>
                  <FormMessage />
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
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {message && (
              <FormMessage
                className={isError ? "text-destructive" : "text-primary"}
              >
                {message}
              </FormMessage>
            )}

            <LoadingButton
              isLoading={isLoading}
              loadingText="Creating..."
              type="submit"
              className="w-full"
            >
              Create
            </LoadingButton>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default ProjectForm;
