import { CheckIcon, Search } from "lucide-react";
import { Button } from "../Buttons/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "../command";
import { FormControl } from "../Forms/form";
import { Popover, PopoverContent, PopoverTrigger } from "../popover";
import { cn } from "@/lib/utils";

/**
 * Renders a select box component with a popover and a selection list.
 *
 * @param {Object} props - The react hooks field prop.
 * @param {Object} props.field - The field object.
 * @param {Array} props.options - The options array.
 * @param {Object} props.form - The form object.
 * @param {string} props.optionKey - The key to access the option value.
 * @param {string} props.formKey - The key to set the form value.
 * @return {JSX.Element} The rendered select box component.
 */
const SelectBox = ({ field, options, form, optionKey, formKey }) => {
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
          <CommandInput placeholder="Search..." className="h-9" />
          <CommandList>
            <CommandEmpty>No option found.</CommandEmpty>
            <CommandGroup>
              {options.map((option) => (
                <CommandItem
                  className="z-50"
                  value={option.name}
                  key={option[optionKey]}
                  onSelect={() => {
                    form.setValue(formKey, option[optionKey]);
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

export default SelectBox;
