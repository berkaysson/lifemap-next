"use client";

import { TaskSchema } from "@/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/Forms/form";
import { Input } from "../ui/Forms/input";
import { Button } from "../ui/Buttons/button";
import { useCreateTask } from "@/queries/taskQueries";
import { LoadingButton } from "../ui/Buttons/loading-button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/Modals/dialog";
import { Iconify } from "../ui/iconify";
import { DatePicker } from "../ui/Forms/date-picker-field";
import CategorySelectCreate from "../Category/CategorySelectCreate";

const TaskForm = ({ useArea = "entity" }) => {
  const [isOpen, setIsOpen] = useState(false);

  const { mutateAsync: createTask } = useCreateTask();
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);

  const form = useForm<z.infer<typeof TaskSchema>>({
    resolver: zodResolver(TaskSchema),
    defaultValues: {
      name: "",
      description: "",
      goalDuration: 0,
      categoryId: "",
      startDate: new Date().toISOString().split("T")[0],
      endDate: "",
      colorCode: "#12a1cc",
    },
  });

  const { reset } = form;

  const onSubmit = (data: z.infer<typeof TaskSchema>) => {
    startTransition(async () => {
      try {
        const response = await createTask(data);
        if (response.message) {
          setMessage(response.message);
          if (response.success) {
            setIsError(false);
            reset();
          } else {
            setIsError(true);
          }
        }
      } catch (error: any) {
        setMessage("An error occurred");
        setIsError(true);
      }
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {useArea === "entity" ? (
          <Button variant="ghost" size="sm">
            <Iconify
              icon="solar:add-square-linear"
              width={32}
              className="mr-0 sm:mr-1"
            />
            <span className="sm:inline hidden">Create Task</span>
          </Button>
        ) : (
          <Button variant="outline" size="sm">
            <Iconify
              icon="solar:check-read-linear"
              width={24}
              className="mr-0 sm:mr-1"
            />
            <span>Create Task</span>
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Create a Task</DialogTitle>
        </DialogHeader>
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
                        disabled={isPending}
                        {...field}
                        placeholder="Doing something..."
                        type="text"
                        maxLength={50}
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
            </div>
            <div className="flex flex-col gap-4">
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Input
                        disabled={isPending}
                        {...field}
                        placeholder="Doing something until next month..."
                        type="text"
                        maxLength={70}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
            <div className="flex flex-col gap-4">
              <FormField
                control={form.control}
                name="goalDuration"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Goal Duration (min)</FormLabel>
                    <FormControl>
                      <Input
                        disabled={isPending}
                        {...field}
                        value={field.value === 0 ? "" : field.value}
                        placeholder="Goal Duration in minutes"
                        type="number"
                        max={15000}
                        onChange={(e) => {
                          const value = e.target.value;
                          field.onChange(value === "" ? 0 : Number(value));
                        }}
                      />
                    </FormControl>
                    {form.formState.errors.goalDuration && (
                      <FormMessage>
                        {form.formState.errors.goalDuration.message}
                      </FormMessage>
                    )}
                  </FormItem>
                )}
              />
            </div>
            <div className="flex flex-col gap-4">
              <FormField
                control={form.control}
                name="categoryId"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Select a Activity Type</FormLabel>
                    <CategorySelectCreate field={field} form={form} />
                    {form.formState.errors.categoryId && (
                      <FormMessage>
                        {form.formState.errors.categoryId.message}
                      </FormMessage>
                    )}
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="startDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Start Date</FormLabel>
                    <FormControl>
                      <FormControl>
                        <DatePicker
                          date={field.value ? new Date(field.value) : undefined}
                          onSelect={(date) =>
                            field.onChange(
                              new Date((date?.getTime() ?? 0) + 10800000)
                                .toISOString()
                                .split("T")[0]
                            )
                          }
                        />
                      </FormControl>
                    </FormControl>
                    {form.formState.errors.startDate && (
                      <FormMessage>
                        {form.formState.errors.startDate.message}
                      </FormMessage>
                    )}
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="endDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Due Date</FormLabel>
                    <FormControl>
                      <FormControl>
                        <DatePicker
                          date={field.value ? new Date(field.value) : undefined}
                          onSelect={(date) =>
                            field.onChange(
                              new Date((date?.getTime() ?? 0) + 10800000)
                                .toISOString()
                                .split("T")[0]
                            )
                          }
                        />
                      </FormControl>
                    </FormControl>
                    {form.formState.errors.endDate && (
                      <FormMessage>
                        {form.formState.errors.endDate.message}
                      </FormMessage>
                    )}
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="colorCode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Pick a Color</FormLabel>
                    <FormControl>
                      <Input
                        className="w-20 rounded-full"
                        disabled={isPending}
                        {...field}
                        type="color"
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
            {message && isError && <FormMessage>{message}</FormMessage>}
            <LoadingButton
              disabled={isPending}
              isLoading={isPending}
              loadingText="Creating..."
              variant="default"
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

export default TaskForm;
