import { forwardRef } from "react";
import { Icon, disableCache } from "@iconify/react";
import Box from "@mui/material/Box";
import NoSsr from "@mui/material/NoSsr";

const iconifyClasses = {
  root: "iconify",
};

interface IconifyProps {
  className?: string;
  width?: number;
  icon: string;
  sx?: object;
}

export const Iconify = forwardRef<HTMLElement, IconifyProps>(
  ({ className, width = 20, sx, icon, ...other }, ref) => {
    const baseStyles = {
      width,
      height: width,
      flexShrink: 0,
      display: "inline-flex",
    };

    const renderFallback = (
      <Box
        component="span"
        className={iconifyClasses.root.concat(className ? ` ${className}` : "")}
        sx={{ ...baseStyles, ...sx }}
      />
    );

    return (
      <NoSsr fallback={renderFallback}>
        <Box
          ref={ref}
          component="span"
          className={iconifyClasses.root.concat(
            className ? ` ${className}` : ""
          )}
          sx={{ ...baseStyles, ...sx }}
          {...other}
        >
          <Icon icon={icon} width={width} />
        </Box>
      </NoSsr>
    );
  }
);

Iconify.displayName = "Iconify";

// Disable Iconify cache for local icons
disableCache("local");
