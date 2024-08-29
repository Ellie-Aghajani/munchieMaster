import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Container,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Avatar,
  Chip,
  Fade,
  Button,
} from "@mui/material";
import { useError } from "../contexts/ErrorContext";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import EditIcon from "@mui/icons-material/Edit";

function UserProfile() {
  const [user, setUser] = useState(null);
  const [savedRecipes, setSavedRecipes] = useState([]);
  const [userRecipes, setUserRecipes] = useState([]);
  const { showError } = useError();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userResponse = await axios.get("/api/users/me", {
          headers: {
            "x-auth-token": localStorage.getItem("token"),
          },
        });
        setUser(userResponse.data);

        const savedRecipesResponse = await axios.get(
          "/api/users/saved-recipes",
          {
            headers: {
              "x-auth-token": localStorage.getItem("token"),
            },
          }
        );
        setSavedRecipes(savedRecipesResponse.data.savedRecipes);
        setUserRecipes(userResponse.data.myRecepies ?? []);
      } catch (error) {
        showError("Failed to fetch user data");
      }
    };

    fetchUserData();
  }, [showError]);

  const handleEditRecipe = (recipeId) => {
    // Implement the edit functionality here
    console.log(`Edit recipe with id: ${recipeId}`);
  };

  if (!user) {
    return <Typography>Loading...</Typography>;
  }

  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      {/* User profile section */}
      <Fade in={true} timeout={1000}>
        <Box sx={{ mb: 6, display: "flex", alignItems: "center", gap: 4 }}>
          <Avatar
            sx={{ width: 100, height: 100, fontSize: "3rem" }}
            alt={user.name}
            src={user.avatar || ""}
          >
            {user.name.charAt(0)}
          </Avatar>
          <Box>
            <Typography variant="h4" component="h1" gutterBottom>
              {user.name}
            </Typography>
            <Typography variant="subtitle1" color="text.secondary">
              {user.email}
            </Typography>
          </Box>
        </Box>
      </Fade>

      {/* My Recipes section */}
      <Typography variant="h5" component="h2" gutterBottom sx={{ mb: 4 }}>
        My Recipes
      </Typography>
      <Grid container spacing={4} sx={{ mb: 6 }}>
        {userRecipes.map((recipe) => (
          <Grid item key={recipe._id} xs={12} sm={6} md={4}>
            <Fade in={true} timeout={1000}>
              <Card
                sx={{
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <CardMedia
                  component="img"
                  height="200"
                  image={`http://localhost:3001${recipe.image}`}
                  alt={recipe.name}
                />
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography gutterBottom variant="h6" component="div">
                    {recipe.name}
                  </Typography>
                  <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                    <AccessTimeIcon sx={{ mr: 1, fontSize: "small" }} />
                    <Typography variant="body2" color="text.secondary">
                      {recipe.preparationTime}
                    </Typography>
                  </Box>
                  <Box
                    sx={{ display: "flex", flexWrap: "wrap", gap: 1, mb: 2 }}
                  >
                    {recipe.tags &&
                      recipe.tags.map((tag, index) => (
                        <Chip key={index} label={tag} size="small" />
                      ))}
                  </Box>
                  <Button
                    variant="outlined"
                    startIcon={<EditIcon />}
                    onClick={() => handleEditRecipe(recipe._id)}
                  >
                    Edit
                  </Button>
                </CardContent>
              </Card>
            </Fade>
          </Grid>
        ))}
      </Grid>

      {/* Saved Recipes section */}
      <Typography variant="h5" component="h2" gutterBottom sx={{ mb: 4 }}>
        Saved Recipes
      </Typography>
      <Grid container spacing={4}>
        {savedRecipes.map((recipe) => (
          <Grid item key={recipe._id} xs={12} sm={6} md={4}>
            <Fade in={true} timeout={1000}>
              <Card
                sx={{
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <CardMedia
                  component="img"
                  height="200"
                  image={`http://localhost:3001${recipe.image}`}
                  alt={recipe.name}
                />
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography gutterBottom variant="h6" component="div">
                    {recipe.name}
                  </Typography>
                  <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                    <AccessTimeIcon sx={{ mr: 1, fontSize: "small" }} />
                    <Typography variant="body2" color="text.secondary">
                      {recipe.preparationTime}
                    </Typography>
                  </Box>
                  <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                    {recipe.tags &&
                      recipe.tags.map((tag, index) => (
                        <Chip key={index} label={tag} size="small" />
                      ))}
                  </Box>
                </CardContent>
              </Card>
            </Fade>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}

export default UserProfile;
