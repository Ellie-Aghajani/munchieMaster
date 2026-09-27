import React, { useState, useEffect, useCallback } from "react";
import {
  Container,
  Typography,
  Box,
  CircularProgress,
  Snackbar,
  Alert,
  Grid,
} from "@mui/material";
import axios from "axios";
import RecipeCard from "./RecipeCard";
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

function Recipes() {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userLikedRecipes, setUserLikedRecipes] = useState([]);
  const [userSavedRecipes, setUserSavedRecipes] = useState([]);
  const [error, setError] = useState(null);
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

  const handleLikeRecipe = async (recipeId) => {
    try {
      const data = await likeRecipe(recipeId);
      if (!data.success) return;
      setUserLikedRecipes((prevLiked) =>
        prevLiked.includes(recipeId)
          ? prevLiked.filter((id) => id !== recipeId)
          : [...prevLiked, recipeId],
      );
      setRecipes((prevRecipes) =>
        prevRecipes.map((recipe) =>
          recipe._id === recipeId
            ? { ...recipe, likeCount: data.likeCount }
            : recipe,
        ),
      );
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
          borderRadius: 4,
          padding: 3,
          marginBottom: 6,
          boxShadow: (theme) => theme.customShadows.soft,
        }}
      >
        <Typography
          variant="h3"
          component="h1"
          align="center"
          sx={{
            fontWeight: "bold",
            color: "text.heading",
            textTransform: "uppercase",
            letterSpacing: 2,
            textShadow: (theme) => theme.customShadows.text,
          }}
        >
          Recipes
        </Typography>
      </Box>
      <Grid container spacing={4}>
        {recipes.map((recipe) => (
          <Grid item key={recipe._id} xs={12} sm={6} md={4}>
            <RecipeCard
              recipe={recipe}
              userLikedRecipes={userLikedRecipes}
              userSavedRecipes={userSavedRecipes}
              onLike={handleLikeRecipe}
              onSave={handleSaveRecipe}
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
