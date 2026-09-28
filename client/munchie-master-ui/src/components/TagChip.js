import React from "react";
import { Chip } from "@mui/material";

// Recipe tag in its own color and icon (see theme.palette.tags)
const TagChip = ({ tag, size = "small", sx }) => (
  <Chip
    size={size}
    label={tag.label}
    icon={tag.Icon ? <tag.Icon /> : undefined}
    sx={{
      flexShrink: 0,
      backgroundColor: `tags.${tag.key}.main`,
      color: `tags.${tag.key}.contrastText`,
      "& .MuiChip-icon": { color: "inherit" },
      ...sx,
    }}
  />
);

export default TagChip;
