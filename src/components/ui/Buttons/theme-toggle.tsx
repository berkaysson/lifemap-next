"use client";

import { useTheme } from "next-themes";
import { IconButton } from "@mui/material";
import { useEffect, useState } from "react";
import { Iconify } from "../iconify";

const ThemeToggle = () => {
  const { theme, setTheme, systemTheme } = useTheme();
  const [currentTheme, setCurrentTheme] = useState<string | undefined>(
    undefined
  );

  useEffect(() => {
    setCurrentTheme(theme === "system" ? systemTheme : theme);
  }, [theme, systemTheme]);

  const toggleTheme = () => {
    setTheme(currentTheme === "light" ? "dark" : "light");
  };

  return (
    <IconButton onClick={toggleTheme}>
      {currentTheme === "light" ? (
        <Iconify icon="solar:moon-stars-bold" className="text-fore" />
      ) : (
        <Iconify icon="solar:sun-bold" className="text-fore" />
      )}
    </IconButton>
  );
};

export default ThemeToggle;
