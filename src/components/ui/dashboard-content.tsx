import { ReactNode } from "react";
import { Container } from "@mui/material";
import { useTheme } from "@mui/system";

interface DashboardContentProps {
  sx?: Record<string, unknown>;
  children: ReactNode;
  disablePadding?: boolean;
  maxWidth?: "xs" | "sm" | "md" | "lg" | "xl" | false;
}

export function DashboardContent({
  sx,
  children,
  disablePadding,
  maxWidth = "lg",
  ...other
}: DashboardContentProps) {
  const theme = useTheme();

  const layoutQuery = "lg";

  return (
    <Container
      className="layout-dashboard-content"
      maxWidth={maxWidth}
      sx={{
        display: "flex",
        flex: "1 1 auto",
        flexDirection: "column",
        pt: "var(--layout-dashboard-content-pt)",
        pb: "var(--layout-dashboard-content-pb)",
        [theme.breakpoints.up(layoutQuery)]: {
          px: "var(--layout-dashboard-content-px)",
        },
        ...(disablePadding && {
          p: {
            xs: 0,
            sm: 0,
            md: 0,
            lg: 0,
            xl: 0,
          },
        }),
        ...sx,
      }}
      {...other}
    >
      {children}
    </Container>
  );
}
