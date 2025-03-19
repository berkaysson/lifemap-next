"use client";

import * as React from "react";
import { Check } from "lucide-react";

import { cn } from "@/lib/utils";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "../Buttons/button";

interface ColorPickerProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  className?: string;
}

const colorOptions = [
  { value: "#db4242", label: "Vibrant Red" },
  { value: "#be8836", label: "Warm Orange" },
  { value: "#b69a2b", label: "Golden Yellow" },
  { value: "#31bb48", label: "Fresh Green" },
  { value: "#13a19d", label: "Teal Cyan" },
  { value: "#164f91", label: "Vivid Blue" },
  { value: "#972e51", label: "Soft Magenta" },
  { value: "#85422a", label: "Earthy Brown" },
  { value: "#714DD9", label: "Purple" },
  { value: "#ABC4FF", label: "Soft Blue" },
];

export function ColorPicker({
  value,
  onChange,
  disabled,
  className,
}: ColorPickerProps) {
  const [open, setOpen] = React.useState(false);

  // Set default color if none provided
  React.useEffect(() => {
    if (!value) {
      onChange(colorOptions[0].value);
    }
  }, [value, onChange]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild className="block">
        <Button
          variant="outline"
          size="sm"
          className={cn(
            "w-20 h-8 p-1 border-2 justify-start",
            disabled && "opacity-50 cursor-not-allowed",
            className
          )}
          style={{ backgroundColor: value }}
          disabled={disabled}
        >
          <span className="sr-only">Open color picker</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-64 p-3">
        <div className="grid grid-cols-5 gap-2">
          {colorOptions.map((color) => (
            <button
              key={color.value}
              className={cn(
                "h-8 w-8 rounded-full border border-gray-200 flex items-center justify-center",
                value === color.value && "ring-2 ring-offset-2 ring-black"
              )}
              style={{ backgroundColor: color.value }}
              onClick={() => {
                onChange(color.value);
                setOpen(false);
              }}
              title={color.label}
              type="button"
            >
              {value === color.value && (
                <Check
                  className={cn(
                    "h-4 w-4",
                    getContrastColor(color.value) === "white"
                      ? "text-white"
                      : "text-black"
                  )}
                />
              )}
              <span className="sr-only">{color.label}</span>
            </button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
}

function getContrastColor(hexColor: string): "white" | "black" {
  const hex = hexColor.replace("#", "");

  const r = Number.parseInt(hex.substring(0, 2), 16);
  const g = Number.parseInt(hex.substring(2, 4), 16);
  const b = Number.parseInt(hex.substring(4, 6), 16);

  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;

  return luminance > 0.5 ? "black" : "white";
}
