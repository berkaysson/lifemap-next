"use client";

import React from "react";
import { Iconify } from "../iconify";
import { Button } from "./button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../Modals/dialog";
import * as DialogPrimitive from "@radix-ui/react-dialog";

interface ButtonWithConfirmationProps {
  buttonText: string;
  onConfirm: () => void;
  size?: "sm" | "lg" | "default" | "icon" | null | undefined;
  variant?: "default" | "outline" | "destructive" | "ghost";
  icon?: string;
  confirmationTitle?: string;
  confirmationDescription?: string;
  disabled?: boolean;
}

const ButtonWithConfirmation = ({
  buttonText,
  onConfirm,
  size = "default",
  variant = "default",
  icon,
  confirmationTitle = "Are you sure?",
  confirmationDescription = "This action cannot be undone.",
  disabled = false,
}: ButtonWithConfirmationProps) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant={variant} size={size} disabled={disabled}>
          {icon && (
            <Iconify
              icon={icon}
              width={16}
              className={buttonText ? "mr-1" : ""}
            />
          )}
          {buttonText}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{confirmationTitle}</DialogTitle>
          <DialogDescription>{confirmationDescription}</DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex gap-6">
          <Button variant="ghost" asChild>
            <DialogPrimitive.Close className="rounded-sm">
              <span>Cancel</span>
            </DialogPrimitive.Close>
          </Button>

          <Button variant={variant} onClick={onConfirm}>
            Confirm
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ButtonWithConfirmation;
