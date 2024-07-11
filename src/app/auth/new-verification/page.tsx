import NewVerificationForm from "@/components/Auth/NewVerificationForm";
import { Suspense } from "react";

const NewVerificationPage = () => {
  return (
    <div>
      <Suspense>
        <NewVerificationForm />
      </Suspense>
    </div>
  );
};

export default NewVerificationPage;
