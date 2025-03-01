import { useState } from "react";
import { z } from "zod";
import { ActivitySchema } from "@/schema";

type ActivityFormValues = z.infer<typeof ActivitySchema>;

interface UseActivityDrawerStateProps {
  defaultValues?: Partial<ActivityFormValues>;
}

interface UseActivityDrawerStateReturn {
  isOpen: boolean;
  open: (values?: Partial<ActivityFormValues>) => void;
  close: () => void;
  formValues: Partial<ActivityFormValues> | undefined;
  resetFormValues: () => void;
}

export const useActivityDrawerState = (
  props?: UseActivityDrawerStateProps
): UseActivityDrawerStateReturn => {
  const [isOpen, setIsOpen] = useState(false);
  const [formValues, setFormValues] = useState<
    Partial<ActivityFormValues> | undefined
  >(props?.defaultValues);

  const open = (values?: Partial<ActivityFormValues>) => {
    if (values) {
      setFormValues(values);
    }
    setIsOpen(true);
  };

  const close = () => {
    setIsOpen(false);
  };

  const resetFormValues = () => {
    setFormValues(props?.defaultValues || undefined);
  };

  return {
    isOpen,
    open,
    close,
    formValues,
    resetFormValues,
  };
};
