import React, { useEffect, useState } from "react";
import { IconButton, Stack } from "@mui/material";
import { Iconify } from "../iconify";
import { useTheme } from "next-themes";

const ListViewToggle = ({ onSelect, currentView }) => {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  const activeColor = resolvedTheme === "dark" ? "primary" : "info";
  const inactiveColor = "default";

  return (
    <Stack direction="row" spacing={1} alignItems="center">
      <IconButton
        onClick={() => onSelect("table")}
        color={currentView === "table" ? activeColor : inactiveColor}
        sx={{
          "&.MuiIconButton-root": {
            transition: "all 0.2s ease-in-out",
          },
        }}
      >
        <Iconify
          icon="material-symbols:table-rows-narrow-rounded"
          className="h-5 w-5"
        />
      </IconButton>
      <IconButton
        onClick={() => onSelect("grid")}
        color={currentView === "grid" ? activeColor : inactiveColor}
        sx={{
          "&.MuiIconButton-root": {
            transition: "all 0.2s ease-in-out",
          },
        }}
      >
        <Iconify icon="si:grid-view-fill" className="h-5 w-5" />
      </IconButton>
    </Stack>
  );
};

export default ListViewToggle;
