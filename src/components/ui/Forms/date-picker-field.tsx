import React from "react";
import { FieldPath, FieldValues, UseFormReturn } from "react-hook-form";
import { FormControl, FormField, FormLabel, FormItem } from "./form";
import { Input } from "./input";


type DatePickerFieldProps<TFieldValues extends FieldValues> = {
  form: UseFormReturn<TFieldValues>;
  name: FieldPath<TFieldValues>;
  label: string;
  placeholder?: string;
  disabled?: boolean;
};

export function DatePickerField<TFieldValues extends FieldValues>({
  form,
  name,
  label,
  placeholder,
  disabled,
}: DatePickerFieldProps<TFieldValues>) {
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <Input
              type="date"
              placeholder={placeholder}
              disabled={disabled}
              value={field.value ? field.value.split("T")[0] : ""}
              onChange={(e) => {
                const date = e.target.value;
                field.onChange(date);
              }}
            />
          </FormControl>
        </FormItem>
      )}
    />
  );
}
