"use client";

import { HabitSchema } from "@/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/Forms/form";
import { Input } from "../ui/Forms/input";
import { Button } from "../ui/Buttons/button";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { Period } from "@prisma/client";
import {
  calculateEndDateWithPeriod,
  formatDate,
  formatDateFriendly,
  parseDate,
  removeOneDay,
} from "@/lib/time";
import { useCreateHabit } from "@/queries/habitQueries";
import { LoadingButton } from "../ui/Buttons/loading-button";
import { DatePicker } from "../ui/Forms/date-picker-field";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/Modals/dialog";
import { Iconify } from "../ui/iconify";
import CategorySelectCreate from "../Category/CategorySelectCreate";
import { ColorPicker } from "../ui/Forms/color-picker-field";

interface HabitFormProps {
  useArea?: string;
  defaultValues?: z.infer<typeof HabitSchema>;
  isOpen?: boolean;
  setIsOpen?: (open: boolean) => void;
}

const HabitForm = ({
  useArea = "entity",
  defaultValues,
  isOpen,
  setIsOpen,
}: HabitFormProps) => {
  const [isOpenInternal, setIsOpenInternal] = useState(false);
  const actualIsOpen = isOpen !== undefined ? isOpen : isOpenInternal;
  const actualSetIsOpen =
    setIsOpen !== undefined ? setIsOpen : setIsOpenInternal;
  const [currentStep, setCurrentStep] = useState(1);

  const { mutateAsync: createHabit } = useCreateHabit();
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const [calculatedEndDate, setCalculatedEndDate] = useState<string | null>(
    null
  );

  const form = useForm<z.infer<typeof HabitSchema>>({
    resolver: zodResolver(HabitSchema),
    defaultValues: defaultValues || {
      name: "",
      description: "",
      period: Period.DAILY,
      startDate: new Date().toISOString().split("T")[0],
      numberOfPeriods: 2,
      goalDurationPerPeriod: 0,
      categoryId: "",
      colorCode: "#714DD9",
    },
  });

  const { reset } = form;

  const onSubmit = (data: z.infer<typeof HabitSchema>) => {
    startTransition(async () => {
      try {
        const response = await createHabit(data);
        if (response.message) {
          setMessage(response.message);
          if (response.success) {
            setIsError(false);
            reset();
            setCurrentStep(1);
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

  const periodOptions = Object.values(Period).map((option) => ({
    label: option.charAt(0) + option.substring(1).toLowerCase(),
    value: option,
  }));

  const calculateEndDate = (startDate, period, numberOfPeriods) => {
    if (startDate && period && numberOfPeriods) {
      return formatDate(
        removeOneDay(
          calculateEndDateWithPeriod(
            parseDate(startDate),
            period,
            numberOfPeriods
          )
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

  const handleOpenChange = (event) => {
    setIsOpenInternal(event);
    setCurrentStep(1);
    reset();
    setMessage("");
    setIsError(false);
  };

  return (
    <Dialog
      open={actualIsOpen}
      onOpenChange={useArea === "archive" ? actualSetIsOpen : handleOpenChange}
    >
      <DialogTrigger asChild>
        {useArea === "entity" ? (
          <Button variant="ghost" size="sm">
            <Iconify
              icon="solar:add-square-linear"
              width={32}
              className="mr-0 sm:mr-1"
            />
            <span className="sm:inline hidden">Create Habit</span>
          </Button>
        ) : useArea !== "archive" ? (
          <Button variant="outline" size="sm">
            <Iconify icon="ph:plant" width={24} className="mr-0 sm:mr-1" />
            <span>Create Habit</span>
          </Button>
        ) : null}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>
            {useArea === "archive" ? "Recreate Habit" : "Create a Habit"}
          </DialogTitle>
          <div className="text-sm text-muted-foreground">
            Step {currentStep} of 2
          </div>
        </DialogHeader>
        <Form {...form}>
          <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
            {currentStep === 1 && (
              <div className="flex flex-col gap-6">
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
                          maxLength={70}
                        />
                      </FormControl>
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
                        <ColorPicker
                          value={field.value || "#714DD9"}
                          onChange={field.onChange}
                          disabled={isPending}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
            )}

            {currentStep === 2 && (
              <div className="flex flex-col gap-6">
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
                          value={field.value === 0 ? "" : field.value}
                          placeholder="10"
                          max={91}
                          type="number"
                          onChange={(e) => {
                            const value = e.target.value;
                            field.onChange(value === "" ? 0 : Number(value));
                          }}
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
                {calculatedEndDate && (
                  <div className="text-sm text-shade">
                    <p>
                      You will need to complete this habit for{" "}
                      <span className="font-bold text-primary">
                        {form.getValues().period.toLowerCase()}
                      </span>
                      , until:{" "}
                      <span className="font-bold text-primary">
                        {formatDateFriendly(new Date(calculatedEndDate))}
                      </span>
                    </p>
                  </div>
                )}
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
                          value={field.value === 0 ? "" : field.value}
                          placeholder="Goal Duration per Period in minutes"
                          type="number"
                          max={5000}
                          onChange={(e) => {
                            const value = e.target.value;
                            field.onChange(value === "" ? 0 : Number(value));
                          }}
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
            )}

            {message && isError && <FormMessage>{message}</FormMessage>}

            <div className="flex justify-end space-x-2">
              {currentStep === 2 && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setCurrentStep(1)}
                >
                  Back
                </Button>
              )}
              {currentStep === 1 ? (
                <Button
                  type="button"
                  onClick={async () => {
                    const isValid = await form.trigger(["name", "categoryId"]);
                    if (isValid) setCurrentStep(2);
                  }}
                >
                  Next
                </Button>
              ) : (
                <LoadingButton
                  disabled={isPending}
                  isLoading={isPending}
                  loadingText="Creating..."
                  variant="default"
                  type="submit"
                >
                  Create
                </LoadingButton>
              )}
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default HabitForm;
