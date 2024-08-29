import React, { useState } from "react";
import axios from "axios";
import {
  TextField,
  Button,
  Box,
  Typography,
  Alert,
  CircularProgress,
} from "@mui/material";

const AdminRecipeCreator = () => {
  const emptRecipe = {
    name: "",
    ingredients: [],
    directions: [],
    preparationTime: "",
    image: null,
  };
  const [recipe, setRecipe] = useState(emptRecipe);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setRecipe((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setIsUploading(true);
      setRecipe((prevState) => ({
        ...prevState,
        image: file,
      }));
    
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
        setIsUploading(false);
      };
      reader.readAsDataURL(file);
    } else {
      setRecipe((prevState) => ({
        ...prevState,
        image: null,
      }));
      setImagePreview(null);
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log("Form Data:", recipe);
      const response = await axios.post("/api/recipes", recipe, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      console.log("Recipe created:", response.data);
      setSuccess(true);
      setError("");
      setRecipe(emptRecipe);
    } catch (error) {
      console.error("Error creating recipe:", error);
      setError("Failed to create recipe. Please try again: " + error.response.data);
    } 
  };  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{ maxWidth: 600, margin: "auto", mt: 4 }}
    >
      <Typography variant="h4" gutterBottom>
        Create New Recipe
      </Typography>
      {error && <Alert severity="error">{error}</Alert>}
      {success && <Alert severity="success">Recipe created successfully!</Alert>}
      <TextField
        fullWidth
        margin="normal"
        name="name"
        label="Recipe Name"
        value={recipe.name}
        onChange={handleChange}
        required
      />
      <TextField
        fullWidth
        margin="normal"
        name="preparationTime"
        label="Prparation Time"
        value={recipe.preparationTime}
        onChange={handleChange}
        required
      />
      <TextField
        fullWidth
        margin="normal"
        name="ingredients"
        label="Ingredients (one per line)"
        multiline
        rows={4}
        value={recipe.ingredients.join('\n')}
        onChange={(e) => setRecipe(prev => ({ ...prev, ingredients: e.target.value.split('\n') }))}
        required
      />
      <TextField
        fullWidth
        margin="normal"
        name="directions"
        label="Directions (one step per line)"
        multiline
        rows={4}
        value={recipe.directions.join('\n')}
        onChange={(e) => setRecipe(prev => ({ ...prev, directions: e.target.value.split('\n') }))}
        required
      />
      <Button
        variant="contained"
        component="label"
        sx={{ mt: 2, mb: 2 }}
        disabled={isUploading}
      >
        {isUploading ? <CircularProgress size={24} /> : "Upload Image"}
        <input
          type="file"
          hidden
          name="image"
          onChange={handleImageChange}
          accept="image/*"
        />
      </Button>
      {isUploading ? (
        <Box sx={{ mt: 2, mb: 2 }}>
          <CircularProgress />
        </Box>
      ) : imagePreview && (
        <Box sx={{ mt: 2, mb: 2 }}>
          <img src={imagePreview} alt="Recipe preview" style={{ maxWidth: '100%', maxHeight: '200px' }} />
        </Box>
      )}
      <Button
        type="submit"
        variant="contained"
        color="primary"
        fullWidth
        sx={{ mt: 2 }}
      >
        Create Recipe
      </Button>
    </Box>
  );
};

export default AdminRecipeCreator;
