import Link from "next/link";
import { Button } from "../ui/Buttons/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import Socials from "./Socials";

interface CardWrapperProps {
  children: React.ReactNode;
  headerLabel: string;
  backButtonLabel: string;
  backButtonHref: string;
  showSocial?: boolean;
}

const CardWrapper = ({
  children,
  headerLabel,
  backButtonLabel,
  backButtonHref,
  showSocial,
}: CardWrapperProps) => {
  return (
    <Card className="sm:w-[400px] w-[300px] shadow-2xl sm:mt-8 mt-4">
      <CardHeader>
        <CardTitle>
          <p className="text-4xl font-bold">{headerLabel}</p>
        </CardTitle>
      </CardHeader>
      <CardContent>{children}</CardContent>
      <CardContent>{showSocial && <Socials />}</CardContent>
      <CardFooter>
        <Button variant="ghost" size="sm" className="w-full" asChild>
          <Link className="w-full" href={backButtonHref}>
            {backButtonLabel}
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default CardWrapper;
