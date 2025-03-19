import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function refreshPage() {
  window.location.reload();
}

export function sortArrayOfObjectsByKey<T>(
  items: T[],
  sortBy: keyof T,
  direction: "asc" | "desc" = "asc"
): T[] {
  if (items.length === 0 || items[0][sortBy] === undefined) return items;
  return [...items].sort((a, b) => {
    if (a[sortBy] < b[sortBy]) return direction === "asc" ? -1 : 1;
    if (a[sortBy] > b[sortBy]) return direction === "asc" ? 1 : -1;
    return 0;
  });
}

export function logService(service: string) {
  console.log(`Service: ${service}`);
}

export function getInitialTheme(): "light" | "dark" {
  const theme = localStorage.getItem("theme");

  if (theme === "dark" || theme === "light") {
    return theme;
  }

  return "light";
}

export const getCSSVariable = (variableName: string) => {
  if (typeof window !== "undefined") {
    return getComputedStyle(document.documentElement)
      .getPropertyValue(variableName)
      .trim();
  }
  return "#000";
};

export function getContrastColor(hexColor: string): "white" | "black" {
  const hex = hexColor.replace("#", "");

  const r = Number.parseInt(hex.substring(0, 2), 16);
  const g = Number.parseInt(hex.substring(2, 4), 16);
  const b = Number.parseInt(hex.substring(4, 6), 16);

  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;

  return luminance > 0.5 ? "black" : "white";
}
