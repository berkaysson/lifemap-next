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
import { RegisterSchema } from "@/schema";
import CardWrapper from "./AuthCardWrapper";
import { register } from "@/actions/register";
import { Iconify } from "../ui/iconify";
import { LoadingButton } from "../ui/Buttons/loading-button";

const RegisterForm = () => {
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);

  const form = useForm<z.infer<typeof RegisterSchema>>({
    resolver: zodResolver(RegisterSchema),
    defaultValues: {
      email: "",
      password: "",
      name: "",
    },
  });

  const onSubmit = (data: z.infer<typeof RegisterSchema>) => {
    startTransition(() => {
      register(data).then((response: any) => {
        setMessage(response.message);
        if (response.success) {
          setIsError(false);
        } else {
          setIsError(true);
        }
      });
    });
  };

  return (
    <CardWrapper
      headerLabel="Register"
      backButtonHref="/auth/login"
      backButtonLabel="Already have an account?"
    >
      <Form {...form}>
        <form
          className="sm:space-y-6 space-y-4"
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <div className="flex flex-col sm:gap-4 gap-2">
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
                        className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
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
                  {form.formState.errors.email && (
                    <FormMessage>
                      {form.formState.errors.email.message}
                    </FormMessage>
                  )}
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Iconify
                        width={16}
                        icon="solar:lock-keyhole-minimalistic-line-duotone"
                        className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
                      />
                      <Input
                        disabled={isPending}
                        {...field}
                        placeholder="********"
                        type="password"
                        className="pl-10"
                      />
                    </div>
                  </FormControl>
                  {form.formState.errors.password && (
                    <FormMessage>
                      {form.formState.errors.password.message}
                    </FormMessage>
                  )}
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Iconify
                        width={16}
                        icon="solar:user-hand-up-line-duotone"
                        className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
                      />
                      <Input
                        disabled={isPending}
                        {...field}
                        placeholder="John"
                        type="John Doe"
                        className="pl-10"
                      />
                    </div>
                  </FormControl>
                  {form.formState.errors.name && (
                    <FormMessage className="mb-2">
                      {form.formState.errors.name.message}
                    </FormMessage>
                  )}
                </FormItem>
              )}
            />
          </div>

          {message && isError && <FormMessage>{message}</FormMessage>}
          {message && !isError && (
            <FormMessage className="text-green-500">{message}</FormMessage>
          )}

          <LoadingButton
            isLoading={isPending}
            loadingText=""
            type="submit"
            className="w-full"
          >
            Register
            <Iconify
              icon="solar:arrow-right-line-duotone"
              width={20}
              className="ml-1"
            />
          </LoadingButton>
        </form>
      </Form>
    </CardWrapper>
  );
};

export default RegisterForm;
