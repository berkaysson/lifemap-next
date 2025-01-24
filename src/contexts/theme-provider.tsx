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
  const [initialTheme, setInitialTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    const theme = getInitialTheme();
    setInitialTheme(theme);
  }, []);

  const muiTheme = useMemo(
    () =>
      createTheme({
        palette: {
          mode: initialTheme,
        },
      }),
    [initialTheme]
  );

  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme={initialTheme}
      enableSystem
    >
      <MuiThemeColorModeProvider>
        <MuiThemeProvider theme={muiTheme}>
          <CssBaseline />
          {children}
        </MuiThemeProvider>
      </MuiThemeColorModeProvider>
    </NextThemesProvider>
  );
};

const MuiThemeColorModeProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { theme } = useTheme();

  const muiTheme = useMemo(
    () =>
      createTheme({
        palette: {
          mode: theme === "dark" ? "dark" : "light",
        },
      }),
    [theme]
  );

  return <MuiThemeProvider theme={muiTheme}>{children}</MuiThemeProvider>;
};

export default ThemeProvider;
