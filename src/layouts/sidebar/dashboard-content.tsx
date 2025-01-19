"use client";

import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import { Card } from "../../components/ui/card";

interface MainProps extends React.ComponentPropsWithoutRef<"main"> {
  children: React.ReactNode;
  sx?: object;
}

export const Main: React.FC<MainProps> = ({ children, sx, ...other }) => {
  return (
    <Box
      component="main"
      sx={{
        display: "flex",
        flex: "1 1 auto",
        flexDirection: "column",
        ...sx,
      }}
      {...other}
    >
      {children}
    </Box>
  );
};

interface DashboardContentProps extends React.ComponentPropsWithoutRef<"div"> {
  children: React.ReactNode;
  sx?: object;
  disablePadding?: boolean;
  maxWidth?: false | "xs" | "sm" | "md" | "lg" | "xl";
}

export const DashboardContent: React.FC<DashboardContentProps> = ({
  children,
  sx,
  disablePadding,
  maxWidth = "lg",
  ...other
}) => {
  return (
    <Container
      maxWidth={maxWidth}
      sx={{
        display: "flex",
        flex: "1 1 auto",
        flexDirection: "column",
        pt: 2,
        pb: 2,
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
      <Card className="min-h-[50vh]">{children}</Card>
    </Container>
  );
};
