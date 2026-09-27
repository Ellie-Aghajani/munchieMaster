import React, { useState, useEffect, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Avatar,
  Box,
  Button,
  ButtonBase,
  Chip,
  CircularProgress,
  Container,
  Grid,
  Stack,
  Typography,
} from "@mui/material";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
import axios from "axios";
import ResponsiveCarousel from "./ResponsiveCarousel";
import DeleteRecipeDialog from "./DeleteRecipeDialog";
import { useAuth } from "../contexts/AuthContext";
import { useError } from "../contexts/ErrorContext";
import config from "../config";
import {
  errorText,
  likeRecipe,
  rewardMessage,
  toggleSaveRecipe,
} from "../api/recipeActions";

const authHeaders = () => ({ "x-auth-token": localStorage.getItem("token") });

const sections = [
  {
    key: "saved",
    id: "savedRecipesSection",
    title: "Saved Recipes",
    color: "tiles.green",
    endpoint: "/api/dashboard/saved-recipes",
    empty: "You haven't saved any recipes yet.",
  },
  {
    key: "liked",
    id: "likedRecipesSection",
    title: "Liked Recipes",
    color: "tiles.rose",
    endpoint: "/api/dashboard/liked-recipes",
    empty: "You haven't liked any recipes yet.",
  },
  {
    key: "bought",
    id: "boughtRecipesSection",
    title: "Bought Recipes",
    color: "tiles.blue",
    endpoint: "/api/dashboard/bought-recipes",
    empty:
      "Recipes shared by others cost 5 coins to unlock. The ones you unlock show up here.",
  },
  {
    key: "mine",
    id: "myRecipesSection",
    title: "My Recipes",
    color: "tiles.lavender",
    endpoint: "/api/dashboard/my-recipes",
    empty: "Share your first recipe and earn 5 coins.",
  },
];

const cardSx = {
  p: { xs: 3, md: 4 },
  borderRadius: 4,
  color: "primary.main",
  boxShadow: (theme) => theme.customShadows.raised,
};

const pillButtonSx = {
  borderRadius: 999,
  px: 3,
  textTransform: "none",
  fontSize: "1rem",
};

const accentButtonSx = {
  ...pillButtonSx,
  backgroundColor: "accent.main",
  color: "accent.contrastText",
  "&:hover": { backgroundColor: "accent.dark" },
};

