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
import { useCreateActivity } from "@/queries/activityQueries";
import { Button } from "../ui/Buttons/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "../ui/drawer";
import { DatePicker } from "../ui/Forms/date-picker-field";
import { Iconify } from "../ui/iconify";
import CategorySelectCreate from "../Category/CategorySelectCreate";

const ActivityForm = () => {
  const { mutateAsync: createActivity } = useCreateActivity();
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
        setMessage("An error occurred");
        setIsError(true);
      }
    });
  };

  return (
    <Drawer open={isOpen} onOpenChange={setIsOpen}>
      <DrawerTrigger asChild>
        <Button
          onClick={() => {
            setMessage("");
            setIsError(false);
          }}
          className="fixed bottom-4 right-4"
        >
          <Iconify icon="solar:bolt-circle-outline" width={32} />
          <span className="hidden sm:inline">Create Activity</span>
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <div className="mx-auto w-full max-w-sm">
          <DrawerHeader>
            <DrawerTitle>Create Activity</DrawerTitle>
            <DrawerDescription>Create a new activity</DrawerDescription>
          </DrawerHeader>
          <div className="p-4">
            <Form {...form}>
              <form
                className="space-y-4"
                onSubmit={form.handleSubmit(onSubmit)}
              >
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
                          value={field.value === 0 ? "" : field.value}
                          placeholder="Your activity duration in minutes"
                          onChange={(e) => {
                            const value = e.target.value;
                            field.onChange(value === "" ? 0 : Number(value));
                          }}
                          type="number"
                          max={5000}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="categoryId"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Select a Activity Type</FormLabel>
                      <CategorySelectCreate field={field} form={form} />
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="date"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Activity Date</FormLabel>
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
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description (optional)</FormLabel>
                      <FormControl>
                        <Input
                          disabled={isPending}
                          {...field}
                          placeholder="Describe the activity"
                          type="text"
                          maxLength={70}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {message && isError && <FormMessage>{message}</FormMessage>}

                <LoadingButton
                  disabled={isPending}
                  type="submit"
                  className="w-full"
                  isLoading={isPending}
                  loadingText="Creating..."
                >
                  Create
                </LoadingButton>
              </form>
            </Form>
          </div>
          <DrawerFooter>
            <DrawerClose asChild>
              <Button variant="outline">Cancel</Button>
            </DrawerClose>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export default ActivityForm;
