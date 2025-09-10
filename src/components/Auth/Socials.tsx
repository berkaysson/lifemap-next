import { signIn } from "next-auth/react";
import { Button } from "../ui/Buttons/button";
import { DEFAULT_LOGIN_REDIRECT } from "@/routes";
import { Iconify } from "../ui/iconify";

const Socials = () => {
  const onClick = (provider: "google" | "github") => {
    signIn(provider, { callbackUrl: DEFAULT_LOGIN_REDIRECT });
  };

  return (
    <div>
      <p className="text-sm text-shade">
        or continue with
      </p>
      <div className="flex gap-4 mt-2">
        <Button
          variant={"outline"}
          size={"sm"}
          onClick={() => onClick("google")}
        >
          <Iconify icon="logos:google-icon" />
        </Button>
        <Button
          variant={"outline"}
          size={"sm"}
          onClick={() => onClick("github")}
        >
          <Iconify icon="logos:github-icon" />
        </Button>
      </div>
    </div>
  );
};

export default Socials;
