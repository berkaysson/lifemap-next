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
import { useSearchParams, useRouter } from "next/navigation";
import { NewPasswordSchema } from "@/schema";
import CardWrapper from "./AuthCardWrapper";
import { newPassword } from "@/actions/new-password";
import { Iconify } from "../ui/iconify";
import { LoadingButton } from "../ui/Buttons/loading-button";
import { useToast } from "../ui/Misc/use-toast";
import { logout } from "@/actions/logout";

const NewPasswordForm = () => {
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const form = useForm<z.infer<typeof NewPasswordSchema>>({
    resolver: zodResolver(NewPasswordSchema),
    defaultValues: {
      password: "",
    },
  });

  const onSubmit = (data: z.infer<typeof NewPasswordSchema>) => {
    startTransition(() => {
      newPassword(data, token).then(async (response: any) => {
        setMessage(response.message);
        if (response.success) {
          setIsError(false);
          toast({
            title: "Your password has been updated.",
            description: "You will be redirected to login in 3 seconds...",
            variant: "default",
          });
          await logout();
          form.reset();
          setTimeout(() => {
            router.push("/auth/login");
          }, 3000);
        } else {
          setIsError(true);
        }
      });
    });
  };

  return (
    <CardWrapper
      headerLabel="Enter a new password"
      backButtonHref="/auth/login"
      backButtonLabel="Back to Login"
    >
      <Form {...form}>
        <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
          <div className="flex flex-col gap-4">
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Iconify
                        icon="solar:lock-keyhole-minimalistic-line-duotone"
                        className="mr-1 absolute top-1/2 -translate-y-1/2 left-3 text-muted-foreground"
                        width={16}
                      />
                      <Input
                        className="pl-10"
                        disabled={isPending}
                        {...field}
                        placeholder="******"
                        type="password"
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
          </div>

          {message && isError && <FormMessage>{message}</FormMessage>}

          <LoadingButton
            isLoading={isPending}
            variant="default"
            type="submit"
            className="w-full"
            loadingText="Changing Password..."
          >
            Change Password
          </LoadingButton>
        </form>
      </Form>
    </CardWrapper>
  );
};

export default NewPasswordForm;
