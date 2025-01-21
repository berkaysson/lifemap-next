"use client";

import { useForm } from "react-hook-form";
import { Button } from "../ui/Buttons/button";
import { Input } from "../ui/Forms/input";
import { TodoSchema } from "@/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useContext, useState, useTransition } from "react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/Forms/form";
import { useCreateTodo } from "@/queries/todoQueries";
import { LoadingButton } from "../ui/Buttons/loading-button";

const TodoForm = () => {
  const { mutateAsync: createTodo } = useCreateTodo();
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);

  const form = useForm<z.infer<typeof TodoSchema>>({
    resolver: zodResolver(TodoSchema),
    defaultValues: {
      name: "",
      description: "",
      endDate: "",
      colorCode: "#b83280",
    },
  });

  const { reset } = form;

  const onSubmit = (data: z.infer<typeof TodoSchema>) => {
    startTransition(async () => {
      try {
        const response = await createTodo(data);
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
        setMessage(error.message || "An error occurred");
        setIsError(true);
      }
    });
  };

  return (
    <div className="border p-4 m-2 rounded-sm">
      <h1>Create a Todo</h1>
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
                      placeholder="Your todo"
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
                      disabled={isPending}
                      {...field}
                      placeholder="Describe your todo"
                      type="text"
                    />
                  </FormControl>
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
                      placeholder="Due Date"
                      type="date"
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

          <LoadingButton
            isLoading={isPending}
            loadingText="Creating..."
            disabled={isPending}
            variant="default"
            type="submit"
            className="w-full"
          >
            Create
          </LoadingButton>
        </form>
      </Form>
    </div>
  );
};

export default TodoForm;
