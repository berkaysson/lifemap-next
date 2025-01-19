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
import { SortAsc, SortDesc } from "lucide-react";
import { Button } from "../Buttons/button";

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
      <Button size={"icon"} variant={"ghost"} onClick={toggleDirection}>
        {direction === "asc" ? <SortAsc /> : <SortDesc />}
      </Button>
    </div>
  );
};

export default SelectSort;
