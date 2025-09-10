"use client";

import { LoginSchema } from "@/schema";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { z } from "zod";
import CardWrapper from "./AuthCardWrapper";
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
import Link from "next/link";
import { login } from "@/actions/login";
import { refreshPage } from "@/lib/utils";
import { Iconify } from "../ui/iconify";
import { LoadingButton } from "../ui/Buttons/loading-button";

const LoginForm = () => {
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);

  const form = useForm<z.infer<typeof LoginSchema>>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = (data: z.infer<typeof LoginSchema>) => {
    startTransition(() => {
      login(data).then((response) => {
        if (response.message) {
          setMessage(response.message);
          if (response.success) {
            setIsError(false);
            refreshPage();
          } else {
            setIsError(true);
          }
        }
      });
    });
  };

  return (
    <CardWrapper
      headerLabel="Welcome Back"
      backButtonHref="/auth/register"
      backButtonLabel="Don't have an account?"
      showSocial
    >
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="sm:space-y-6 space-y-4"
        >
          <div className="sm:space-y-4 space-y-2">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-foreground/70">Email</FormLabel>
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
                  <FormLabel className="text-foreground/70">Password</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Iconify
                        width={16}
                        icon="solar:lock-keyhole-minimalistic-line-duotone"
                        className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-shade"
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
                </FormItem>
              )}
            />
          </div>

          <div className="flex items-center justify-between">
            <Button
              variant="link"
              size="sm"
              asChild
              className="px-0 font-normal"
            >
              <Link href="/auth/reset-password">Forgot password?</Link>
            </Button>
          </div>

          {message && isError && (
            <FormMessage className="text-center">{message}</FormMessage>
          )}

          <LoadingButton
            isLoading={isPending}
            loadingText=""
            type="submit"
            className="w-full"
          >
            Login
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

export default LoginForm;
