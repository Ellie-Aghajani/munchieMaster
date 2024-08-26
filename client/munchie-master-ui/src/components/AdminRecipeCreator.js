import React, { useState } from "react";
import axios from "axios";
import {
  TextField,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Box,
  Typography,
} from "@mui/material";

const AdminRecipeCreator = () => {
  const [recipe, setRecipe] = useState({
    name: "",
    ingredients: "",
    instructions: "",
    meal: "",
    image: null,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setRecipe((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    setRecipe((prevState) => ({
      ...prevState,
      image: e.target.files[0],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    for (const key in recipe) {
      formData.append(key, recipe[key]);
    }

    try {
      const response = await axios.post("/api/recipes", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      console.log("Recipe created:", response.data);
      // Reset form or show success message
    } catch (error) {
      console.error("Error creating recipe:", error);
      // Show error message
    }
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{ maxWidth: 600, margin: "auto", mt: 4 }}
    >
      <Typography variant="h4" gutterBottom>
        Create New Recipe
      </Typography>
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
        name="ingredients"
        label="Ingredients (comma separated)"
        multiline
        rows={4}
        value={recipe.ingredients}
        onChange={handleChange}
        required
      />
      <TextField
        fullWidth
        margin="normal"
        name="instructions"
        label="Instructions"
        multiline
        rows={4}
        value={recipe.instructions}
        onChange={handleChange}
        required
      />
      <FormControl fullWidth margin="normal">
        <InputLabel id="meal-select-label">Meal Type</InputLabel>
        <Select
          labelId="meal-select-label"
          name="meal"
          value={recipe.meal}
          onChange={handleChange}
          required
        >
          <MenuItem value="">Select Meal Type</MenuItem>
          <MenuItem value="breakfast">Breakfast</MenuItem>
          <MenuItem value="lunch">Lunch</MenuItem>
          <MenuItem value="dinner">Dinner</MenuItem>
        </Select>
      </FormControl>
      <Button variant="contained" component="label" sx={{ mt: 2, mb: 2 }}>
        Upload Image
        <input
          type="file"
          hidden
          name="image"
          onChange={handleImageChange}
          accept="image/*"
        />
      </Button>
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
