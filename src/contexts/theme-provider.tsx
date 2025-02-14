"use client";

import { ThemeProvider as NextThemesProvider, useTheme } from "next-themes";
import {
  CssBaseline,
  ThemeProvider as MuiThemeProvider,
  createTheme,
} from "@mui/material";
import { useMemo, useEffect, useState } from "react";
import { getInitialTheme, getCSSVariable } from "@/lib/utils";

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
          primary: {
            main: getCSSVariable("--color-primary"),
          },
          secondary: {
            main: getCSSVariable("--color-secondary"),
          },
          background: {
            default: getCSSVariable("--color-back"),
            paper: getCSSVariable("--background"),
          },
          text: {
            primary: getCSSVariable("--color-fore"),
          },
          success: {
            main: getCSSVariable("--color-success"),
          },
          warning: {
            main: getCSSVariable("--color-warning"),
          },
          error: {
            main: getCSSVariable("--color-error"),
          },
          info: {
            main: getCSSVariable("--color-info"),
          },
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
