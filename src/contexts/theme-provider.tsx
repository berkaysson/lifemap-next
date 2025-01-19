"use client";

import { ThemeProvider as NextThemesProvider, useTheme } from "next-themes";
import {
  CssBaseline,
  ThemeProvider as MuiThemeProvider,
  createTheme,
} from "@mui/material";
import { useMemo } from "react";

const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const muiTheme = useMemo(
    () =>
      createTheme({
        palette: {
          mode: "light",
        },
      }),
    []
  );

  return (
    <NextThemesProvider attribute="class" defaultTheme="system" enableSystem>
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
