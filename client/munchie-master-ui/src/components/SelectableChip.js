import React from "react";
import { Chip } from "@mui/material";
import CheckIcon from "@mui/icons-material/Check";

// Toggle chip for recipe categories, diets and filters. With a tagKey it uses
// that tag's color and icon (theme.palette.tags); otherwise it's coral.
const SelectableChip = ({ label, selected, onClick, tagKey, Icon }) => {
  const main = tagKey ? `tags.${tagKey}.main` : "accent.main";
  const contrast = tagKey
    ? `tags.${tagKey}.contrastText`
    : "accent.contrastText";

  return (
    <Chip
      label={label}
      onClick={onClick}
      icon={selected ? <CheckIcon /> : Icon ? <Icon /> : undefined}
      variant={selected ? "filled" : "outlined"}
      aria-pressed={selected}
      sx={{
        fontSize: "0.95rem",
        ...(selected
          ? {
              backgroundColor: main,
              color: contrast,
              "& .MuiChip-icon": { color: "inherit" },
              // Keep the tag color on hover; just dim it slightly
              "&:hover": { backgroundColor: main, opacity: 0.9 },
            }
          : {
              backgroundColor: "common.white",
              borderColor: "background.default",
              color: "primary.main",
              "& .MuiChip-icon": { color: main },
            }),
      }}
    />
  );
};

export default SelectableChip;
