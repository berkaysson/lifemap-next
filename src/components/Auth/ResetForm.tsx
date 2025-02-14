"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/Forms/form";
import { Input } from "../ui/Forms/input";
import { useState, useTransition } from "react";
import { ResetSchema } from "@/schema";
import CardWrapper from "./AuthCardWrapper";
import { reset } from "@/actions/reset";
import { Iconify } from "../ui/iconify";
import { LoadingButton } from "../ui/Buttons/loading-button";
import { useToast } from "../ui/Misc/use-toast";

const ResetForm = () => {
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof ResetSchema>>({
    resolver: zodResolver(ResetSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = (data: z.infer<typeof ResetSchema>) => {
    startTransition(() => {
      reset(data).then((response: any) => {
        setMessage(response.message);
        if (response.success) {
          setIsError(false);
          toast({
            title: "Password Reset Email Sent.",
            description: "Please check your email.",
            variant: "default",
          });
        } else {
          setIsError(true);
        }
      });
    });
  };

  return (
    <CardWrapper
      headerLabel="Reset Your Password"
      backButtonHref="/auth/login"
      backButtonLabel="Back to Login"
    >
      <Form {...form}>
        <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
          <div className="flex flex-col gap-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Iconify
                        width={16}
                        icon="solar:letter-line-duotone"
                        className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-shade"
                      />
                      <Input
                        disabled={isPending}
                        {...field}
                        placeholder="john.doe@example.com"
                        type="email"
                        className="pl-10"
                      />
                    </div>
                  </FormControl>
                </FormItem>
              )}
            />
          </div>

          {message && isError && <FormMessage>{message}</FormMessage>}

          <LoadingButton
            isLoading={isPending}
            loadingText="Sending Email..."
            variant="default"
            type="submit"
            className="w-full"
          >
            Reset Password
          </LoadingButton>
        </form>
      </Form>
    </CardWrapper>
  );
};

export default ResetForm;
