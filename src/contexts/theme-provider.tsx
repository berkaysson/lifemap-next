"use client";

import { ThemeProvider as NextThemesProvider, useTheme } from "next-themes";
import {
  CssBaseline,
  ThemeProvider as MuiThemeProvider,
  createTheme,
} from "@mui/material";
import { useMemo, useEffect, useState } from "react";
import { getInitialTheme } from "@/lib/utils";

const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const [initialTheme, setInitialTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    const theme = getInitialTheme();
    setInitialTheme(theme);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme={initialTheme}
      enableSystem
    >
      <MuiThemeColorModeProvider>{children}</MuiThemeColorModeProvider>
    </NextThemesProvider>
  );
};

const MuiThemeColorModeProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { resolvedTheme } = useTheme();

  const muiTheme = useMemo(
    () =>
      createTheme({
        palette: {
          mode: resolvedTheme === "dark" ? "dark" : "light",
        },
      }),
    [resolvedTheme]
  );

  return (
    <MuiThemeProvider theme={muiTheme}>
      <CssBaseline />
      {children}
    </MuiThemeProvider>
  );
};

export default ThemeProvider;
