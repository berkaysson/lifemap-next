"use client";

import { useForm } from "react-hook-form";
import { LoadingButton } from "../ui/Buttons/loading-button";
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/Modals/dialog";
import { Button } from "../ui/Buttons/button";
import { Iconify } from "../ui/iconify";

const CategoryForm = () => {
  const [isOpen, setIsOpen] = useState(false);

  const { mutateAsync: createCategory } = useCreateCategory();
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof CategorySchema>>({
    resolver: zodResolver(CategorySchema),
    defaultValues: {
      name: "",
    },
  });

  const { reset } = form;

  const onSubmit = async (data: z.infer<typeof CategorySchema>) => {
    setIsLoading(true);
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
        setMessage( "An error occurred");
        setIsError(true);
      }
      setIsLoading(false);
    });
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
          <span className="sm:inline hidden">Create Category</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create a Category</DialogTitle>
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
                        placeholder="Enter category name..."
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

            {message && isError && <FormMessage>{message}</FormMessage>}

            <LoadingButton
              disabled={isPending}
              variant="default"
              type="submit"
              className="w-full"
              isLoading={isLoading}
              loadingText="Creating..."
            >
              Create
            </LoadingButton>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default CategoryForm;