const Dashboard = () => {
  const { logout } = useAuth();
  const { showError, showSuccess } = useError();
  const navigate = useNavigate();
  const [summary, setSummary] = useState(null);
  const [lists, setLists] = useState({
    saved: [],
    liked: [],
    bought: [],
    mine: [],
  });
  const [loading, setLoading] = useState(true);

  const fetchDashboard = useCallback(async () => {
    try {
      const [summaryResponse, ...listResponses] = await Promise.all([
        axios.get("/api/dashboard/summary", { headers: authHeaders() }),
        ...sections.map((section) =>
          axios.get(section.endpoint, { headers: authHeaders() })
        ),
      ]);
      setSummary(summaryResponse.data);
      setLists(
        Object.fromEntries(
          sections.map((section, i) => [section.key, listResponses[i].data])
        )
      );
    } catch (error) {
      if (error.response?.status === 401) {
        logout();
        navigate("/login");
        return;
      }
      showError(error.response?.data, "Failed to load your dashboard.");
    } finally {
      setLoading(false);
    }
  }, [logout, navigate, showError]);

  useEffect(() => {
    fetchDashboard();
  }, [fetchDashboard]);

  const likedIds = lists.liked.map((recipe) => recipe._id);
  const savedIds = lists.saved.map((recipe) => recipe._id);

  const findRecipe = (recipeId) =>
    Object.values(lists)
      .flat()
      .find((recipe) => recipe._id === recipeId);

  // Add the recipe to a list, or remove it if it is already there
  const toggleInList = (list, recipe) =>
    list.some((r) => r._id === recipe._id)
      ? list.filter((r) => r._id !== recipe._id)
      : [...list, recipe];

  const handleLike = async (recipeId) => {
    try {
      const data = await likeRecipe(recipeId);
      if (!data.success) return;
      const message = rewardMessage(data, "like");
      if (message) showSuccess(message);
      setLists((prev) => {
        const withCount = (list) =>
          list.map((r) =>
            r._id === recipeId ? { ...r, likeCount: data.likeCount } : r
          );
        const updated = Object.fromEntries(
          Object.entries(prev).map(([key, list]) => [key, withCount(list)])
        );
        const recipe = findRecipe(recipeId);
        if (!recipe) return updated;
        return {
          ...updated,
          liked: toggleInList(updated.liked, {
            ...recipe,
            likeCount: data.likeCount,
          }),
        };
      });
    } catch (error) {
      showError(null, errorText(error, "Could not update the like."));
    }
  };

  const handleSave = async (recipeId) => {
    try {
      const data = await toggleSaveRecipe(recipeId);
      if (!data.success) return;
      const message = rewardMessage(data, "save");
      if (message) showSuccess(message);
      const recipe = findRecipe(recipeId);
      if (!recipe) return;
      setLists((prev) => ({ ...prev, saved: toggleInList(prev.saved, recipe) }));
    } catch (error) {
      showError(null, errorText(error, "Could not update saved recipes."));
    }
  };

  const [deleteTarget, setDeleteTarget] = useState(null);
  const closeDeleteDialog = useCallback(() => setDeleteTarget(null), []);

  // Refresh everything: the recipe leaves every list and the coin balance changes
  const handleDeleted = () => {
    setDeleteTarget(null);
    fetchDashboard();
  };

  const scrollToSection = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" py={12}>
        <CircularProgress />
      </Box>
    );
  }

  const avatarUrl = summary?.avatar
    ? `${config.serverUrl}/uploads/${summary.avatar.replace(
        /^\/?uploads\/?/,
        ""
      )}`
    : undefined;

  return (
    <Container maxWidth="lg" sx={{ py: { xs: 4, md: 6 } }}>
      {/* Summary */}
      <Box sx={{ ...cardSx, backgroundColor: "tiles.cream", mb: 4 }}>
        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={3}
          alignItems={{ xs: "center", sm: "center" }}
          textAlign={{ xs: "center", sm: "left" }}
        >
          <Avatar src={avatarUrl} sx={{ width: 72, height: 72 }}>
            {summary?.name?.[0]}
          </Avatar>
          <Box sx={{ flexGrow: 1 }}>
            <Typography
              variant="h1"
              sx={{ fontSize: { xs: "1.75rem", md: "2.25rem" }, mb: 1 }}
            >
              Welcome, {summary?.name}
            </Typography>
            <Chip
              icon={<MonetizationOnIcon />}
              label={`${summary?.coins ?? 0} coins`}
              sx={{ fontSize: "1rem" }}
            />
            <Typography variant="body2" sx={{ mt: 1 }}>
              Earn coins: +5 per recipe you share, +1 per like and +2 per
              save it gets, +5 each time someone unlocks it.
            </Typography>
          </Box>
          <Stack direction="row" spacing={1.5}>
            <Button component={Link} to="/recipes" sx={accentButtonSx}>
              Browse Recipes
            </Button>
            <Button
              component={Link}
              to="/profile"
              variant="outlined"
              sx={pillButtonSx}
            >
              Edit Profile
            </Button>
          </Stack>
        </Stack>

        <Grid container spacing={2} sx={{ mt: 3 }}>
          {sections.map((section) => (
            <Grid item xs={6} md={3} key={section.key}>
              <ButtonBase
                onClick={() => scrollToSection(section.id)}
                sx={{
                  width: "100%",
                  flexDirection: "column",
                  py: 2,
                  borderRadius: 3,
                  backgroundColor: section.color,
                  color: "primary.main",
                  transition: "transform 0.15s",
                  "&:hover": { transform: "translateY(-2px)" },
                }}
              >
                <Typography sx={{ fontSize: "2rem", lineHeight: 1.2 }}>
                  {lists[section.key].length}
                </Typography>
                <Typography sx={{ fontSize: "1rem" }}>
                  {section.title}
                </Typography>
              </ButtonBase>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Recipe sections */}
      <Stack spacing={4}>
        {sections.map((section) => (
          <Box
            key={section.key}
            id={section.id}
            sx={{
              ...cardSx,
              backgroundColor: section.color,
              scrollMarginTop: 16,
            }}
          >
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
              flexWrap="wrap"
              gap={2}
              mb={2}
            >
              <Typography
                variant="h2"
                sx={{ fontSize: { xs: "1.5rem", md: "1.875rem" } }}
              >
                {section.title}
              </Typography>
              {section.key === "mine" && (
                <Button
                  component={Link}
                  to="/recipes/new"
                  sx={accentButtonSx}
                >
                  Share a Recipe
                </Button>
              )}
            </Stack>

            {lists[section.key].length > 0 ? (
              <ResponsiveCarousel
                recipes={lists[section.key]}
                userLikedRecipes={likedIds}
                userSavedRecipes={savedIds}
                onLike={handleLike}
                onSave={handleSave}
                onDelete={section.key === "mine" ? setDeleteTarget : undefined}
              />
            ) : (
              <Stack
                direction={{ xs: "column", sm: "row" }}
                spacing={2}
                alignItems={{ xs: "flex-start", sm: "center" }}
              >
                <Typography sx={{ fontSize: "1.05rem" }}>
                  {section.empty}
                </Typography>
                {section.key !== "mine" && (
                  <Button
                    component={Link}
                    to="/recipes"
                    variant="outlined"
                    sx={pillButtonSx}
                  >
                    Browse Recipes
                  </Button>
                )}
              </Stack>
            )}
          </Box>
        ))}
      </Stack>

      <DeleteRecipeDialog
        recipeId={deleteTarget?._id}
        open={!!deleteTarget}
        onClose={closeDeleteDialog}
        onDeleted={handleDeleted}
      />
    </Container>
  );
};

export default Dashboard;
