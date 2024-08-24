import React, { useState, useEffect } from 'react';
import { Container, Typography, List, ListItem, ListItemText, Paper } from '@mui/material';
import axios from 'axios';

function Recipes() {
  const [recipes, setRecipes] = useState([]);

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const response = await axios.get('/api/recipes',{
          headers: {
            'Content-Type': 'application/json'
          },
          baseURL: 'http://localhost:3001',
        });
        setRecipes(response.data);
      } catch (error) {
        console.error('Error fetching recipes:', error);
      }
    };

    fetchRecipes();
  }, []);

  return (
    <Container maxWidth="md">
      <Typography variant="h4" component="h2" gutterBottom>
        MunchieMaster Recipes
      </Typography>
      <List>
        {recipes.map((recipe) => (
          <ListItem key={recipe.id} component={Paper} elevation={2} sx={{ mb: 2, p: 2 }}>
            <ListItemText
              primary={<Typography variant="h6">{recipe.name}</Typography>}

              secondary={
                <Typography variant="body2" color="text.secondary">
                  Ingredients: {recipe.ingredients.join(', ')},
                  
                </Typography> 
              }
            />
          </ListItem>
        ))}
      </List>
    </Container>
  );
}

export default Recipes;