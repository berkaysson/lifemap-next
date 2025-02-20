"use client";

import { useEffect, useState } from "react";
import { CheckIcon, PlusCircle, Search } from "lucide-react";
import { Button } from "../ui/Buttons/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "../ui/command";
import { FormControl } from "../ui/Forms/form";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { cn } from "@/lib/utils";
import {
  useFetchCategories,
  useCreateCategory,
} from "@/queries/categoryQueries";
import { Input } from "../ui/Forms/input";
import { LoadingButton } from "../ui/Buttons/loading-button";
import { Label } from "../ui/Forms/label";
import { Iconify } from "../ui/iconify";

const CategorySelectCreate = ({ field, form }) => {
  const { data: categories } = useFetchCategories();
  const { mutateAsync: createCategory } = useCreateCategory();
  const [searchTerm, setSearchTerm] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const options = categories || [];
  const optionKey = "id";
  const formKey = "categoryId";

  const handleCreateCategory = async () => {
    if (!newCategoryName) return;

    setIsLoading(true);
    try {
      await createCategory({ name: newCategoryName });
    } catch (error) {
      console.error("Failed to create category:", error);
    }
    setIsLoading(false);
    setIsCreating(false);
    setNewCategoryName("");
    setSearchTerm("");
  };

  useEffect(() => {
    if (isCreating) {
      setIsCreating(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchTerm]);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <FormControl>
          <Button
            variant="outline"
            role="combobox"
            className={cn(
              "w-[200px] bg-background justify-between",
              !field.value && ""
            )}
          >
            <span className="truncate">
              {field.value
                ? options.find((option) => option[optionKey] === field.value)
                    ?.name
                : "Select"}
            </span>
            <Search className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </FormControl>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput
            placeholder="Search..."
            className="h-9"
            value={searchTerm}
            onValueChange={setSearchTerm}
          />
          <CommandList>
            <CommandEmpty>
              {isCreating ? (
                <div className="p-2">
                  <Label className="mb-1 text-sm">Name</Label>
                  <Input
                    value={newCategoryName}
                    onChange={(e) => setNewCategoryName(e.target.value)}
                    placeholder="New category name"
                    className="mb-2"
                    min={3}
                    max={30}
                  />
                  <LoadingButton
                    onClick={handleCreateCategory}
                    className="w-full"
                    isLoading={isLoading}
                    loadingText=""
                    size={"sm"}
                  >
                    Create Category
                  </LoadingButton>
                </div>
              ) : (
                <Button
                  onClick={() => {
                    setIsCreating(true);
                    setNewCategoryName(searchTerm);
                  }}
                  className="w-full my-1 underline hover:no-underline"
                  variant="link"
                  size={"sm"}
                >
                  <Iconify icon="solar:add-square-bold" className="mr-1" width={20} />
                  Create &quot;{searchTerm}&quot;
                </Button>
              )}
            </CommandEmpty>
            <CommandGroup>
              {options
                .filter((option) =>
                  option.name.toLowerCase().includes(searchTerm.toLowerCase())
                )
                .map((option) => (
                  <CommandItem
                    className="z-50"
                    value={option.name}
                    key={option[optionKey]}
                    onSelect={() => {
                      form.setValue(formKey, option[optionKey]);
                      setSearchTerm("");
                    }}
                  >
                    <span className="truncate">{option.name}</span>

                    <CheckIcon
                      className={cn(
                        "ml-auto h-4 w-4 min-w-3",
                        option[optionKey] === field.value
                          ? "opacity-100"
                          : "opacity-0"
                      )}
                    />
                  </CommandItem>
                ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default CategorySelectCreate;
