"use client";

import { useSession } from "next-auth/react";
import { useState, useTransition } from "react";
import { reset } from "@/actions/reset";
import { ResetSchema } from "@/schema";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/Forms/label";
import { Input } from "@/components/ui/Forms/input";
import { Button } from "@/components/ui/Buttons/button";
import { Separator } from "@/components/ui/separator";
import DashboardHeader from "@/layouts/sidebar/dashboard-header";
import { Iconify } from "@/components/ui/iconify";
export default function SettingsPage() {
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState("");
  const { data: session, status } = useSession();

  const onChangePasswordClick = () => {
    if (session?.user?.email) {
      const data = ResetSchema.parse({ email: session.user.email });
      startTransition(() => {
        reset(data).then((data: any) => {
          setMessage(data.message);
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
            <Input id="name" value={session.user.name || ""} readOnly />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" value={session.user.email || ""} readOnly />
          </div>
        </div>
        <Separator className="my-6" />
        <div className="flex flex-col items-start space-y-4">
          <Button
            onClick={onChangePasswordClick}
            variant="default"
            disabled={isPending}
            className="w-full"
          >
            <Iconify icon="solar:restart-bold" className="mr-1" />
            Request Password Reset
          </Button>
          {message && (
            <p className="text-sm text-muted-foreground">{message}</p>
          )}
        </div>
      </div>
    </div>
  );
}
