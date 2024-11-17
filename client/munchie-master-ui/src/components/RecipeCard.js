import React from "react";
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Box,
  IconButton,
  Paper,
} from "@mui/material";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
import config from "../config";

const RecipeCard = ({
  recipe,
  userLikedRecipes = [],
  userSavedRecipes = [],
  onLike,
  onSave,
}) => {
  return (
    <Card
      sx={{ height: "100%", display: "flex", flexDirection: "column" }}
      key={recipe._id}
    >
      <CardMedia
        component="img"
        height="200"
        image={
          recipe.image
            ? `${config.serverUrl}/uploads/${recipe.image.replace(
                /^\/?uploads\/?/,
                ""
              )}`
            : "https://via.placeholder.com/200" // Fallback image
        }
        alt={recipe.name || "Recipe Image"}
      />
      <CardContent sx={{ flexGrow: 1 }}>
        <Typography gutterBottom variant="h5" component="div">
          {recipe.name}
        </Typography>
        <Box display="flex" alignItems="center" mb={2}>
          <AccessTimeIcon sx={{ mr: 1 }} />
          <Typography variant="body2" color="text.secondary">
            {recipe.preparationTime || "N/A"}
          </Typography>
        </Box>
        <Typography variant="body2" color="text.secondary" paragraph>
          Ingredients: {(recipe.ingredients || []).slice(0, 3).join(", ")}
          {recipe.ingredients && recipe.ingredients.length > 3 && "..."}
        </Typography>

        <Paper
          elevation={3}
          sx={{
            maxHeight: 200,
            overflowY: "auto",
            padding: 2,
            backgroundColor: "#f8f8f8",
            borderRadius: 2,
            "&::-webkit-scrollbar": {
              width: "6px",
            },
            "&::-webkit-scrollbar-track": {
              backgroundColor: "#f1f1f1",
            },
            "&::-webkit-scrollbar-thumb": {
              backgroundColor: "#888",
              borderRadius: "3px",
            },
            "&::-webkit-scrollbar-thumb:hover": {
              backgroundColor: "#555",
            },
          }}
        >
          {recipe.directions.map((step, index) => (
            <Box
              key={index}
              sx={{ mb: 2, display: "flex", alignItems: "flex-start" }}
            >
              <Typography variant="body2">{step}</Typography>
            </Box>
          ))}
        </Paper>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mt={2}
        >
          <Box>
            <IconButton onClick={() => onLike(recipe._id)}>
              {userLikedRecipes.includes(recipe._id) ? (
                <FavoriteIcon color="error" />
              ) : (
                <FavoriteBorderIcon />
              )}
            </IconButton>
            <Typography variant="body2" component="span">
              {recipe.likeCount || 0} likes
            </Typography>
          </Box>
          <Box>
            <IconButton onClick={() => onSave(recipe._id)}>
              {userSavedRecipes.includes(recipe._id) ? (
                <BookmarkIcon color="primary" />
              ) : (
                <BookmarkBorderIcon />
              )}
            </IconButton>
            <Typography variant="body2" component="span">
              {userSavedRecipes.includes(recipe._id) ? "Saved" : "Save"}
            </Typography>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

export default RecipeCard;
