"use client";

import { useSession } from "next-auth/react";
import { useTransition } from "react";
import { reset } from "@/actions/reset";
import { ResetSchema } from "@/schema";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/Forms/label";
import { Input } from "@/components/ui/Forms/input";
import { Separator } from "@/components/ui/separator";
import DashboardHeader from "@/layouts/sidebar/dashboard-header";
import { Iconify } from "@/components/ui/iconify";
import { LoadingButton } from "@/components/ui/Buttons/loading-button";
import { useToast } from "@/components/ui/Misc/use-toast";
export default function SettingsPage() {
  const [isPending, startTransition] = useTransition();
  const { data: session, status } = useSession();
  const { toast } = useToast();

  const onChangePasswordClick = () => {
    if (session?.user?.email) {
      const data = ResetSchema.parse({ email: session.user.email });
      startTransition(() => {
        reset(data).then(() => {
          toast({
            title: "Password Reset Email Sent",
            description: "Please check your email.",
            duration: 3000,
          });
        });
      });
    }
  };

  if (status !== "authenticated") {
    return (
      <Card className="w-full max-w-md mx-auto mt-8">
        <CardContent className="pt-6">
          <p className="text-center text-gray-700">
            You are not authenticated.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div>
      <DashboardHeader title="Settings" />
      <div className="w-full max-w-md mx-auto my-8 p-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              className="opacity-80"
              id="name"
              value={session.user.name || ""}
              readOnly
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              className="opacity-80"
              id="email"
              value={session.user.email || ""}
              readOnly
            />
          </div>
        </div>
        <Separator className="my-6" />
        <div className="flex flex-col items-start space-y-4">
          <LoadingButton
            onClick={onChangePasswordClick}
            variant="default"
            type="button"
            isLoading={isPending}
            loadingText="Sending Email..."
            disabled={isPending}
            className="w-full"
          >
            <Iconify icon="solar:restart-bold" className="mr-1" />
            Request Password Reset
          </LoadingButton>
        </div>
      </div>
    </div>
  );
}
