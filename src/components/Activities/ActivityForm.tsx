"use client";

import { useState, useTransition, useEffect } from "react";
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
import { useActivityDrawerState } from "@/hooks/use-activity-drawer-state";
import { Badge } from "../ui/badge";

// Default values type
type ActivityFormValues = z.infer<typeof ActivitySchema>;

// Props to allow external control
interface ActivityFormProps {
  drawerState?: ReturnType<typeof useActivityDrawerState>;
  trigger?: React.ReactNode;
}

const ActivityForm = ({ drawerState, trigger }: ActivityFormProps) => {
  const { mutateAsync: createActivity } = useCreateActivity();
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);

  // Use provided drawerState or create a local one
  const localDrawerState = useActivityDrawerState();
  const { isOpen, open, close, formValues } = drawerState || localDrawerState;

  const form = useForm<ActivityFormValues>({
    resolver: zodResolver(ActivitySchema),
    defaultValues: {
      description: "",
      duration: 0,
      categoryId: "",
      date: new Date().toISOString().split("T")[0],
    },
  });

  const { reset } = form;

  // Reset form when drawer opens with new values
  useEffect(() => {
    if (isOpen && formValues) {
      // Merge default values with any provided values
      const newValues = {
        description: formValues.description || "",
        duration: formValues.duration || 0,
        categoryId: formValues.categoryId || "",
        date: formValues.date || new Date().toISOString().split("T")[0],
      };

      // Reset the form with new values
      reset(newValues);
    }
  }, [isOpen, formValues, reset]);

  const onSubmit = (data: ActivityFormValues) => {
    startTransition(async () => {
      try {
        const response = await createActivity(data);
        if (response.message) {
          setMessage(response.message);
          if (response.success) {
            setIsError(false);
            reset();
            close();
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

  const handleOpenChange = (newIsOpen: boolean) => {
    if (newIsOpen) {
      setMessage("");
      setIsError(false);
      open();
    } else {
      close();
    }
  };

  const defaultTrigger = (
    <Button
      onClick={() => {
        setMessage("");
        setIsError(false);
        open();
      }}
      className="fixed bottom-8 right-4 bg-gradient-to-r from-secondary to-primary text-black font-semibold border-0 transition-all duration-300 hover:scale-105 active:scale-95"
      style={{
        boxShadow:
          "0 4px 12px rgba(59, 130, 246, 0.3), 0 3px 12px rgba(147, 51, 234, 0.2)",
      }}
    >
      <Iconify icon="solar:bolt-circle-outline" width={28} />
      <span className="hidden sm:inline ml-2">Create Activity</span>
    </Button>
  );

  return (
    <Drawer open={isOpen} onOpenChange={handleOpenChange}>
      <DrawerTrigger asChild>{trigger || defaultTrigger}</DrawerTrigger>
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
                        <div className="flex flex-col gap-2">
                          <div className="flex items-center gap-4">
                            <Badge
                              variant="outline"
                              className="cursor-pointer py-2 px-4 transition-colors"
                              onClick={() => {
                                if (!isPending) {
                                  const newValue = Math.max(
                                    0,
                                    (field.value || 0) - 5
                                  );
                                  field.onChange(newValue);
                                }
                              }}
                            >
                              -5
                            </Badge>
                            <Input
                              disabled={isPending}
                              {...field}
                              value={field.value === 0 ? "" : field.value}
                              placeholder="Your activity duration in minutes"
                              onChange={(e) => {
                                const value = e.target.value;
                                field.onChange(
                                  value === "" ? 0 : Number(value)
                                );
                              }}
                              type="number"
                              max={5000}
                              className="flex-1"
                            />
                            <Badge
                              variant="outline"
                              className="cursor-pointer py-2 px-4 transition-colors"
                              onClick={() => {
                                if (!isPending) {
                                  const newValue = (field.value || 0) + 5;
                                  field.onChange(newValue);
                                }
                              }}
                            >
                              +5
                            </Badge>
                          </div>
                          <div className="flex gap-1 flex-wrap">
                            {[10, 30, 60, 90].map((minutes) => (
                              <Badge
                                key={minutes}
                                variant={
                                  field.value === minutes
                                    ? "default"
                                    : "outline"
                                }
                                className="cursor-pointer transition-colors"
                                onClick={() =>
                                  !isPending && field.onChange(minutes)
                                }
                              >
                                {minutes} min.
                              </Badge>
                            ))}
                          </div>
                        </div>
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
