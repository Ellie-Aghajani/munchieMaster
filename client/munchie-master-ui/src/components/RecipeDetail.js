import React, { useState, useEffect, useCallback } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  Box,
  Button,
  Chip,
  CircularProgress,
  Container,
  Grid,
  Stack,
  Typography,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import LockIcon from "@mui/icons-material/Lock";
import LockOpenIcon from "@mui/icons-material/LockOpen";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import TranslateIcon from "@mui/icons-material/Translate";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import axios from "axios";
import { useAuth } from "../contexts/AuthContext";
import { useError } from "../contexts/ErrorContext";
import {
  buyRecipe,
  coinsLabel,
  errorText,
  likeRecipe,
  rewardMessage,
  toggleSaveRecipe,
  unlockMessage,
} from "../api/recipeActions";
import {
  authorNameOf,
  isOwnRecipe,
  toLines,
  uploadUrl,
} from "../utils/recipeUtils";
import DeleteRecipeDialog from "./DeleteRecipeDialog";
import RecipeImage from "./RecipeImage";
import TagChip from "./TagChip";
import { useTranslation } from "react-i18next";
import { formatNumber } from "../i18n/format";
import { recipeTags } from "../utils/recipeTags";

const authHeaders = () => ({ "x-auth-token": localStorage.getItem("token") });

const cardSx = {
  p: { xs: 3, md: 4 },
  borderRadius: 4,
  color: "primary.main",
  boxShadow: (theme) => theme.customShadows.raised,
};

const sectionHeadingSx = {
  fontSize: { xs: "1.5rem", md: "1.875rem" },
  mb: 2.5,
};

const pillButtonSx = {
  borderRadius: 999,
  px: 3,
  py: 1,
  textTransform: "none",
  fontSize: "1rem",
};

const accentButtonSx = {
  ...pillButtonSx,
  color: "accent.contrastText",
  backgroundColor: "accent.main",
  "&:hover": { backgroundColor: "accent.dark" },
};

