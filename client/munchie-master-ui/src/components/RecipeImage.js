import React from "react";
import { Box } from "@mui/material";
import RestaurantIcon from "@mui/icons-material/Restaurant";
import { uploadUrl } from "../utils/recipeUtils";

// Recipe photo, or a themed placeholder when the recipe has none
const RecipeImage = ({ image, alt, sx }) =>
  image ? (
    <Box
      component="img"
      src={uploadUrl(image)}
      alt={alt}
      sx={{ display: "block", width: "100%", objectFit: "cover", ...sx }}
    />
  ) : (
    <Box
      role="img"
      aria-label={alt}
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: "100%",
        backgroundColor: "tiles.cream",
        color: "background.default",
        ...sx,
      }}
    >
      <RestaurantIcon sx={{ fontSize: 64 }} />
    </Box>
  );

export default RecipeImage;
