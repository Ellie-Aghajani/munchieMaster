import React, { useState, useEffect, useCallback } from "react";
import {
  Container,
  Typography,
  Card,
  CardContent,
  CardMedia,
  Box,
  CircularProgress,
  Paper,
  IconButton,
  Snackbar,
  Alert,
  Grid,
} from "@mui/material";
import axios from "axios";
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import { useError } from '../contexts/ErrorContext';
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import config from '../config';

axios.defaults.baseURL = config.serverUrl;

console.log(config.serverUrl)

function Recipes() {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userLikedRecipes, setUserLikedRecipes] = useState([]);
  const [userSavedRecipes, setUserSavedRecipes] = useState([]);
  const [error, setError] = useState(null);
  const { showError } = useError();
  const { logout } = useAuth();
  const navigate = useNavigate();

  const fetchRecipes = useCallback(async () => {
    try {
      const [recipesResponse, savedRecipesResponse, likedRecipesResponse] = await Promise.all([
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
        })
      ]);
      setRecipes(recipesResponse.data);
      setUserSavedRecipes(
        savedRecipesResponse.data.savedRecipes?.map((recipe) => recipe._id)
      );
      setUserLikedRecipes(
        likedRecipesResponse.data.likedRecipes?.map((recipe) => recipe._id)
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
        error.response?.data?.message || "An error occurred while fetching data"
      );
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRecipes();
  }, [fetchRecipes]);

  const handleLikeRecipe = async (recipeId) => {
    try {
      const response = await axios.post(`/api/recipes/${recipeId}/like`, {}, {
        headers: {
          "Content-Type": "application/json",
          "x-auth-token": localStorage.getItem("token"),
        },
        baseURL: config.serverUrl,
      });
      if (response.data.success) {
        setUserLikedRecipes((prevLiked) =>
          prevLiked.includes(recipeId)
            ? prevLiked.filter((id) => id !== recipeId)
            : [...prevLiked, recipeId]
        );
        setRecipes((prevRecipes) =>
          prevRecipes.map((recipe) =>
            recipe._id === recipeId
              ? { ...recipe, likeCount: response.data.likeCount }
              : recipe
          )
        );
      }
    } catch (error) {
      console.error("Error liking recipe:", error);
      showError("An error occurred while liking the recipe");
    }
  };

  const handleSaveRecipe = async (recipeId) => {
    try {
      const response = await axios.post(
        "/api/users/save-recipe",
        { recipeId },
        {
          headers: {
            "Content-Type": "application/json",
            "x-auth-token": localStorage.getItem("token"),
          },
        }
      );
      if (response.data.success) {
        setUserSavedRecipes((prevSaved) =>
          prevSaved.includes(recipeId)
            ? prevSaved.filter((id) => id !== recipeId)
            : [...prevSaved, recipeId]
        );
        setRecipes((prevRecipes) =>
          prevRecipes.map((recipe) =>
            recipe._id === recipeId
              ? { ...recipe, savedBy: response.data.savedByCount }
              : recipe
          )
        );
      }
    } catch (error) {
      console.error("Error saving recipe:", error);
      showError("An error occurred while saving the recipe");
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
        <CircularProgress />
      </Box>
    );
  }
  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      <Box
        sx={{
          backgroundColor: "#f0f8ff",
          borderRadius: 4,
          padding: 3,
          marginBottom: 6,
          boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
        }}
      >
        <Typography
          variant="h3"
          component="h1"
          align="center"
          sx={{
            fontWeight: "bold",
            color: "#2c3e50",
            textTransform: "uppercase",
            letterSpacing: 2,
            textShadow: "2px 2px 4px rgba(0, 0, 0, 0.1)",
          }}
        >
          Recipes
        </Typography>
      </Box>
      <Grid container spacing={4}>
        {recipes.map((recipe) => (
          <Grid item key={recipe._id} xs={12} sm={6} md={4}>
            <Card
              sx={{ height: "100%", display: "flex", flexDirection: "column" }}
            >
              <CardMedia
                component="img"
                height="200"
                image={`${config.serverUrl}/${recipe.image}`}
                alt={recipe.name}
              />
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography gutterBottom variant="h5" component="div">
                  {recipe.name}
                </Typography>
                <Box display="flex" alignItems="center" mb={2}>
                  <AccessTimeIcon sx={{ mr: 1 }} />
                  <Typography variant="body2" color="text.secondary">
                    {recipe.preparationTime}
                  </Typography>
                </Box>
                <Typography variant="body2" color="text.secondary" paragraph>
                  Ingredients: {recipe.ingredients.slice(0, 3).join(", ")}
                  {recipe.ingredients.length > 3 && "..."}
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
                    <IconButton onClick={() => handleLikeRecipe(recipe._id)}>
                      {userLikedRecipes.includes(recipe._id) ? (
                        <FavoriteIcon color="error" />
                      ) : (
                        <FavoriteBorderIcon />
                      )}
                    </IconButton>
                    <Typography variant="body2" component="span">
                      {recipe.likeCount} likes
                    </Typography>
                  </Box>
                  <Box>
                    <IconButton onClick={() => handleSaveRecipe(recipe._id)}>
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
