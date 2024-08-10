"use client";

import { CategoryContext } from "@/contexts/CategoryContext";
import { TaskContext } from "@/contexts/TaskContext";
import { TaskSchema } from "@/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useContext, useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import SelectBox from "../ui/SelectBox";

const TaskForm = () => {
  const { onCreateTask } = useContext(TaskContext);
  const { categories } = useContext(CategoryContext);
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);

  const form = useForm<z.infer<typeof TaskSchema>>({
    resolver: zodResolver(TaskSchema),
    defaultValues: {
      name: "",
      description: "",
      categoryId: "",
      endDate: "",
    },
  });

  const { reset } = form;

  const onSubmit = (data: z.infer<typeof TaskSchema>) => {
    startTransition(() => {
      onCreateTask(data).then((response: any) => {
        if (response.message) {
          setMessage(response.message);
          if (response.success) {
            setIsError(false);
            reset();
          } else {
            setIsError(true);
          }
        }
      });
    });
  };

  return (
    <div className="border p-4 m-2 rounded-sm">
      <h1>Create a Task</h1>
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
                      placeholder="Goal Duration in minutes"
                      type="number"
                      onChange={(e) => field.onChange(Number(e.target.value))}
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
                  <FormLabel>Select a Category</FormLabel>
                  <SelectBox
                    field={field}
                    options={categories}
                    form={form}
                    optionKey={"id"}
                    formKey={"categoryId"}
                  />
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
                    <Input
                      disabled={isPending}
                      {...field}
                      placeholder="Date"
                      type="date"
                      defaultValue={new Date().toISOString().split("T")[0]}
                      required
                    />
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
                    <Input
                      disabled={isPending}
                      {...field}
                      placeholder="Date"
                      type="date"
                      required
                    />
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
          <Button
            disabled={isPending}
            variant="default"
            type="submit"
            className="w-full"
          >
            Create
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default TaskForm;
