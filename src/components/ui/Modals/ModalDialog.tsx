import { DialogDescription, DialogTitle } from "@radix-ui/react-dialog";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTrigger,
} from "./dialog";
import { Button } from "../Buttons/button";
import { JSX } from "react";

interface ModalDialogProps {
  triggerButton: JSX.Element;
  title: string;
  description?: string;
  children?: React.ReactNode;
  isOpen?: boolean;
  setIsOpen?: React.Dispatch<React.SetStateAction<boolean>>;
}

const ModalDialog = ({
  triggerButton,
  title,
  description,
  children,
  isOpen,
  setIsOpen,
}: ModalDialogProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{triggerButton}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px] rounded-lg text-fore">
        <DialogHeader className="sm:flex sm:items-center">
          <DialogTitle className="text-lg font-semibold">{title}</DialogTitle>
          <DialogDescription className="mt-1 text-sm leading-6 text-slate">
            {description}
          </DialogDescription>
        </DialogHeader>

        {children}

        <DialogFooter className="mt-2 underline">
          <DialogClose asChild>
            <Button type="button" variant={"ghost"} size={"sm"}>
              Cancel
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ModalDialog;
