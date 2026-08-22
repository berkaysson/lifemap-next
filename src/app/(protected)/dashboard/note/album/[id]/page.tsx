import DashboardHeader from "@/layouts/sidebar/dashboard-header";
import NoteList from "@/components/Notes/NoteList";
import NoteAlbumBreadcrumb from "@/components/Notes/Albums/NoteAlbumBreadcrumb";
import { Suspense, lazy } from "react";
import Loading from "./loading";

const NoteForm = lazy(() => import("@/components/Notes/NoteForm"));

interface AlbumPageProps {
  params: { id: string };
}

const AlbumPage = ({ params }: AlbumPageProps) => {
  const { id } = params;

  return (
    <div>
      <DashboardHeader title="Notes" DialogComponent={<NoteForm defaultAlbumId={id} />} />
      <div className="m-2">
        <NoteAlbumBreadcrumb albumId={id} />
      </div>
      <Suspense fallback={<Loading />}>
        <NoteList albumId={id} />
      </Suspense>
    </div>
  );
};

export default AlbumPage;
