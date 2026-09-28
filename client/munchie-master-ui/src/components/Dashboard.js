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
  Tooltip,
} from "@mui/material";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import axios from "axios";
import ResponsiveCarousel from "./ResponsiveCarousel";
import { useTranslation } from "react-i18next";
import { formatNumber } from "../i18n/format";
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
    color: "tiles.green",
    endpoint: "/api/dashboard/saved-recipes",
  },
  {
    key: "liked",
    id: "likedRecipesSection",
    color: "tiles.rose",
    endpoint: "/api/dashboard/liked-recipes",
  },
  {
    key: "bought",
    id: "boughtRecipesSection",
    color: "tiles.blue",
    endpoint: "/api/dashboard/bought-recipes",
  },
  {
    key: "mine",
    id: "myRecipesSection",
    color: "tiles.lavender",
    endpoint: "/api/dashboard/my-recipes",
  },
];

const cardSx = {
  p: { xs: 3, md: 4 },
  borderRadius: 4,
  color: "primary.main",
  boxShadow: (theme) => theme.customShadows.raised,
};

// Narrow white outline so cards and buttons stand out on the colored tiles
const tileOutline = (theme) => `2px solid ${theme.palette.tiles.contrastText}`;
const onTileSx = {
  "& .MuiButton-root": { outline: tileOutline },
  // Drawn inside the card edge so the carousel's edges can't clip it
  "& .MuiCard-root": { outline: tileOutline, outlineOffset: "-2px" },
  // Outlined buttons already have a border; the outline replaces it
  "& .MuiButton-outlined, & .MuiButton-outlined:hover": { border: "none" },
};

const pillButtonSx = {
  borderRadius: 999,
  px: 3,
  textTransform: "none",
  fontSize: "1rem",
  whiteSpace: "nowrap", // Longer Persian labels shouldn't wrap
};

const accentButtonSx = {
  ...pillButtonSx,
  backgroundColor: "accent.main",
  color: "accent.contrastText",
  "&:hover": { backgroundColor: "accent.dark" },
};

const Dashboard = () => {
  const { t, i18n } = useTranslation();
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
          axios.get(section.endpoint, { headers: authHeaders() }),
        ),
      ]);
      setSummary(summaryResponse.data);
      setLists(
        Object.fromEntries(
          sections.map((section, i) => [section.key, listResponses[i].data]),
        ),
      );
    } catch (error) {
      if (error.response?.status === 401) {
        logout();
        navigate("/login");
        return;
      }
      showError(error.response?.data, t("errors.dashboard"));
    } finally {
      setLoading(false);
    }
  }, [logout, navigate, showError, t]);

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
            r._id === recipeId ? { ...r, likeCount: data.likeCount } : r,
          );
        const updated = Object.fromEntries(
          Object.entries(prev).map(([key, list]) => [key, withCount(list)]),
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
      showError(null, errorText(error, t("errors.like")));
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
      setLists((prev) => ({
        ...prev,
        saved: toggleInList(prev.saved, recipe),
      }));
    } catch (error) {
      showError(null, errorText(error, t("errors.save")));
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
        <CircularProgress sx={{ color: "accent.main" }} />
      </Box>
    );
  }

  const avatarUrl = summary?.avatar
    ? `${config.serverUrl}/uploads/${summary.avatar.replace(
        /^\/?uploads\/?/,
        "",
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
          <Tooltip title={t("dashboard.editProfileTip")}>
            <ButtonBase
              component={Link}
              to="/profile"
              aria-label={t("dashboard.editProfileTip")}
              sx={{
                position: "relative",
                borderRadius: "50%",
                flexShrink: 0,
                // Pencil badge appears on hover and keyboard focus
                "&:hover .avatar-edit, &:focus-visible .avatar-edit": {
                  opacity: 1,
                },
              }}
            >
              <Avatar
                src={avatarUrl}
                sx={{
                  width: 72,
                  height: 72,
                  fontSize: "2rem",
                  backgroundColor: "tiles.lavender",
                  color: "primary.main",
                }}
              >
                {summary?.name?.[0]}
              </Avatar>
              <Box
                className="avatar-edit"
                sx={{
                  position: "absolute",
                  right: -2,
                  bottom: -2,
                  width: 28,
                  height: 28,
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: "accent.main",
                  color: "accent.contrastText",
                  boxShadow: (theme) => theme.customShadows.soft,
                  opacity: { xs: 1, md: 0 },
                  transition: "opacity 0.2s",
                }}
              >
                <EditOutlinedIcon sx={{ fontSize: 16 }} />
              </Box>
            </ButtonBase>
          </Tooltip>
          <Box sx={{ flexGrow: 1 }}>
            <Typography
              variant="h1"
              sx={{ fontSize: { xs: "1.75rem", md: "2.25rem" }, mb: 1 }}
            >
              {t("dashboard.welcome", { name: summary?.name })}
            </Typography>
            <Chip
              icon={<MonetizationOnIcon />}
              label={t("coins", { count: summary?.coins ?? 0 })}
              sx={{ fontSize: "1rem" }}
            />
            <Typography variant="body2" sx={{ mt: 1 }}>
              {t("dashboard.earnCoins")}
            </Typography>
          </Box>
          <Stack direction="row" spacing={1.5}>
            <Button component={Link} to="/recipes" sx={accentButtonSx}>
              {t("dashboard.browse")}
            </Button>
            <Button
              component={Link}
              to="/profile"
              variant="outlined"
              sx={pillButtonSx}
            >
              {t("dashboard.editProfile")}
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
                  color: "tiles.contrastText",
                  transition: "transform 0.15s",
                  "&:hover": { transform: "translateY(-2px)" },
                }}
              >
                <Typography sx={{ fontSize: "2rem", lineHeight: 1.2 }}>
                  {formatNumber(lists[section.key].length, i18n.language)}
                </Typography>
                <Typography sx={{ fontSize: "1rem" }}>
                  {t(`dashboard.sections.${section.key}.title`)}
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
              color: "tiles.contrastText",
              scrollMarginTop: 16,
              ...onTileSx,
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
                {t(`dashboard.sections.${section.key}.title`)}
              </Typography>
              {/* Every section keeps its action in the header */}
              {section.key === "mine" ? (
                <Button component={Link} to="/recipes/new" sx={accentButtonSx}>
                  {t("dashboard.share")}
                </Button>
              ) : (
                <Button
                  component={Link}
                  to="/recipes"
                  variant="outlined"
                  color="inherit"
                  sx={pillButtonSx}
                >
                  {t("dashboard.browse")}
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
              <Typography sx={{ fontSize: "1.05rem" }}>
                {t(`dashboard.sections.${section.key}.empty`)}
              </Typography>
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
