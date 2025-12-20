import React from "react";
import { Button } from "../ui/Buttons/button";
import { Iconify } from "../ui/iconify";

export const ActivityFromTriggerButton = ({
  open,
  setMessage,
  setIsError,
}: {
  open: () => void;
  setMessage: (message: string) => void;
  setIsError: (isError: boolean) => void;
}) => {
  return (
    <Button
      onClick={() => {
        setMessage("");
        setIsError(false);
        open();
      }}
      className="fixed bottom-6 right-6 group h-16 w-16 sm:w-auto sm:pr-8 sm:pl-3 p-0 rounded-2xl bg-white/[0.03] backdrop-blur-2xl border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5)] transition-all duration-500 hover:scale-105 hover:bg-white/[0.08] hover:border-white/20 active:scale-95 z-50 flex items-center justify-center sm:justify-start sm:gap-4"
    >
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-secondary to-primary rounded-xl blur-lg opacity-40 group-hover:opacity-70 group-hover:scale-125 transition-all duration-500" />
        <div className="relative h-11 w-11 rounded-xl bg-gradient-to-br from-secondary to-primary flex items-center justify-center shadow-lg transform group-hover:-rotate-6 transition-all duration-500">
          <Iconify
            icon="solar:bolt-circle-bold-duotone"
            width={28}
            className="text-black"
          />
        </div>
      </div>

      <div className="hidden sm:flex flex-col items-start leading-none">
        <span className="text-[10px] font-black uppercase tracking-[0.15em] text-primary mb-1">
          Log Progress
        </span>
        <span className="text-base font-bold text-foreground tracking-tight">
          Create Activity
        </span>
      </div>
    </Button>
  );
};
