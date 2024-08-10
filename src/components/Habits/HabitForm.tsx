"use client";

import { CategoryContext } from "@/contexts/CategoryContext";
import { HabitContext } from "@/contexts/HabitContext";
import { HabitSchema } from "@/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useContext, useEffect, useState, useTransition } from "react";
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
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { Period } from "@prisma/client";
import { calculateEndDateWithPeriod, formatDate, parseDate } from "@/lib/time";

const HabitForm = () => {
  const { onCreateHabit } = useContext(HabitContext);
  const { categories } = useContext(CategoryContext);
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const [calculatedEndDate, setCalculatedEndDate] = useState<string | null>(
    null
  );

  const form = useForm<z.infer<typeof HabitSchema>>({
    resolver: zodResolver(HabitSchema),
    defaultValues: {
      name: "",
      description: "",
      categoryId: "",
      numberOfPeriods: 1,
      period: Period.DAILY,
    },
  });

  const { reset } = form;

  const onSubmit = (data: z.infer<typeof HabitSchema>) => {
    startTransition(() => {
      onCreateHabit(data).then((response: any) => {
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

  const periodOptions = Object.values(Period).map((option) => ({
    label: option.charAt(0) + option.substring(1).toLowerCase(),
    value: option,
  }));

  const calculateEndDate = (startDate, period, numberOfPeriods) => {
    if (startDate && period && numberOfPeriods) {
      return formatDate(
        calculateEndDateWithPeriod(
          parseDate(startDate),
          period,
          numberOfPeriods
        )
      );
    }
    return null;
  };

  const startDate = form.watch("startDate");
  const period = form.watch("period");
  const numberOfPeriods = form.watch("numberOfPeriods");

  useEffect(() => {
    const newCalculatedEndDate = calculateEndDate(
      startDate,
      period,
      numberOfPeriods
    );
    setCalculatedEndDate(newCalculatedEndDate);
  }, [startDate, period, numberOfPeriods]);

  return (
    <div className="border p-4 m-2 rounded-sm">
      <h1>Create a Habit</h1>
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
                      placeholder="Doing something each day for 21 days..."
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
              name="period"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Period</FormLabel>
                  <RadioGroup
                    onValueChange={(value) => {
                      field.onChange(value);
                      form.setValue("period", value as Period, {
                        shouldValidate: true,
                      });
                    }}
                    value={field.value}
                    className="flex flex-row space-x-1"
                  >
                    {periodOptions.map((option) => (
                      <FormItem
                        className="flex items-center space-x-3 space-y-0"
                        key={option.value}
                      >
                        <FormControl>
                          <RadioGroupItem value={option.value} />
                        </FormControl>
                        <FormLabel className="font-normal">
                          {option.label}
                        </FormLabel>
                      </FormItem>
                    ))}
                  </RadioGroup>
                  {form.formState.errors.period && (
                    <FormMessage>
                      {form.formState.errors.period.message}
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
                  <FormLabel>Starting Date</FormLabel>
                  <FormControl>
                    <Input
                      disabled={isPending}
                      {...field}
                      placeholder="Starting Date"
                      defaultValue={new Date().toISOString().split("T")[0]}
                      type="date"
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
              name="numberOfPeriods"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>How many times you want to repeat?</FormLabel>
                  <FormControl>
                    <Input
                      disabled={isPending}
                      {...field}
                      placeholder="10"
                      type="number"
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                  </FormControl>
                  {form.formState.errors.numberOfPeriods && (
                    <FormMessage>
                      {form.formState.errors.numberOfPeriods.message}
                    </FormMessage>
                  )}
                </FormItem>
              )}
            />
            {calculatedEndDate ? (
              <div className="text-sm text-muted-foreground mb-2">
                <p>
                  You will need to complete this habit for{" "}
                  <span className="font-bold text-primary">
                    {form.getValues().period.toLowerCase()}
                  </span>,{" "}
                  until:{" "}
                  <span className="font-bold text-primary">
                    {calculatedEndDate}
                  </span>
                </p>
              </div>
            ) : null}
            <FormField
              control={form.control}
              name="goalDurationPerPeriod"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Goal Duration per Period (min)</FormLabel>
                  <FormControl>
                    <Input
                      disabled={isPending}
                      {...field}
                      placeholder="Goal Duration per Period in minutes"
                      type="number"
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                  </FormControl>
                  {form.formState.errors.goalDurationPerPeriod && (
                    <FormMessage>
                      {form.formState.errors.goalDurationPerPeriod.message}
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

export default HabitForm;
