"use client";

import { useState, useTransition, useEffect, useMemo } from "react";
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
import {
  useCreateActivity,
  useFetchActivitiesByCategory,
  useFetchRecentActivities,
} from "@/queries/activityQueries";
import { Button } from "../ui/Buttons/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "../ui/drawer";
import { DatePicker } from "../ui/Forms/date-picker-field";
import { Iconify } from "../ui/iconify";
import CategorySelectCreate from "../Category/CategorySelectCreate";
import { useActivityDrawerState } from "@/hooks/use-activity-drawer-state";
import { Badge } from "../ui/badge";
import { ExtendedActivity } from "@/types/Entitities";
import { ActivityFromTriggerButton } from "./ActivityFromTriggerButton";

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

  const categoryId = form.watch("categoryId");
  const { data: activitiesData } = useFetchActivitiesByCategory(categoryId, 20);
  const { data: recentActivitiesData } = useFetchRecentActivities(20);

  const suggestedCategories = useMemo(
    () =>
      getSuggestedCategories(
        recentActivitiesData?.activities as ExtendedActivity[]
      ),
    [recentActivitiesData]
  );

  const suggestedDurations = useMemo(
    () =>
      getSuggestedDurations(activitiesData?.activities as ExtendedActivity[]),
    [activitiesData]
  );

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
      } catch {
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
    <ActivityFromTriggerButton
      open={open}
      setMessage={setMessage}
      setIsError={setIsError}
    />
  );

  return (
    <Drawer open={isOpen} onOpenChange={handleOpenChange}>
      <DrawerTrigger asChild>{trigger || defaultTrigger}</DrawerTrigger>
      <DrawerContent>
        <div className="mx-auto w-full max-w-sm">
          <DrawerHeader className="text-center sm:text-left mb-2">
            <DrawerTitle className="text-2xl font-bold tracking-tight bg-gradient-to-r from-foreground to-foreground/60 bg-clip-text text-transparent">
              Create Activity
            </DrawerTitle>
            <DrawerDescription className="text-muted-foreground">
              Log your progress and track your journey
            </DrawerDescription>
          </DrawerHeader>
          <div className="p-4 pt-0">
            <Form {...form}>
              <form
                className="space-y-6"
                onSubmit={form.handleSubmit(onSubmit)}
              >
                <FormField
                  control={form.control}
                  name="categoryId"
                  render={({ field }) => (
                    <FormItem className="flex flex-col space-y-3">
                      <div className="flex items-center gap-2">
                        <Iconify
                          icon="solar:tag-bold-duotone"
                          className="text-primary"
                          width={18}
                        />
                        <FormLabel className="text-sm font-medium text-foreground/80">
                          Activity Type
                        </FormLabel>
                      </div>
                      <CategorySelectCreate field={field} form={form} />
                      <FormMessage />
                      {suggestedCategories.length > 0 && (
                        <div className="flex flex-col gap-1">
                          <span className="flex items-center gap-1 text-[10px] uppercase tracking-wider text-muted-foreground/80 font-semibold ml-1">
                            <Iconify icon="iconoir:spark-solid" width={16} />
                            Quick Select
                          </span>
                          <div className="flex gap-1 flex-wrap">
                            {suggestedCategories.map((category) => (
                              <Badge
                                key={category.id}
                                variant={
                                  field.value === category.id
                                    ? "default"
                                    : "secondary"
                                }
                                className={`cursor-pointer px-3 py-1 transition-all duration-200 border-none ${
                                  field.value === category.id
                                    ? "bg-primary text-primary-foreground scale-105 shadow-lg shadow-primary/20"
                                    : "bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground"
                                }`}
                                onClick={() => {
                                  if (!isPending) {
                                    field.onChange(category.id);
                                  }
                                }}
                              >
                                {category.name}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="duration"
                  render={({ field }) => (
                    <FormItem className="space-y-3">
                      <div className="flex items-center gap-2">
                        <Iconify
                          icon="solar:clock-circle-bold-duotone"
                          className="text-secondary"
                          width={18}
                        />
                        <FormLabel className="text-sm font-medium text-foreground/80">
                          Duration (minutes)
                        </FormLabel>
                      </div>
                      <FormControl>
                        <div className="flex flex-col gap-3">
                          <div className="flex items-center gap-2">
                            <Button
                              type="button"
                              variant="secondary"
                              size="icon"
                              className="h-10 w-10 flex-shrink-0 bg-muted border-none hover:bg-muted/80 text-foreground/80"
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
                              <Iconify icon="lucide:minus" width={16} />
                            </Button>
                            <div className="relative flex-1">
                              <Input
                                disabled={isPending}
                                {...field}
                                value={field.value === 0 ? "" : field.value}
                                placeholder="0"
                                onChange={(e) => {
                                  const value = e.target.value;
                                  field.onChange(
                                    value === "" ? 0 : Number(value)
                                  );
                                }}
                                type="number"
                                max={5000}
                                className="h-10 bg-muted border-border text-center text-lg font-medium focus-visible:ring-primary/50 placeholder:text-muted-foreground/30"
                              />
                            </div>
                            <Button
                              type="button"
                              variant="secondary"
                              size="icon"
                              className="h-10 w-10 flex-shrink-0 bg-muted border-none hover:bg-muted/80 text-foreground/80"
                              onClick={() => {
                                if (!isPending) {
                                  const newValue = (field.value || 0) + 5;
                                  field.onChange(newValue);
                                }
                              }}
                            >
                              <Iconify icon="lucide:plus" width={16} />
                            </Button>
                          </div>
                          <div className="flex flex-col gap-1">
                            <span className="flex items-center gap-1 text-[10px] uppercase tracking-wider text-muted-foreground/80 font-semibold ml-1">
                              <Iconify icon="iconoir:spark-solid" width={16} />
                              Quick Select
                            </span>
                            <div className="flex gap-1 flex-wrap">
                              {suggestedDurations.map((minutes) => (
                                <Badge
                                  key={minutes}
                                  variant={
                                    field.value === minutes
                                      ? "default"
                                      : "secondary"
                                  }
                                  className={`cursor-pointer px-3 py-1 transition-all duration-200 border-none ${
                                    field.value === minutes
                                      ? "bg-secondary text-secondary-foreground scale-105 shadow-lg shadow-secondary/20"
                                      : "bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground"
                                  }`}
                                  onClick={() =>
                                    !isPending && field.onChange(minutes)
                                  }
                                >
                                  {minutes} min.
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="date"
                  render={({ field }) => (
                    <FormItem className="flex flex-col space-y-3">
                      <div className="flex items-center gap-2">
                        <Iconify
                          icon="solar:calendar-bold-duotone"
                          className="text-info"
                          width={18}
                        />
                        <FormLabel className="text-sm font-medium text-foreground/80">
                          Activity Date
                        </FormLabel>
                      </div>
                      <FormControl>
                        <div className="flex items-center gap-2">
                          <Button
                            type="button"
                            variant="secondary"
                            size="icon"
                            disabled={isPending}
                            className="bg-muted border-none hover:bg-muted/80 text-foreground/80"
                            onClick={() => {
                              const date = new Date(field.value);
                              date.setUTCDate(date.getUTCDate() - 1);
                              field.onChange(date.toISOString().split("T")[0]);
                            }}
                          >
                            <Iconify icon="lucide:chevron-left" width={20} />
                          </Button>
                          <div className="flex-1">
                            <DatePicker
                              date={
                                field.value ? new Date(field.value) : undefined
                              }
                              showTodayButton={true}
                              onSelect={(date) =>
                                field.onChange(
                                  new Date((date?.getTime() ?? 0) + 10800000)
                                    .toISOString()
                                    .split("T")[0]
                                )
                              }
                            />
                          </div>
                          <Button
                            type="button"
                            variant="secondary"
                            size="icon"
                            disabled={isPending}
                            className="bg-muted border-none hover:bg-muted/80 text-foreground/80"
                            onClick={() => {
                              const date = new Date(field.value);
                              date.setUTCDate(date.getUTCDate() + 1);
                              field.onChange(date.toISOString().split("T")[0]);
                            }}
                          >
                            <Iconify icon="lucide:chevron-right" width={20} />
                          </Button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {message && isError && (
                  <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm font-medium text-center">
                    {message}
                  </div>
                )}

                <div className="pt-2 flex flex-col gap-3">
                  <LoadingButton
                    disabled={isPending}
                    type="submit"
                    className="w-full h-11 bg-gradient-to-r from-secondary to-primary hover:opacity-90 text-primary-foreground font-bold text-base shadow-xl shadow-primary/10 transition-all active:scale-[0.98]"
                    isLoading={isPending}
                    loadingText="Creating..."
                  >
                    Create Activity
                  </LoadingButton>

                  <DrawerClose asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-full text-muted-foreground hover:text-foreground/80 hover:bg-muted"
                    >
                      Cancel
                    </Button>
                  </DrawerClose>
                </div>
              </form>
            </Form>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
};

// --- Helper Functions ---

function getSuggestedCategories(activities: ExtendedActivity[] | undefined) {
  if (!activities || activities.length === 0) return [];

  const categoryCounts: Record<string, { count: number; name: string }> = {};

  activities.forEach((act) => {
    if (act.categoryId && act.category) {
      if (!categoryCounts[act.categoryId]) {
        categoryCounts[act.categoryId] = {
          count: 0,
          name: act.category.name,
        };
      }
      categoryCounts[act.categoryId].count++;
    }
  });

  const sorted = Object.entries(categoryCounts)
    .sort(([, a], [, b]) => b.count - a.count)
    .map(([id, { name }]) => ({ id, name }));

  const top2 = sorted.slice(0, 2);

  const lastUsed = activities[0]?.category
    ? { id: activities[0].categoryId, name: activities[0].category.name }
    : null;

  const result = [...top2];
  // Add last used if it's not already in top 2
  if (lastUsed && !result.find((c) => c.id === lastUsed.id)) {
    result.push(lastUsed);
  } else {
    result.push(sorted[2]);
  }

  return result;
}

function getSuggestedDurations(activities: ExtendedActivity[] | undefined) {
  if (!activities || activities.length === 0) return [10, 30, 60, 90];

  const matchingActivities = activities;

  const durationCounts: Record<number, number> = {};
  matchingActivities.forEach((a) => {
    if (a.duration) {
      durationCounts[a.duration] = (durationCounts[a.duration] || 0) + 1;
    }
  });

  const sorted = Object.entries(durationCounts)
    .sort(([, a], [, b]) => b - a)
    .map(([duration]) => Number(duration));

  const distinct = Array.from(new Set(sorted)).slice(0, 4);

  return distinct.length > 0 ? distinct : [10, 30, 60, 90];
}

export default ActivityForm;
