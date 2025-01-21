"use client";

import { useState, useTransition } from "react";
import { LoadingButton } from "../ui/Buttons/loading-button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/Forms/form";
import { Input } from "../ui/Forms/input";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { ActivitySchema } from "@/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { SquareActivity } from "lucide-react";
import SelectBox from "../ui/Shared/SelectBox";
import { useFetchCategories } from "@/queries/categoryQueries";
import { useCreateActivity } from "@/queries/activityQueries";
import ModalDialog from "../ui/Modals/ModalDialog";
import { Button } from "../ui/Buttons/button";

const ActivityForm = () => {
  const { mutateAsync: createActivity } = useCreateActivity();
  const { data: categories } = useFetchCategories();
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const form = useForm<z.infer<typeof ActivitySchema>>({
    resolver: zodResolver(ActivitySchema),
    defaultValues: {
      description: "",
      duration: 0,
      categoryId: "",
      date: new Date().toISOString().split("T")[0],
    },
  });

  const { reset } = form;

  const onSubmit = (data: z.infer<typeof ActivitySchema>) => {
    startTransition(async () => {
      try {
        const response = await createActivity(data);
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
    <ModalDialog
      triggerButton={
        <Button
          onClick={() => {
            setMessage("");
            setIsError(false);
          }}
          size={"lg"}
          className="fixed bottom-4 right-4"
        >
          <SquareActivity className="mr-2 h-6 w-6" /> Create Activity
        </Button>
      }
      title="Create Activity"
      description="Create a new activity"
      isOpen={isOpen}
      setIsOpen={setIsOpen}
    >
      <Form {...form}>
        <form className="space-y-2" onSubmit={form.handleSubmit(onSubmit)}>
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
                    placeholder="Describe the activity"
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

          <FormField
            control={form.control}
            name="duration"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Duration (minutes)</FormLabel>
                <FormControl>
                  <Input
                    disabled={isPending}
                    {...field}
                    placeholder="Your activity duration in minutes"
                    onChange={(e) => field.onChange(Number(e.target.value))}
                    type="number"
                  />
                </FormControl>
                {form.formState.errors.duration && (
                  <FormMessage>
                    {form.formState.errors.duration.message}
                  </FormMessage>
                )}
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="categoryId"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Select a Category</FormLabel>
                <SelectBox
                  field={field}
                  options={categories || []}
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
            name="date"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Activity Date</FormLabel>
                <FormControl>
                  <Input disabled={isPending} {...field} type="date" required />
                </FormControl>
                {form.formState.errors.date && (
                  <FormMessage>
                    {form.formState.errors.date.message}
                  </FormMessage>
                )}
              </FormItem>
            )}
          />

          {message && isError && <FormMessage>{message}</FormMessage>}

          <LoadingButton
            disabled={isPending}
            variant="default"
            type="submit"
            className="w-full"
            isLoading={isPending}
            loadingText="Creating..."
          >
            Create
          </LoadingButton>
        </form>
      </Form>
    </ModalDialog>
  );
};

export default ActivityForm;
