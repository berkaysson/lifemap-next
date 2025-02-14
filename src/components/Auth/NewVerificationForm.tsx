"use client";

import { useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import CardWrapper from "./AuthCardWrapper";
import { newVerification } from "@/actions/new-verification";
import { CheckCircle, XCircle, Loader2 } from "lucide-react";

const NewVerificationForm = () => {
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const onSubmit = useCallback(() => {
    if (!token) {
      setIsLoading(false);
      setIsError(true);
      setMessage(
        "Missing verification token. Please try the verification link again."
      );
      return;
    }

    newVerification(token)
      .then((response) => {
        setIsLoading(false);
        setMessage(response.message);
        setIsError(!response.success);
      })
      .catch((error) => {
        console.error(error);
        setIsLoading(false);
        setIsError(true);
        setMessage(
          "An error occurred during verification. Please try again later."
        );
      });
  }, [token]);

  useEffect(() => {
    onSubmit();
  }, [onSubmit]);

  return (
    <CardWrapper
      headerLabel="Confirm Your Email"
      backButtonLabel="Back to login"
      backButtonHref="/auth/login"
      showSocial={false}
    >
      <div className="flex flex-col items-center justify-center space-y-4">
        {isLoading && (
          <div className="flex flex-col items-center space-y-2">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-sm text-shade">
              Verifying your email...
            </p>
          </div>
        )}

        {!isLoading && isError && (
          <div className="flex flex-col items-center space-y-2">
            <XCircle className="h-8 w-8 text-destructive" />
            <p className="text-sm text-destructive text-center">{message}</p>
          </div>
        )}

        {!isLoading && !isError && (
          <div className="flex flex-col items-center space-y-2">
            <CheckCircle className="h-8 w-8 text-primary" />
            <p className="text-sm text-primary text-center">{message}</p>
          </div>
        )}
      </div>
    </CardWrapper>
  );
};

export default NewVerificationForm;
