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
  if (items[0][sortBy] === undefined) return items;
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
