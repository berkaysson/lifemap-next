"use client";

import { logout } from "@/actions/logout";
import { reset } from "@/actions/reset";
import { Button } from "@/components/ui/Buttons/button";
import { refreshPage } from "@/lib/utils";
import { ResetSchema } from "@/schema";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

const SettingsPage = () => {
  const [isPending, startTransition] = useTransition();
  const [isPreOn, setIsPreOn] = useState(false);
  const [message, setMessage] = useState("");
  const router = useRouter();
  const { data: session, status } = useSession();
  console.log("🚀 ~ file: page.tsx:8 ~ SettingsPage ~ data:", session);

  const onClick = () => {
    logout().then(() => {
      setIsPreOn(false);
      router.push("/auth/login");
      refreshPage();
    });
  };

  const onChangePasswordClick = () => {
    if (session && session.user.email) {
      const data = ResetSchema.parse({ email: session.user.email });
      startTransition(() => {
        reset(data).then((data: any) => {
          setMessage(data.message);
        });
      });
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md p-8 bg-white rounded shadow-md">
        <h2 className="text-2xl font-semibold mb-4">User Settings</h2>
        {status === "authenticated" ? (
          <div className="mb-4">
            <p className="text-gray-700">
              <strong>Name:</strong> {session.user.name}
            </p>
            <p className="text-gray-700">
              <strong>Email:</strong> {session.user.email}
            </p>
            <p className="text-gray-700">
              <strong>Role:</strong> {session.user.role}
            </p>

            <Button
              variant={"outline"}
              size={"sm"}
              onClick={() => setIsPreOn((prev) => !prev)}
              className="w-full mt-4"
            >
              {isPreOn ? "Hide" : "Show"} JSON
            </Button>
            {isPreOn && (
              <pre className="text-xs bg-gray-100 p-2 rounded m-4 overflow-x-auto">
                {JSON.stringify(session, null, 2)}
              </pre>
            )}
          </div>
        ) : (
          <p className="text-gray-700">You are not authenticated.</p>
        )}
        <div className="flex justify-between mt-8">
          <div>
            <Button
              onClick={onChangePasswordClick}
              variant="outline"
              size={"sm"}
              disabled={isPending}
            >
              Request Password Reset
            </Button>
            {message && <p className="p-2">{message}</p>}
          </div>

          <Button variant={"destructive"} size={"default"} onClick={onClick}>
            Sign Out
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
