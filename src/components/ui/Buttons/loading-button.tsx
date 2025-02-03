"use client";

import type { ReactNode } from "react";

import { Button, ButtonProps } from "./button";
import { Iconify } from "../iconify";

interface LoadingButtonProps extends ButtonProps {
  children: ReactNode;
  loadingText?: string;
  isLoading?: boolean;
}

export function LoadingButton({
  children,
  isLoading = false,
  disabled,
  loadingText = "Loading",
  ...props
}: LoadingButtonProps) {
  return (
    <Button disabled={isLoading || disabled} {...props}>
      {isLoading ? (
        <>
          <Iconify icon="svg-spinners:3-dots-scale-middle" />
          {loadingText && <span className="ml-2">{loadingText}</span>}
        </>
      ) : (
        children
      )}
    </Button>
  );
}
