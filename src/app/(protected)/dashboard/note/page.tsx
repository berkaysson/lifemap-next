import DashboardHeader from "@/layouts/sidebar/dashboard-header";
import NoteList from "@/components/Notes/NoteList";
import { Suspense, lazy } from "react";
import Loading from "./loading";

const NoteForm = lazy(() => import("@/components/Notes/NoteForm"));

const NotePage = () => {
  return (
    <div>
      <DashboardHeader title="Notes" DialogComponent={<NoteForm />} />
      <Suspense fallback={<Loading />}>
        <NoteList />
      </Suspense>
    </div>
  );
};

export default NotePage;
