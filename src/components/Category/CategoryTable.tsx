"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import ButtonWithConfirmation from "@/components/ui/Buttons/ButtonWithConfirmation";
import { Button } from "../ui/Buttons/button";
import { Badge } from "../ui/badge";
import { Iconify } from "../ui/iconify";
import { Category } from "@prisma/client";
import { useDeleteCategory } from "@/queries/categoryQueries";
import CategoryEditForm from "./CategoryEditForm";
import { formatDate } from "@/lib/time";

const CategoryTable = ({
  sortedCategories,
}: {
  sortedCategories: Category[];
}) => {
  const { mutateAsync: deleteCategory } = useDeleteCategory();

  const handleDelete = async (category: Category) => {
    await deleteCategory(category.id);
  };

  return (
    <div className="space-y-4">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead className="sm:block hidden">Creation Date</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedCategories.map((category) => {
            return (
              <TableRow key={category.id}>
                <TableCell>
                  <Badge>{category.name}</Badge>
                </TableCell>
                <TableCell className="sm:block hidden">{formatDate(category.date)}</TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <CategoryEditForm
                      initialValues={category}
                      triggerButton={
                        <Button variant="outline" size="sm">
                          <Iconify
                            icon="solar:pen-new-square-outline"
                            width={16}
                          />
                        </Button>
                      }
                    />
                    <ButtonWithConfirmation
                      variant="destructive"
                      size="sm"
                      buttonText=""
                      onConfirm={() => handleDelete(category)}
                      icon="solar:trash-bin-trash-bold"
                    />
                  </div>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
};

export default CategoryTable;