const RecipeDetail = () => {
  const { t, i18n } = useTranslation();
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentUser, checkAuthStatus } = useAuth();
  const { showError, showSuccess } = useError();
  const [recipe, setRecipe] = useState(null);
  const [isLiked, setIsLiked] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [unlocking, setUnlocking] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const closeDeleteDialog = useCallback(() => setDeleteOpen(false), []);

  const fetchRecipe = useCallback(async () => {
    try {
      const { data } = await axios.get(`/api/recipes/${id}`, {
        headers: authHeaders(),
      });
      setRecipe(data);
      if (localStorage.getItem("token")) {
        const [liked, saved] = await Promise.all([
          axios.get("/api/users/liked-recipes", { headers: authHeaders() }),
          axios.get("/api/users/saved-recipes", { headers: authHeaders() }),
        ]);
        setIsLiked(liked.data.likedRecipes.some((r) => r._id === id));
        setIsSaved(saved.data.savedRecipes.some((r) => r._id === id));
      }
    } catch (error) {
      if (error.response?.status === 404 || error.response?.status === 400) {
        setNotFound(true);
      } else if (error.response?.status !== 401) {
        showError(null, errorText(error, t("errors.loadRecipe")));
      }
    } finally {
      setLoading(false);
    }
  }, [id, showError, t]);

  useEffect(() => {
    setLoading(true);
    fetchRecipe();
  }, [fetchRecipe]);

  // Returns true when the action needs a logged-in user
  const requireLogin = (error) => {
    if (error.response?.status === 401) {
      navigate("/login");
      return true;
    }
    return false;
  };

  const handleLike = async () => {
    try {
      const data = await likeRecipe(id);
      if (!data.success) return;
      setIsLiked((prev) => !prev);
      setRecipe((prev) => ({ ...prev, likeCount: data.likeCount }));
      const message = rewardMessage(data, "like");
      if (message) showSuccess(message);
    } catch (error) {
      if (!requireLogin(error)) {
        showError(null, errorText(error, t("errors.like")));
      }
    }
  };

  const handleSave = async () => {
    try {
      const data = await toggleSaveRecipe(id);
      if (!data.success) return;
      setIsSaved((prev) => !prev);
      const message = rewardMessage(data, "save");
      if (message) showSuccess(message);
    } catch (error) {
      if (!requireLogin(error)) {
        showError(null, errorText(error, t("errors.save")));
      }
    }
  };

  const handleUnlock = async () => {
    setUnlocking(true);
    try {
      const data = await buyRecipe(id);
      showSuccess(unlockMessage(data));
      await Promise.all([fetchRecipe(), checkAuthStatus()]);
    } catch (error) {
      if (!requireLogin(error)) {
        showError(null, errorText(error, t("errors.unlock")));
      }
    } finally {
      setUnlocking(false);
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" py={12}>
        <CircularProgress sx={{ color: "page.text" }} />
      </Box>
    );
  }

  if (notFound || !recipe) {
    return (
      <Container maxWidth="sm" sx={{ py: 10, textAlign: "center" }}>
        <Typography
          variant="h1"
          sx={{ fontSize: "2rem", color: "page.text", mb: 3 }}
        >
          {t("detail.notFound")}
        </Typography>
        <Button
          component={Link}
          to="/recipes"
          variant="outlined"
          sx={{ ...pillButtonSx, color: "page.text", borderColor: "page.text" }}
        >
          {t("detail.backToRecipes")}
        </Button>
      </Container>
    );
  }

  const ingredients = toLines(recipe.ingredients);
  const steps = toLines(recipe.directions);
  const stepImages = recipe.cookingStepImages || [];
  const isLoggedIn = !!currentUser?._id;
  const balance = currentUser?.coins ?? 0;
  const canAfford = balance >= recipe.price;
  const canManage = isOwnRecipe(recipe, currentUser) || !!currentUser?.isAdmin;

  return (
    <Container maxWidth="lg" sx={{ py: { xs: 3, md: 5 } }}>
      <Button
        component={Link}
        to="/recipes"
        // Point "back" the reading direction's way
        startIcon={
          <ArrowBackIcon
            sx={{
              transform: (theme) =>
                theme.direction === "rtl" ? "scaleX(-1)" : "none",
            }}
          />
        }
        sx={{ ...pillButtonSx, px: 2, mb: 3, color: "page.text" }}
      >
        {t("detail.allRecipes")}
      </Button>

      {/* Header: image and summary */}
      <Box sx={{ ...cardSx, backgroundColor: "tiles.cream", mb: 4 }}>
        <Grid container spacing={{ xs: 3, md: 5 }} alignItems="center">
          <Grid item xs={12} md={6}>
            <RecipeImage
              image={recipe.image}
              alt={recipe.name}
              sx={{ aspectRatio: "4 / 3", borderRadius: 3 }}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography
              variant="h1"
              sx={{
                fontSize: { xs: "2rem", sm: "2.5rem", md: "3rem" },
                lineHeight: 1.15,
                mb: 1.5,
              }}
            >
              <bdi>{recipe.name.trim()}</bdi>
            </Typography>
            <Stack direction="row" alignItems="center" spacing={0.75} mb={2.5}>
              <PersonOutlineIcon />
              <Typography sx={{ fontSize: "1.1rem" }}>
                {t("card.by", { name: authorNameOf(recipe) })}
              </Typography>
            </Stack>
            {recipe.isTranslated && (
              <Stack
                direction="row"
                alignItems="center"
                spacing={0.75}
                mb={2}
                sx={{ color: "text.secondary" }}
              >
                <TranslateIcon fontSize="small" />
                <Typography variant="body2">
                  {t("detail.autoTranslated")}
                </Typography>
              </Stack>
            )}
            {recipeTags(recipe).length > 0 && (
              <Stack
                direction="row"
                spacing={1}
                flexWrap="wrap"
                useFlexGap
                mb={2}
              >
                {recipeTags(recipe).map((tag) => (
                  <TagChip
                    key={tag.key}
                    tag={tag}
                    size="medium"
                    sx={{ fontSize: "0.95rem" }}
                  />
                ))}
              </Stack>
            )}

            <Stack
              direction="row"
              spacing={1}
              flexWrap="wrap"
              useFlexGap
              mb={3}
            >
              {recipe.preparationTime && (
                <Chip
                  icon={<AccessTimeIcon />}
                  label={<bdi>{recipe.preparationTime}</bdi>}
                  sx={{ fontSize: "1rem" }}
                />
              )}
              <Chip
                icon={<FavoriteIcon />}
                label={t("detail.likes", { count: recipe.likeCount || 0 })}
                sx={{ fontSize: "1rem" }}
              />
              {!recipe.locked && (
                <Chip
                  label={t("detail.ingredientCount", {
                    count: ingredients.length,
                  })}
                  sx={{ fontSize: "1rem" }}
                />
              )}
              {recipe.price > 0 && (
                <Chip
                  icon={recipe.locked ? <LockIcon /> : <LockOpenIcon />}
                  label={
                    recipe.locked
                      ? t("detail.toUnlock", {
                          coins: coinsLabel(recipe.price),
                        })
                      : t("detail.unlocked")
                  }
                  sx={{ fontSize: "1rem" }}
                />
              )}
            </Stack>

            <Stack direction="row" spacing={1.5} flexWrap="wrap" useFlexGap>
              {!recipe.locked && (
                <Button
                  onClick={handleLike}
                  startIcon={
                    isLiked ? <FavoriteIcon /> : <FavoriteBorderIcon />
                  }
                  sx={accentButtonSx}
                >
                  {isLiked ? t("detail.liked") : t("detail.like")}
                </Button>
              )}
              <Button
                onClick={handleSave}
                variant="outlined"
                startIcon={isSaved ? <BookmarkIcon /> : <BookmarkBorderIcon />}
                sx={pillButtonSx}
              >
                {isSaved ? t("detail.saved") : t("detail.save")}
              </Button>
              {canManage && (
                <Button
                  component={Link}
                  to={`/recipes/${id}/edit`}
                  variant="outlined"
                  startIcon={<EditOutlinedIcon />}
                  sx={pillButtonSx}
                >
                  {t("detail.edit")}
                </Button>
              )}
              {canManage && (
                <Button
                  onClick={() => setDeleteOpen(true)}
                  variant="outlined"
                  color="error"
                  startIcon={<DeleteOutlineIcon />}
                  sx={pillButtonSx}
                >
                  {t("detail.delete")}
                </Button>
              )}
            </Stack>
          </Grid>
        </Grid>
      </Box>

      {recipe.locked ? (
        /* Locked: explain the price and offer to unlock */
        <Box
          sx={{
            ...cardSx,
            backgroundColor: "tiles.rose",
            textAlign: "center",
            maxWidth: 720,
            mx: "auto",
          }}
        >
          <LockIcon sx={{ fontSize: 48, mb: 1 }} />
          <Typography variant="h2" sx={{ ...sectionHeadingSx, mb: 1.5 }}>
            {t("detail.unlockTitle")}
          </Typography>
          <Typography sx={{ fontSize: "1.1rem", lineHeight: 1.6, mb: 3 }}>
            {t("detail.unlockBody", {
              name: authorNameOf(recipe),
              coins: coinsLabel(recipe.price),
            })}
          </Typography>

          {isLoggedIn ? (
            <>
              <Chip
                icon={<MonetizationOnIcon />}
                label={t("detail.youHave", { coins: coinsLabel(balance) })}
                sx={{ fontSize: "1rem", mb: 3 }}
              />
              <Stack
                direction={{ xs: "column", sm: "row" }}
                spacing={1.5}
                justifyContent="center"
                alignItems="center"
              >
                <Button
                  onClick={handleUnlock}
                  disabled={!canAfford || unlocking}
                  startIcon={<LockOpenIcon />}
                  sx={{
                    ...accentButtonSx,
                    "&.Mui-disabled": {
                      color: "accent.contrastText",
                      opacity: 0.5,
                    },
                  }}
                >
                  {unlocking
                    ? t("detail.unlocking")
                    : t("detail.unlockFor", {
                        coins: coinsLabel(recipe.price),
                      })}
                </Button>
                {!canAfford && (
                  <Button
                    component={Link}
                    to="/recipes/new"
                    variant="outlined"
                    sx={pillButtonSx}
                  >
                    {t("detail.shareToEarn")}
                  </Button>
                )}
              </Stack>
            </>
          ) : (
            <Button component={Link} to="/login" sx={accentButtonSx}>
              {t("detail.loginToUnlock")}
            </Button>
          )}
        </Box>
      ) : (
        /* Ingredients and directions */
        <Grid container spacing={4}>
          <Grid item xs={12} md={5}>
            <Box
              sx={{
                ...cardSx,
                backgroundColor: "tiles.green",
                color: "common.white",
                position: { md: "sticky" },
                top: { md: 24 },
              }}
            >
              <Typography variant="h2" sx={sectionHeadingSx}>
                {t("detail.ingredients")}
              </Typography>
              <Stack
                component="ul"
                spacing={1.5}
                sx={{ listStyle: "none", p: 0, m: 0 }}
              >
                {ingredients.map((ingredient, index) => (
                  <Stack
                    component="li"
                    key={index}
                    direction="row"
                    spacing={1.5}
                    alignItems="flex-start"
                  >
                    <CheckCircleIcon
                      fontSize="small"
                      sx={{ mt: "3px", color: "primary.main" }}
                    />
                    <Typography sx={{ fontSize: "1.05rem", lineHeight: 1.5 }}>
                      <bdi>{ingredient}</bdi>
                    </Typography>
                  </Stack>
                ))}
              </Stack>
            </Box>
          </Grid>

          <Grid item xs={12} md={7}>
            <Box sx={{ ...cardSx, backgroundColor: "tiles.cream" }}>
              <Typography variant="h2" sx={sectionHeadingSx}>
                {t("detail.directions")}
              </Typography>
              <Stack
                component="ol"
                spacing={2.5}
                sx={{ listStyle: "none", p: 0, m: 0 }}
              >
                {steps.map((step, index) => (
                  <Stack
                    component="li"
                    key={index}
                    direction="row"
                    spacing={2}
                    alignItems="flex-start"
                  >
                    <Box
                      sx={{
                        flexShrink: 0,
                        width: 36,
                        height: 36,
                        borderRadius: "50%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        backgroundColor: "accent.main",
                        color: "accent.contrastText",
                        fontSize: "1.05rem",
                      }}
                    >
                      {formatNumber(index + 1, i18n.language)}
                    </Box>
                    <Typography
                      sx={{ fontSize: "1.05rem", lineHeight: 1.6, pt: 0.5 }}
                    >
                      <bdi>{step}</bdi>
                    </Typography>
                  </Stack>
                ))}
              </Stack>

              {stepImages.length > 0 && (
                <Grid container spacing={2} sx={{ mt: 3 }}>
                  {stepImages.map((image, index) => (
                    <Grid item xs={12} sm={4} key={image}>
                      <Box
                        component="img"
                        src={uploadUrl(image)}
                        alt={t("detail.stepImageAlt", {
                          step: formatNumber(index + 1, i18n.language),
                        })}
                        sx={{
                          display: "block",
                          width: "100%",
                          aspectRatio: "1",
                          objectFit: "cover",
                          borderRadius: 2,
                        }}
                      />
                    </Grid>
                  ))}
                </Grid>
              )}
            </Box>
          </Grid>
        </Grid>
      )}

      {canManage && (
        <DeleteRecipeDialog
          recipeId={id}
          open={deleteOpen}
          onClose={closeDeleteDialog}
          onDeleted={() => navigate("/dashboard")}
        />
      )}
    </Container>
  );
};

export default RecipeDetail;
