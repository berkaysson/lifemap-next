import NewPasswordForm from "@/components/Auth/NewPasswordForm";
import { Suspense } from "react";

const NewPasswordPage = () => {
  return (
    <div>
      <Suspense>
        <NewPasswordForm />
      </Suspense>
    </div>
  );
};

export default NewPasswordPage;
