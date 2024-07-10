"use client";

import { LoginSchema } from "@/schema";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import CardWrapper from "./AuthCardWrapper";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import Link from "next/link";
import { login } from "@/actions/login";

const LoginForm = () => {
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState("");

  const form = useForm<z.infer<typeof LoginSchema>>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = (data: z.infer<typeof LoginSchema>) => {
    startTransition(() => {
      login(data).then((data: any) => {
        if (data.message) {
          setMessage(data.message);
          console.log("🚀 ~ file: LoginForm.tsx:37 ~ login ~ data:", data);
        }
      });
    });
  };

  return (
    <CardWrapper
      headerLabel="Login"
      backButtonHref="/auth/register"
      backButtonLabel="Dont have an account?"
      showSocial
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
                    <Input
                      disabled={isPending}
                      {...field}
                      placeholder="john.doe@example.com"
                      type="email"
                    />
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
                    <Input
                      disabled={isPending}
                      {...field}
                      placeholder="********"
                      type="password"
                    />
                  </FormControl>
                  <Button variant="link" size={"sm"} asChild className="p-0">
                    <Link href="/auth/reset-password">Forgot Password?</Link>
                  </Button>
                </FormItem>
              )}
            />
          </div>

          {message && <FormMessage>{message}</FormMessage>}

          <Button
            disabled={isPending}
            variant="default"
            type="submit"
            className="w-full"
          >
            Login
          </Button>
        </form>
      </Form>
    </CardWrapper>
  );
};

export default LoginForm;
