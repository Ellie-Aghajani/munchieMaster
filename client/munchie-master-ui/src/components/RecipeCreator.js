import React, { useEffect, useState } from "react";
import { Link, Navigate, useNavigate, useParams } from "react-router-dom";
import {
  Box,
  Button,
  CircularProgress,
  Container,
  Grid,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
import axios from "axios";
import { useAuth } from "../contexts/AuthContext";
import { useError } from "../contexts/ErrorContext";
import { errorText, postMessage } from "../api/recipeActions";
import { isOwnRecipe, toLines, uploadUrl } from "../utils/recipeUtils";

const cardSx = {
  p: { xs: 3, md: 4 },
  borderRadius: 4,
  color: "primary.main",
  boxShadow: (theme) => theme.customShadows.raised,
};

const pillButtonSx = {
  borderRadius: 999,
  px: 3,
  py: 1,
  textTransform: "none",
  fontSize: "1rem",
};

const inputSx = { "& .MuiInputBase-root": { backgroundColor: "common.white" } };

const emptyForm = {
  name: "",
  preparationTime: "",
  ingredients: "",
  directions: "",
};

const splitLines = (text) =>
  text
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);

// Posts a new recipe at /recipes/new and edits one at /recipes/:id/edit
const RecipeCreator = () => {
  const { id } = useParams();
  const isEdit = !!id;
  const { currentUser, checkAuthStatus } = useAuth();
  const { showError, showSuccess } = useError();
  const navigate = useNavigate();
  const [form, setForm] = useState(emptyForm);
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [loadingRecipe, setLoadingRecipe] = useState(isEdit);

  // In edit mode, load the recipe and fill in the form
  useEffect(() => {
    if (!isEdit || !currentUser?._id) return;
    setLoadingRecipe(true);
    axios
      .get(`/api/recipes/${id}`, {
        headers: { "x-auth-token": localStorage.getItem("token") },
      })
      .then(({ data }) => {
        if (!isOwnRecipe(data, currentUser) && !currentUser.isAdmin) {
          showError(null, "You can only edit your own recipes.");
          navigate(`/recipes/${id}`, { replace: true });
          return;
        }
        setForm({
          name: data.name.trim(),
          preparationTime: data.preparationTime || "",
          ingredients: toLines(data.ingredients).join("\n"),
          directions: toLines(data.directions).join("\n"),
        });
        setImagePreview(uploadUrl(data.image) || null);
        setLoadingRecipe(false);
      })
      .catch((error) => {
        showError(null, errorText(error, "Could not load this recipe."));
        navigate("/dashboard", { replace: true });
      });
    // Load once per recipe; currentUser changes (like a new coin balance) shouldn't reload
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, isEdit, currentUser?._id]);

  if (!currentUser?._id) return <Navigate replace to="/login" />;

  if (loadingRecipe) {
    return (
      <Box display="flex" justifyContent="center" py={12}>
        <CircularProgress />
      </Box>
    );
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file || null);
    setImagePreview(file ? URL.createObjectURL(file) : null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const ingredients = splitLines(form.ingredients);
    const directions = splitLines(form.directions);
    if (!ingredients.length || !directions.length) {
      showError(null, "Add at least one ingredient and one step.");
      return;
    }

    // The "[]" suffix makes the server read these as arrays, even with one line
    const data = new FormData();
    data.append("name", form.name.trim());
    data.append("preparationTime", form.preparationTime.trim());
    ingredients.forEach((line) => data.append("ingredients[]", line));
    directions.forEach((line) => data.append("directions[]", line));
    if (image) data.append("image", image);

    setSubmitting(true);
    const headers = { "x-auth-token": localStorage.getItem("token") };
    try {
      if (isEdit) {
        await axios.put(`/api/recipes/${id}`, data, { headers });
        showSuccess("Recipe updated.");
        navigate(`/recipes/${id}`);
      } else {
        const response = await axios.post("/api/recipes", data, { headers });
        showSuccess(postMessage(response.data));
        await checkAuthStatus();
        navigate(`/recipes/${response.data.recipe._id}`);
      }
    } catch (error) {
      showError(
        null,
        errorText(
          error,
          isEdit
            ? "Could not save your changes."
            : "Could not post your recipe.",
        ),
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Container maxWidth="md" sx={{ py: { xs: 3, md: 5 } }}>
      <Typography
        variant="h1"
        sx={{
          fontSize: { xs: "2rem", md: "2.75rem" },
          color: "primary.main",
          mb: 1,
        }}
      >
        {isEdit ? "Edit Recipe" : "Share a Recipe"}
      </Typography>
      <Typography sx={{ fontSize: "1.1rem", color: "primary.main", mb: 3 }}>
        {isEdit
          ? "Update your recipe. Editing doesn't change your coins or its price."
          : "Share a favorite with others and earn coins."}
      </Typography>

      {/* How coins work */}
      {!isEdit && (
        <Box sx={{ ...cardSx, backgroundColor: "tiles.blue", mb: 4, py: 3 }}>
          <Stack direction="row" spacing={2} alignItems="flex-start">
            <MonetizationOnIcon sx={{ fontSize: 32, mt: 0.25 }} />
            <Box>
              <Typography sx={{ fontSize: "1.1rem", mb: 0.5 }}>
                You earn 5 coins for posting this recipe.
              </Typography>
              <Typography sx={{ lineHeight: 1.6 }}>
                {currentUser.isAdmin
                  ? "As an admin, your recipes are free for everyone."
                  : "Other members pay 5 coins to unlock it, and those coins go to you. You also earn 1 coin for every like and 2 coins for every save."}
              </Typography>
            </Box>
          </Stack>
        </Box>
      )}

      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{ ...cardSx, backgroundColor: "tiles.cream" }}
      >
        <Grid container spacing={2.5}>
          <Grid item xs={12} sm={8}>
            <TextField
              fullWidth
              required
              name="name"
              label="Recipe name"
              value={form.name}
              onChange={handleChange}
              inputProps={{ minLength: 3, maxLength: 50 }}
              sx={inputSx}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              required
              name="preparationTime"
              label="Preparation time"
              placeholder="e.g. 15-20 minutes"
              value={form.preparationTime}
              onChange={handleChange}
              sx={inputSx}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              required
              multiline
              minRows={5}
              name="ingredients"
              label="Ingredients"
              helperText="One ingredient per line"
              value={form.ingredients}
              onChange={handleChange}
              sx={inputSx}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              required
              multiline
              minRows={6}
              name="directions"
              label="Directions"
              helperText="One step per line; steps are numbered for you"
              value={form.directions}
              onChange={handleChange}
              sx={inputSx}
            />
          </Grid>

          <Grid item xs={12}>
            <Box
              component="label"
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: 1,
                minHeight: 180,
                p: 2,
                borderRadius: 3,
                border: "2px dashed",
                borderColor: "primary.main",
                backgroundColor: "common.white",
                cursor: "pointer",
                overflow: "hidden",
              }}
            >
              {imagePreview ? (
                <Box
                  component="img"
                  src={imagePreview}
                  alt="Recipe preview"
                  sx={{
                    maxWidth: "100%",
                    maxHeight: 280,
                    borderRadius: 2,
                    objectFit: "cover",
                  }}
                />
              ) : (
                <>
                  <AddPhotoAlternateIcon sx={{ fontSize: 40 }} />
                  <Typography>Add a photo of your recipe</Typography>
                </>
              )}
              <input
                type="file"
                hidden
                accept="image/*"
                onChange={handleImageChange}
              />
            </Box>
            {imagePreview && (
              <Typography variant="body2" sx={{ mt: 1 }}>
                Click the photo to choose a different one.
              </Typography>
            )}
          </Grid>
        </Grid>

        <Stack
          direction={{ xs: "column-reverse", sm: "row" }}
          spacing={1.5}
          justifyContent="flex-end"
          mt={4}
        >
          <Button
            component={Link}
            to={isEdit ? `/recipes/${id}` : "/dashboard"}
            variant="outlined"
            sx={pillButtonSx}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={submitting}
            sx={{
              ...pillButtonSx,
              color: "accent.contrastText",
              backgroundColor: "accent.main",
              "&:hover": { backgroundColor: "accent.dark" },
              "&.Mui-disabled": { color: "accent.contrastText", opacity: 0.6 },
            }}
          >
            {isEdit
              ? submitting
                ? "Saving…"
                : "Save Changes"
              : submitting
                ? "Posting…"
                : "Post Recipe · +5 coins"}
          </Button>
        </Stack>
      </Box>
    </Container>
  );
};

export default RecipeCreator;
