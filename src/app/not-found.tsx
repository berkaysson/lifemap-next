"use client";

import Link from "next/link";
import { Button } from "@/components/ui/Buttons/button";
import { Iconify } from "@/components/ui/iconify";
import { useRouter } from "next/navigation";

export default function NotFound() {
  const router = useRouter();
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background text-foreground">
      <Iconify
        icon="solar:shield-warning-bold-duotone"
        className="w-16 h-16 mb-4"
        width={100}
      />
      <h1 className="text-4xl font-bold mb-4">404 - Page Not Found</h1>
      <p className="text-xl mb-8 text-center max-w-md">
        Oops! The page you&apos;re looking for doesn&apos;t exist or has been
        moved.
      </p>
      <div className="flex space-x-4">
        <Button asChild>
          <Link href="/" className="flex items-center">
            <Iconify
              icon="solar:home-angle-bold-duotone"
              className="mr-2 h-4 w-4"
            />
            Go to home
          </Link>
        </Button>
        <Button
          variant="outline"
          onClick={() => router.back()}
          className="flex items-center"
        >
          <Iconify
            icon="solar:arrow-left-bold-duotone"
            className="mr-2 h-4 w-4"
          />
          Return to last page
        </Button>
      </div>
    </div>
  );
}
