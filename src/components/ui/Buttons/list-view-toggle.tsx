import React from "react";
import { IconButton, Stack } from "@mui/material";
import { Iconify } from "../iconify";

const ListViewToggle = ({ onSelect, currentView }) => {
  return (
    <Stack direction="row" spacing={1} alignItems="center">
      <IconButton
        onClick={() => onSelect("table")}
        color={currentView === "table" ? "info" : "default"}
      >
        <Iconify icon="material-symbols:table-rows-narrow-rounded" className="h-5 w-5" />
      </IconButton>
      <IconButton
        onClick={() => onSelect("grid")}
        color={currentView === "grid" ? "info" : "default"}
      >
        <Iconify
          icon="si:grid-view-fill"
          className="h-5 w-5"
        />
      </IconButton>
    </Stack>
  );
};

export default ListViewToggle;
