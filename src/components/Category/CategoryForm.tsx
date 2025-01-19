"use client";

import { useForm } from "react-hook-form";
import { Button } from "../ui/Buttons/button";
import { Input } from "../ui/Forms/input";
import { CategorySchema } from "@/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState, useTransition } from "react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/Forms/form";
import { useCreateCategory } from "@/queries/categoryQueries";

const CategoryForm = () => {
  const { mutateAsync: createCategory } = useCreateCategory();
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);

  const form = useForm<z.infer<typeof CategorySchema>>({
    resolver: zodResolver(CategorySchema),
    defaultValues: {
      name: "",
    },
  });

  const { reset } = form;

  const onSubmit = async (data: z.infer<typeof CategorySchema>) => {
    startTransition(async () => {
      try {
        const response = await createCategory(data);
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
      <h1>Create a Category</h1>
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
                      placeholder="Enter category name..."
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

export default CategoryForm;
