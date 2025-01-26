import React from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "../select";
import { Iconify } from "../iconify";
import { IconButton } from "@mui/material";

interface SortOption {
  value: string;
  label: string;
}

interface SortSelectProps {
  options: SortOption[];
  onSelect: (sortBy: any, direction: "asc" | "desc") => void;
}

const SelectSort: React.FC<SortSelectProps> = ({ options, onSelect }) => {
  const [sortBy, setSortBy] = React.useState("");
  const [direction, setDirection] = React.useState<"asc" | "desc">("asc");

  const handleSortChange = (value: string) => {
    setSortBy(value);
    onSelect(value, direction);
  };

  const toggleDirection = () => {
    const newDirection = direction === "asc" ? "desc" : "asc";
    setDirection(newDirection);
    onSelect(sortBy, newDirection);
  };

  return (
    <div className="flex flex-row gap-2">
      <Select onValueChange={handleSortChange}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Select a Sort Option" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Sort by</SelectLabel>
            {options.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
      <IconButton onClick={toggleDirection}>
        {direction === "asc" ? (
          <Iconify
            icon="solar:sort-from-bottom-to-top-bold"
            className="dark:text-white text-black"
          />
        ) : (
          <Iconify
            icon="solar:sort-from-top-to-bottom-bold"
            className="dark:text-white text-black"
          />
        )}
      </IconButton>
    </div>
  );
};

export default SelectSort;
