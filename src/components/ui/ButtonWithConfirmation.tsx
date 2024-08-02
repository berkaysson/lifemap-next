import React, { useState } from "react";
import { Button } from "./button";

interface ButtonWithConfirmationProps {
  buttonText: string;
  onConfirm: () => void;
  size?: "sm" | "lg" | "default" | "icon" | null | undefined;
  variant?: "default" | "outline" | "destructive" | "ghost";
}

const ButtonWithConfirmation = ({
  buttonText,
  onConfirm,
  size = "default",
  variant = "default",
}: ButtonWithConfirmationProps) => {
  const [showConfirmation, setShowConfirmation] = useState(false);

  const handleInitialClick = () => {
    setShowConfirmation(true);
  };

  const handleCancel = () => {
    setShowConfirmation(false);
  };

  const handleConfirm = () => {
    onConfirm();
    setShowConfirmation(false);
  };

  if (showConfirmation) {
    return (
      <>
        <Button variant="outline" size="sm" onClick={handleCancel}>
          Cancel
        </Button>
        <Button variant={variant} size="sm" onClick={handleConfirm}>
          Confirm
        </Button>
      </>
    );
  }

  return (
    <Button onClick={handleInitialClick} variant={variant} size={size}>
      {buttonText}
    </Button>
  );
};

export default ButtonWithConfirmation;
