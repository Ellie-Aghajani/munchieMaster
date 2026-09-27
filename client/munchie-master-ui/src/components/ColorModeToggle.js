import React from "react";
import { IconButton, Tooltip } from "@mui/material";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined";
import { useColorMode } from "../contexts/ColorModeContext";

// Sun/moon button for the navbars; switches between light and dark mode
const ColorModeToggle = ({ sx }) => {
  const { mode, toggleMode } = useColorMode();
  const label =
    mode === "light" ? "Switch to dark mode" : "Switch to light mode";

  return (
    <Tooltip title={label}>
      <IconButton
        color="inherit"
        onClick={toggleMode}
        aria-label={label}
        sx={sx}
      >
        {mode === "light" ? (
          <DarkModeOutlinedIcon />
        ) : (
          <LightModeOutlinedIcon />
        )}
      </IconButton>
    </Tooltip>
  );
};

export default ColorModeToggle;
