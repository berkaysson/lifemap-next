"use client";

import { Button } from "@/components/ui/Buttons/button";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  const onClick = () => {
    router.push("/auth/login");
  };

  return (
    <main>
      <Button variant={"default"} size={"lg"} onClick={onClick}>
        Sign In
      </Button>
    </main>
  );
}
