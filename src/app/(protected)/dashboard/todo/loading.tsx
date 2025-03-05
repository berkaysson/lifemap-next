import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function Loading() {
  return (
    <div className="flex flex-col gap-2 m-2">
      <div className="flex sm:flex-row justify-between flex-col-reverse gap-2 mb-2">
        <Skeleton className="h-10 w-full sm:w-40" />
        <Skeleton className="h-10 w-full sm:w-20" />
      </div>

      {/* Table View Skeleton */}
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>
              <Skeleton className="h-4 w-full sm:w-20" />
            </TableHead>
            <TableHead>
              <Skeleton className="h-4 w-full sm:w-20" />
            </TableHead>
            <TableHead>
              <Skeleton className="h-4 w-full sm:w-20" />
            </TableHead>
            <TableHead>
              <Skeleton className="h-4 w-full sm:w-20" />
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {[...Array(10)].map((_, index) => (
            <TableRow key={index}>
              <TableCell>
                <Skeleton className="h-4 w-full" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-4 w-full" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-4 w-full" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-4 w-full" />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
