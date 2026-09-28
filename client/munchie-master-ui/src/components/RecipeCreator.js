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
import { CATEGORY_OPTIONS, DIET_OPTIONS, tagLabel } from "../utils/recipeTags";
import SelectableChip from "./SelectableChip";
import { useTranslation } from "react-i18next";
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

// Field outlines and the photo box border use the page background color,
// so they follow light/dark mode
const inputSx = {
  "& .MuiInputBase-root": { backgroundColor: "common.white" },
  "& .MuiOutlinedInput-notchedOutline, & .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline, & .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline":
    { borderColor: "background.default" },
  "& .MuiInputLabel-root.Mui-focused": { color: "primary.main" },
};

const emptyForm = {
  name: "",
  preparationTime: "",
  ingredients: "",
  directions: "",
  categories: [],
  isVegetarian: false,
  isGlutenFree: false,
  isKetoFriendly: false,
};

const splitLines = (text) =>
  text
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);

// Posts a new recipe at /recipes/new and edits one at /recipes/:id/edit
const RecipeCreator = () => {
  const { t } = useTranslation();
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
      .get(`/api/recipes/${id}?original=1`, {
        headers: { "x-auth-token": localStorage.getItem("token") },
      })
      .then(({ data }) => {
        if (!isOwnRecipe(data, currentUser) && !currentUser.isAdmin) {
          showError(null, t("errors.onlyOwnEdit"));
          navigate(`/recipes/${id}`, { replace: true });
          return;
        }
        setForm({
          name: data.name.trim(),
          preparationTime: data.preparationTime || "",
          ingredients: toLines(data.ingredients).join("\n"),
          categories: data.categories || [],
          isVegetarian: !!data.isVegetarian,
          isGlutenFree: !!data.isGlutenFree,
          isKetoFriendly: !!data.isKetoFriendly,
          directions: toLines(data.directions).join("\n"),
        });
        setImagePreview(uploadUrl(data.image) || null);
        setLoadingRecipe(false);
      })
      .catch((error) => {
        showError(null, errorText(error, t("errors.loadRecipe")));
        navigate("/dashboard", { replace: true });
      });
    // Load once per recipe; currentUser changes (like a new coin balance) shouldn't reload
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, isEdit, currentUser?._id]);

  if (!currentUser?._id) return <Navigate replace to="/login" />;

  if (loadingRecipe) {
    return (
      <Box display="flex" justifyContent="center" py={12}>
        <CircularProgress sx={{ color: "page.text" }} />
      </Box>
    );
  }

  const toggleCategory = (value) =>
    setForm((prev) => ({
      ...prev,
      categories: prev.categories.includes(value)
        ? prev.categories.filter((category) => category !== value)
        : [...prev.categories, value],
    }));

  const toggleDiet = (value) =>
    setForm((prev) => ({ ...prev, [value]: !prev[value] }));

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
      showError(null, t("errors.needIngredientAndStep"));
      return;
    }

    // The "[]" suffix makes the server read these as arrays, even with one line
    const data = new FormData();
    if (!form.categories.length) {
      showError(null, t("errors.needCategory"));
      return;
    }
    data.append("name", form.name.trim());
    data.append("preparationTime", form.preparationTime.trim());
    ingredients.forEach((line) => data.append("ingredients[]", line));
    directions.forEach((line) => data.append("directions[]", line));
    form.categories.forEach((category) =>
      data.append("categories[]", category),
    );
    DIET_OPTIONS.forEach(({ value }) => data.append(value, form[value]));
    if (image) data.append("image", image);

    setSubmitting(true);
    const headers = { "x-auth-token": localStorage.getItem("token") };
    try {
      if (isEdit) {
        await axios.put(`/api/recipes/${id}`, data, { headers });
        showSuccess(t("form.updated"));
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
          isEdit ? t("errors.saveChanges") : t("errors.post"),
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
          color: "page.text",
          mb: 1,
        }}
      >
        {isEdit ? t("form.editTitle") : t("form.shareTitle")}
      </Typography>
      <Typography sx={{ fontSize: "1.1rem", color: "page.text", mb: 3 }}>
        {isEdit
          ? t("form.editSubtitle")
          : t("form.shareSubtitle")}
      </Typography>

      {/* How coins work */}
      {!isEdit && (
        <Box
          sx={{
            ...cardSx,
            backgroundColor: "tiles.blue",
            color: "tiles.contrastText",
            mb: 4,
            py: 3,
          }}
        >
          <Stack direction="row" spacing={2} alignItems="flex-start">
            <MonetizationOnIcon sx={{ fontSize: 32, mt: 0.25 }} />
            <Box>
              <Typography sx={{ fontSize: "1.1rem", mb: 0.5 }}>
                {t("form.coinsTitle")}
              </Typography>
              <Typography sx={{ lineHeight: 1.6 }}>
                {currentUser.isAdmin
                  ? t("form.coinsAdmin")
                  : t("form.coinsMember")}
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
              label={t("form.name")}
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
              label={t("form.prepTime")}
              placeholder={t("form.prepTimePlaceholder")}
              value={form.preparationTime}
              onChange={handleChange}
              sx={inputSx}
            />
          </Grid>
          <Grid item xs={12} sm={7}>
            <Typography sx={{ mb: 1 }}>{t("form.category")}</Typography>
            <Stack direction="row" flexWrap="wrap" useFlexGap spacing={1}>
              {CATEGORY_OPTIONS.map((option) => (
                <SelectableChip
                  key={option.value}
                  tagKey={option.value}
                  Icon={option.Icon}
                  label={tagLabel(option.value)}
                  selected={form.categories.includes(option.value)}
                  onClick={() => toggleCategory(option.value)}
                />
              ))}
            </Stack>
          </Grid>
          <Grid item xs={12} sm={5}>
            <Typography sx={{ mb: 1 }}>{t("form.dietary")}</Typography>
            <Stack direction="row" flexWrap="wrap" useFlexGap spacing={1}>
              {DIET_OPTIONS.map((option) => (
                <SelectableChip
                  key={option.value}
                  tagKey={option.value}
                  Icon={option.Icon}
                  label={tagLabel(option.value)}
                  selected={form[option.value]}
                  onClick={() => toggleDiet(option.value)}
                />
              ))}
            </Stack>
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              required
              multiline
              minRows={5}
              name="ingredients"
              label={t("form.ingredients")}
              helperText={t("form.ingredientsHelp")}
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
              label={t("form.directions")}
              helperText={t("form.directionsHelp")}
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
                borderColor: "background.default",
                backgroundColor: "common.white",
                cursor: "pointer",
                overflow: "hidden",
              }}
            >
              {imagePreview ? (
                <Box
                  component="img"
                  src={imagePreview}
                  alt={t("form.photoAlt")}
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
                  <Typography>{t("form.addPhoto")}</Typography>
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
                {t("form.changePhoto")}
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
            {t("form.cancel")}
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
                ? t("form.saving")
                : t("form.saveChanges")
              : submitting
                ? t("form.posting")
                : t("form.post")}
          </Button>
        </Stack>
      </Box>
    </Container>
  );
};

export default RecipeCreator;
