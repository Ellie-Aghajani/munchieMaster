import React from "react";
import { Link } from "react-router-dom";
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
import { uploadUrl } from "../utils/recipeUtils";

const RecipeCard = ({
  recipe,
  userLikedRecipes = [],
  userSavedRecipes = [],
  onLike,
  onSave,
}) => {
  const detailPath = `/recipes/${recipe._id}`;
  const isLiked = userLikedRecipes.includes(recipe._id);
  const isSaved = userSavedRecipes.includes(recipe._id);

  return (
    <Card
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        borderRadius: 3,
        boxShadow: (theme) => theme.customShadows.soft,
        transition: "transform 0.2s",
        "&:hover": { transform: "translateY(-4px)" },
      }}
    >
      <Link to={detailPath}>
        <CardMedia
          component="img"
          image={uploadUrl(recipe.image) || "https://via.placeholder.com/400x300"}
          alt={recipe.name}
          sx={{ height: 200, objectFit: "cover" }}
        />
      </Link>

      <CardContent sx={{ flexGrow: 1, pb: 1 }}>
        <Typography
          component={Link}
          to={detailPath}
          sx={{
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
            fontSize: "1.25rem",
            lineHeight: 1.3,
            minHeight: "2.6em", // Always reserve two lines so cards line up
            color: "primary.main",
            textDecoration: "none",
            mb: 1,
          }}
        >
          {recipe.name?.trim()}
        </Typography>
        {recipe.preparationTime && (
          <Stack direction="row" alignItems="center" spacing={0.75}>
            <AccessTimeIcon fontSize="small" color="action" />
            <Typography variant="body2" color="text.secondary">
              {recipe.preparationTime}
            </Typography>
          </Stack>
        )}
      </CardContent>

      <CardActions sx={{ px: 2, pb: 2, pt: 0 }}>
        <IconButton
          onClick={() => onLike(recipe._id)}
          aria-label={isLiked ? "Unlike" : "Like"}
          size="small"
        >
          {isLiked ? <FavoriteIcon color="error" /> : <FavoriteBorderIcon />}
        </IconButton>
        <Typography variant="body2" color="text.secondary">
          {recipe.likeCount || 0}
        </Typography>
        <IconButton
          onClick={() => onSave(recipe._id)}
          aria-label={isSaved ? "Remove from saved" : "Save"}
          size="small"
          sx={{ ml: 1 }}
        >
          {isSaved ? <BookmarkIcon color="primary" /> : <BookmarkBorderIcon />}
        </IconButton>
        <Box sx={{ flexGrow: 1 }} />
        <Button
          component={Link}
          to={detailPath}
          size="small"
          sx={{
            flexShrink: 0,
            whiteSpace: "nowrap",
            borderRadius: 999,
            px: 2,
            textTransform: "none",
            fontSize: "0.95rem",
            color: "accent.contrastText",
            backgroundColor: "accent.main",
            "&:hover": { backgroundColor: "accent.dark" },
          }}
        >
          View Recipe
        </Button>
      </CardActions>
    </Card>
  );
};

export default RecipeCard;
