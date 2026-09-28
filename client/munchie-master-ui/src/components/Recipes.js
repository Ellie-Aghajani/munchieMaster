import React, { useState, useEffect, useCallback } from "react";
import {
  Container,
  Typography,
  Box,
  CircularProgress,
  Snackbar,
  Alert,
  Grid,
  Autocomplete,
  Button,
  Stack,
  Chip,
  InputAdornment,
  TextField,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import CloseIcon from "@mui/icons-material/Close";
import axios from "axios";
import RecipeCard from "./RecipeCard";
import SelectableChip from "./SelectableChip";
import { CATEGORY_OPTIONS, DIET_OPTIONS } from "../utils/recipeTags";
import {
  errorText,
  likeRecipe,
  rewardMessage,
  toggleSaveRecipe,
} from "../api/recipeActions";
import { useError } from "../contexts/ErrorContext";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import config from "../config";

axios.defaults.baseURL = config.serverUrl;

// Suggestions for the ingredient search; any other ingredient can be typed
const COMMON_INGREDIENTS = [
  "banana",
  "broccoli",
  "carrot",
  "cheese",
  "chicken",
  "eggs",
  "oats",
  "rice",
  "spinach",
  "sweet potato",
  "tortilla",
  "yogurt",
];

// Search field outlines follow the page background, like the recipe form
const searchInputSx = {
  "& .MuiInputBase-root": {
    backgroundColor: "common.white",
    borderRadius: 999,
  },
  "& .MuiOutlinedInput-notchedOutline, & .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline, & .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline":
    { borderColor: "background.default" },
};

// Turn "eggs, spinach" into separate lowercase ingredients without duplicates
const toIngredients = (values) => [
  ...new Set(
    values
      .flatMap((value) => value.split(","))
      .map((value) => value.trim().toLowerCase())
      .filter(Boolean),
  ),
];

function Recipes() {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userLikedRecipes, setUserLikedRecipes] = useState([]);
  const [userSavedRecipes, setUserSavedRecipes] = useState([]);
  const [error, setError] = useState(null);
  const [ingredients, setIngredients] = useState([]);
  const [categories, setCategories] = useState([]);
  const [diets, setDiets] = useState([]);
  const [searchResults, setSearchResults] = useState(null);
  const [searching, setSearching] = useState(false);
  const { showError, showSuccess } = useError();
  const { logout } = useAuth();
  const navigate = useNavigate();

  const fetchRecipes = useCallback(async () => {
    try {
      const [recipesResponse, savedRecipesResponse, likedRecipesResponse] =
        await Promise.all([
          axios.get("/api/recipes", {
            headers: {
              "Content-Type": "application/json",
            },
          }),
          axios.get("/api/users/saved-recipes", {
            headers: {
              "Content-Type": "application/json",
              "x-auth-token": localStorage.getItem("token"),
            },
          }),
          axios.get("/api/users/liked-recipes", {
            headers: {
              "Content-Type": "application/json",
              "x-auth-token": localStorage.getItem("token"),
            },
          }),
        ]);
      setRecipes(recipesResponse.data);
      setUserSavedRecipes(
        savedRecipesResponse.data.savedRecipes?.map((recipe) => recipe._id),
      );
      setUserLikedRecipes(
        likedRecipesResponse.data.likedRecipes?.map((recipe) => recipe._id),
      );
      setLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
      if (error.response?.status === 401) {
        logout();
        navigate("/login");
      }
      showError(
        error.response?.data,
        error.response?.data?.message ||
          "An error occurred while fetching data",
      );
      setLoading(false);
    }
  }, [logout, navigate, showError]);

  useEffect(() => {
    fetchRecipes();
  }, [fetchRecipes]);

  const isFiltering =
    ingredients.length > 0 || categories.length > 0 || diets.length > 0;

  // Search again whenever the ingredients or filters change
  useEffect(() => {
    if (!isFiltering) {
      setSearchResults(null);
      return;
    }
    let cancelled = false;
    setSearching(true);
    axios
      .get("/api/recipes", {
        params: {
          ingredients: ingredients.join(",") || undefined,
          categories: categories.join(",") || undefined,
          diets: diets.join(",") || undefined,
        },
      })
      .then(({ data }) => !cancelled && setSearchResults(data))
      .catch((error) =>
        showError(null, errorText(error, "Could not search recipes.")),
      )
      .finally(() => !cancelled && setSearching(false));
    return () => {
      cancelled = true;
    };
  }, [isFiltering, ingredients, categories, diets, showError]);

  const toggle = (setList, value) =>
    setList((prev) =>
      prev.includes(value)
        ? prev.filter((item) => item !== value)
        : [...prev, value],
    );

  const clearFilters = () => {
    setIngredients([]);
    setCategories([]);
    setDiets([]);
  };

  // e.g. "6 recipes for Breakfast or Snack · Vegetarian · with egg, spinach"
  const labelsFor = (options, values) =>
    options
      .filter((option) => values.includes(option.value))
      .map((o) => o.label);
  const resultsSummary = () => {
    const count = searchResults.length;
    const parts = [`${count} recipe${count === 1 ? "" : "s"}`];
    if (categories.length)
      parts[0] += ` for ${labelsFor(CATEGORY_OPTIONS, categories).join(" or ")}`;
    if (diets.length) parts.push(labelsFor(DIET_OPTIONS, diets).join(", "));
    if (ingredients.length) parts.push(`with ${ingredients.join(", ")}`);
    return parts.join(" · ");
  };

  // Like counts change in both lists, so update them together
  const updateRecipe = (recipeId, changes) => {
    const apply = (list) =>
      list?.map((recipe) =>
        recipe._id === recipeId ? { ...recipe, ...changes } : recipe,
      );
    setRecipes(apply);
    setSearchResults(apply);
  };

  const handleLikeRecipe = async (recipeId) => {
    try {
      const data = await likeRecipe(recipeId);
      if (!data.success) return;
      setUserLikedRecipes((prevLiked) =>
        prevLiked.includes(recipeId)
          ? prevLiked.filter((id) => id !== recipeId)
          : [...prevLiked, recipeId],
      );
      updateRecipe(recipeId, { likeCount: data.likeCount });
      const message = rewardMessage(data, "like");
      if (message) showSuccess(message);
    } catch (error) {
      showError(null, errorText(error, "Could not update the like."));
    }
  };

  const handleSaveRecipe = async (recipeId) => {
    try {
      const data = await toggleSaveRecipe(recipeId);
      if (!data.success) return;
      setUserSavedRecipes((prevSaved) =>
        prevSaved.includes(recipeId)
          ? prevSaved.filter((id) => id !== recipeId)
          : [...prevSaved, recipeId],
      );
      const message = rewardMessage(data, "save");
      if (message) showSuccess(message);
    } catch (error) {
      showError(null, errorText(error, "Could not update saved recipes."));
    }
  };
  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
      >
        <CircularProgress sx={{ color: "page.text" }} />
      </Box>
    );
  }
  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      <Box
        sx={{
          backgroundColor: "tiles.cream",
          color: "primary.main",
          borderRadius: 4,
          p: { xs: 3, md: 5 },
          mb: 6,
          textAlign: "center",
          boxShadow: (theme) => theme.customShadows.soft,
        }}
      >
        <Typography
          variant="h4"
          component="h1"
          sx={{
            fontWeight: "bold",
            color: "text.heading",
            textTransform: "uppercase",
            letterSpacing: 2,
            textShadow: (theme) => theme.customShadows.text,
            mb: 1.5,
          }}
        >
          From Pantry to Plate
        </Typography>
        <Typography
          sx={{
            fontSize: { xs: "1.05rem", md: "1.2rem" },
            lineHeight: 1.6,
            maxWidth: 620,
            mx: "auto",
            mb: 3,
          }}
        >
          Got a few ingredients on hand? Let’s turn them into something
          delicious.
        </Typography>

        <Autocomplete
          multiple
          freeSolo
          options={COMMON_INGREDIENTS}
          value={ingredients}
          onChange={(_, values) => setIngredients(toIngredients(values))}
          filterSelectedOptions
          renderTags={(values, getTagProps) =>
            values.map((value, index) => (
              <Chip
                {...getTagProps({ index })}
                key={value}
                label={value}
                size="small"
                sx={{
                  backgroundColor: "accent.main",
                  color: "accent.contrastText",
                  "& .MuiChip-deleteIcon": { color: "accent.contrastText" },
                }}
              />
            ))
          }
          renderInput={(params) => (
            <TextField
              {...params}
              placeholder={
                ingredients.length
                  ? "Add another ingredient"
                  : "e.g. eggs, spinach, cheese"
              }
              helperText="Press Enter or a comma after each ingredient"
              onKeyDown={(e) => {
                // A comma adds the typed ingredient, like Enter does
                if (e.key === "," && e.target.value.trim()) {
                  e.preventDefault();
                  const typed = e.target.value;
                  setIngredients((prev) => toIngredients([...prev, typed]));
                  params.inputProps.onChange({ target: { value: "" } });
                }
              }}
              InputProps={{
                ...params.InputProps,
                startAdornment: (
                  <>
                    <InputAdornment position="start" sx={{ ml: 1 }}>
                      <SearchIcon />
                    </InputAdornment>
                    {params.InputProps.startAdornment}
                  </>
                ),
              }}
              sx={searchInputSx}
            />
          )}
          sx={{ maxWidth: 640, mx: "auto" }}
        />

        {/* Category and diet filters */}
        <Stack spacing={1.5} alignItems="center" sx={{ mt: 3 }}>
          <Stack
            direction="row"
            flexWrap="wrap"
            useFlexGap
            spacing={1}
            justifyContent="center"
          >
            {CATEGORY_OPTIONS.map((option) => (
              <SelectableChip
                key={option.value}
                tagKey={option.value}
                Icon={option.Icon}
                label={option.label}
                selected={categories.includes(option.value)}
                onClick={() => toggle(setCategories, option.value)}
              />
            ))}
          </Stack>
          <Stack
            direction="row"
            flexWrap="wrap"
            useFlexGap
            spacing={1}
            justifyContent="center"
          >
            {DIET_OPTIONS.map((option) => (
              <SelectableChip
                key={option.value}
                tagKey={option.value}
                Icon={option.Icon}
                label={option.label}
                selected={diets.includes(option.value)}
                onClick={() => toggle(setDiets, option.value)}
              />
            ))}
          </Stack>
          {isFiltering && (
            <Button
              onClick={clearFilters}
              startIcon={<CloseIcon />}
              sx={{
                borderRadius: 999,
                px: 2,
                textTransform: "none",
                fontSize: "1rem",
                color: "accent.main",
              }}
            >
              Clear filters
            </Button>
          )}
        </Stack>
      </Box>

      {searchResults && (
        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 2,
            mb: 3,
            color: "page.text",
          }}
        >
          <Typography sx={{ fontSize: "1.2rem" }}>
            {searching
              ? "Searching…"
              : searchResults.length
                ? resultsSummary()
                : "No recipes match yet. Try removing a filter or ingredient."}
          </Typography>
          <Button
            onClick={clearFilters}
            variant="outlined"
            sx={{
              borderRadius: 999,
              px: 3,
              textTransform: "none",
              fontSize: "1rem",
              color: "page.text",
              borderColor: "page.text",
              "&:hover": { borderColor: "page.text" },
            }}
          >
            Show all recipes
          </Button>
        </Box>
      )}

      <Grid container spacing={4}>
        {(searchResults || recipes).map((recipe) => (
          <Grid item key={recipe._id} xs={12} sm={6} md={4}>
            <RecipeCard
              recipe={recipe}
              userLikedRecipes={userLikedRecipes}
              userSavedRecipes={userSavedRecipes}
              onLike={handleLikeRecipe}
              onSave={handleSaveRecipe}
              matchedIngredients={recipe.matchedIngredients}
            />
          </Grid>
        ))}
      </Grid>
      <Snackbar
        open={!!error}
        autoHideDuration={6000}
        onClose={() => setError(null)}
      >
        <Alert
          onClose={() => setError(null)}
          severity="error"
          sx={{ width: "100%" }}
        >
          {error}
        </Alert>
      </Snackbar>
    </Container>
  );
}
export default Recipes;
