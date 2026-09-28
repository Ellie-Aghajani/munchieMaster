import React from "react";
import { Link } from "react-router-dom";
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Chip,
  IconButton,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
import LockIcon from "@mui/icons-material/Lock";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import { useAuth } from "../contexts/AuthContext";
import {
  authorNameOf,
  isOwnRecipe,
  isRecipeLocked,
} from "../utils/recipeUtils";
import RecipeImage from "./RecipeImage";
import TagChip from "./TagChip";
import { useTranslation } from "react-i18next";
import { formatNumber } from "../i18n/format";
import { recipeTags } from "../utils/recipeTags";

const manageButtonSx = {
  backgroundColor: "common.white",
  boxShadow: (theme) => theme.customShadows.soft,
};

// Cards show a couple of tags and a "+N" for the rest, so they fit on one line
const MAX_CARD_TAGS = 2;

const RecipeCard = ({
  recipe,
  userLikedRecipes = [],
  userSavedRecipes = [],
  onLike,
  onSave,
  onDelete, // Optional; shows edit and delete buttons on the user's own recipes
  matchedIngredients, // Optional; the searched ingredients this recipe uses
}) => {
  const { t, i18n } = useTranslation();
  const { currentUser } = useAuth();
  const detailPath = `/recipes/${recipe._id}`;
  const isLiked = userLikedRecipes.includes(recipe._id);
  const isSaved = userSavedRecipes.includes(recipe._id);
  const isLocked = isRecipeLocked(recipe, currentUser);
  const isOwn = isOwnRecipe(recipe, currentUser);
  const tags = recipeTags(recipe);
  const hiddenTags = tags.slice(MAX_CARD_TAGS);
  const canManage = !!onDelete && (isOwn || currentUser?.isAdmin);

  return (
    <Card
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        borderRadius: 3,
        border: "1px solid",
        borderColor: "page.text",
        boxShadow: (theme) => theme.customShadows.soft,
        transition: "transform 0.2s",
        "&:hover": { transform: "translateY(-4px)" },
      }}
    >
      <Box sx={{ position: "relative" }}>
        <Box component={Link} to={detailPath} sx={{ display: "block" }}>
          <RecipeImage
            image={recipe.image}
            alt={recipe.name}
            sx={{ height: 200 }}
          />
        </Box>
        {(isLocked || isOwn) && (
          <Chip
            size="small"
            icon={isLocked ? <LockIcon /> : undefined}
            label={
              isLocked
                ? t("coins", { count: recipe.price })
                : t("card.yourRecipe")
            }
            sx={{
              position: "absolute",
              top: 12,
              left: 12,
              backgroundColor: isLocked ? "accent.main" : "common.white",
              color: isLocked ? "accent.contrastText" : "primary.main",
              "& .MuiChip-icon": { color: "inherit" },
            }}
          />
        )}
        {canManage && (
          <Stack
            direction="row"
            spacing={1}
            sx={{ position: "absolute", top: 8, right: 8 }}
          >
            <Tooltip title={t("card.edit")}>
              <IconButton
                component={Link}
                to={`/recipes/${recipe._id}/edit`}
                aria-label={t("card.edit")}
                size="small"
                sx={{
                  ...manageButtonSx,
                  color: "primary.main",
                  "&:hover": {
                    backgroundColor: "primary.main",
                    color: "common.white",
                  },
                }}
              >
                <EditOutlinedIcon fontSize="small" />
              </IconButton>
            </Tooltip>
            <Tooltip title={t("card.delete")}>
              <IconButton
                onClick={() => onDelete(recipe)}
                aria-label={t("card.delete")}
                size="small"
                sx={{
                  ...manageButtonSx,
                  color: "error.main",
                  "&:hover": {
                    backgroundColor: "error.main",
                    color: "common.white",
                  },
                }}
              >
                <DeleteOutlineIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </Stack>
        )}
      </Box>

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
          <bdi>{recipe.name?.trim()}</bdi>
        </Typography>
        <Stack spacing={0.5}>
          <Stack direction="row" alignItems="center" spacing={0.75}>
            <AccessTimeIcon fontSize="small" color="action" />
            <Typography variant="body2" color="text.secondary">
              <bdi>{recipe.preparationTime || "—"}</bdi>
            </Typography>
          </Stack>
          <Stack direction="row" alignItems="center" spacing={0.75}>
            <PersonOutlineIcon fontSize="small" color="action" />
            <Typography variant="body2" color="text.secondary" noWrap>
              {t("card.by", { name: authorNameOf(recipe) })}
            </Typography>
          </Stack>
          {/* One line of tags; always rendered so cards line up */}
          <Stack
            direction="row"
            spacing={0.5}
            sx={{ pt: 0.5, minHeight: 28, overflow: "hidden" }}
          >
            {tags.slice(0, MAX_CARD_TAGS).map((tag) => (
              <TagChip key={tag.key} tag={tag} />
            ))}
            {hiddenTags.length > 0 && (
              <Tooltip
                title={new Intl.ListFormat(i18n.language).format(
                  hiddenTags.map((tag) => tag.label),
                )}
              >
                <Chip
                  size="small"
                  label={`+${formatNumber(hiddenTags.length, i18n.language)}`}
                  sx={{
                    flexShrink: 0,
                    backgroundColor: "transparent",
                    border: "1px solid",
                    borderColor: "primary.main",
                    color: "primary.main",
                  }}
                />
              </Tooltip>
            )}
          </Stack>
          {matchedIngredients?.length > 0 && (
            <Stack direction="row" alignItems="center" spacing={0.75}>
              <CheckCircleOutlineIcon
                fontSize="small"
                sx={{ color: "secondary.main" }}
              />
              <Typography
                variant="body2"
                sx={{ color: "secondary.main" }}
                noWrap
              >
                {t("card.uses", {
                  list: new Intl.ListFormat(i18n.language).format(
                    matchedIngredients,
                  ),
                })}
              </Typography>
            </Stack>
          )}
        </Stack>
      </CardContent>

      <CardActions sx={{ px: 2, pb: 2, pt: 0 }}>
        <Tooltip title={isLocked ? t("card.unlockToLike") : ""}>
          <span>
            <IconButton
              onClick={() => onLike(recipe._id)}
              aria-label={isLiked ? t("card.unlike") : t("card.like")}
              size="small"
              disabled={isLocked}
            >
              {isLiked ? (
                <FavoriteIcon color="error" />
              ) : (
                <FavoriteBorderIcon />
              )}
            </IconButton>
          </span>
        </Tooltip>
        <Typography variant="body2" color="text.secondary">
          {formatNumber(recipe.likeCount || 0, i18n.language)}
        </Typography>
        <IconButton
          onClick={() => onSave(recipe._id)}
          aria-label={isSaved ? t("card.unsave") : t("card.save")}
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
          startIcon={isLocked ? <LockIcon /> : undefined}
          sx={{
            // Stay on one line; if a label is still too wide, shorten it with "…"
            // rather than letting it spill off the card
            minWidth: 0,
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
          <Box
            component="span"
            sx={{ overflow: "hidden", textOverflow: "ellipsis" }}
          >
            {isLocked ? t("card.unlock") : t("card.view")}
          </Box>
        </Button>
      </CardActions>
    </Card>
  );
};

export default RecipeCard;
