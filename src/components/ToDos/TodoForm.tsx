"use client";

import { useForm } from "react-hook-form";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
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
} from "../ui/form";
import { TodoContext } from "@/contexts/TodoContext";

const TodoForm = () => {
  const { onCreateTodo } = useContext(TodoContext);
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);

  const form = useForm<z.infer<typeof TodoSchema>>({
    resolver: zodResolver(TodoSchema),
    defaultValues: {
      name: "",
      description: "",
      endDate: "",
    },
  });

  const onSubmit = (data: z.infer<typeof TodoSchema>) => {
    startTransition(() => {
      onCreateTodo(data).then((data: any) => {
        if (data.message) {
          setMessage(data.message);
          if (data.success) {
            setIsError(false);
          } else {
            setIsError(true);
          }
          console.log("🚀 ~ file: LoginForm.tsx:37 ~ login ~ data:", data);
        }
      });
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
                      placeholder="Todo"
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
                      placeholder="Description"
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
                  <FormLabel>End Date</FormLabel>
                  <FormControl>
                    <Input
                      disabled={isPending}
                      {...field}
                      placeholder="End Date"
                      type="date"
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

export default TodoForm;
