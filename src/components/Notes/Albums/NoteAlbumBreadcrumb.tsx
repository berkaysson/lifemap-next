"use client";

import Link from "next/link";
import { useFetchNoteAlbum } from "@/queries/noteAlbumQueries";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Iconify } from "@/components/ui/iconify";
import { Skeleton } from "@/components/ui/skeleton";

interface NoteAlbumBreadcrumbProps {
  albumId: string;
}

/** Recursively renders the breadcrumb by walking up the ancestor chain */
const NoteAlbumBreadcrumb = ({ albumId }: NoteAlbumBreadcrumbProps) => {
  const { data: album, isLoading } = useFetchNoteAlbum(albumId);

  if (isLoading) {
    return (
      <div className="flex items-center gap-2 mb-4">
        <Skeleton className="h-5 w-16" />
        <Skeleton className="h-5 w-4" />
        <Skeleton className="h-5 w-24" />
      </div>
    );
  }

  if (!album) return null;

  // Build ancestor chain from the fetched album's parent reference
  const ancestors: { id: string; name: string; icon?: string | null }[] = [];
  let current: typeof album.parent | null = album.parent ?? null;
  while (current) {
    ancestors.unshift(current as any);
    current = (current as any).parent ?? null;
  }

  return (
    <Breadcrumb className="mb-4">
      <BreadcrumbList>
        {/* Root */}
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <Link
              href="/dashboard/note"
              className="flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors"
            >
              <Iconify icon="solar:document-text-bold-duotone" width={14} />
              Notes
            </Link>
          </BreadcrumbLink>
        </BreadcrumbItem>

        {/* Intermediate ancestors */}
        {ancestors.map((ancestor) => (
          <div key={ancestor.id} className="inline-flex items-center gap-1.5 sm:gap-2.5">
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link
                  href={`/dashboard/note/album/${ancestor.id}`}
                  className="flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {(ancestor as any).icon && (
                    <span className="text-sm">{(ancestor as any).icon}</span>
                  )}
                  {ancestor.name}
                </Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
          </div>
        ))}

        {/* Current album */}
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbPage className="flex items-center gap-1 font-semibold text-foreground">
            {album.icon && <span className="text-sm">{album.icon}</span>}
            {album.name}
          </BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  );
};

export default NoteAlbumBreadcrumb;
