import React, { useEffect, useRef, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import axios from "axios";
import {
  Avatar,
  Box,
  Button,
  Chip,
  CircularProgress,
  Container,
  Divider,
  Grid,
  IconButton,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import PlaceOutlinedIcon from "@mui/icons-material/PlaceOutlined";
import MailOutlineIcon from "@mui/icons-material/MailOutline";
import { useAuth } from "../contexts/AuthContext";
import { useError } from "../contexts/ErrorContext";
import { errorText } from "../api/recipeActions";
import { uploadUrl } from "../utils/recipeUtils";
import AvatarCropDialog from "./AvatarCropDialog";

const MAX_PHOTO_MB = 10; // Before cropping; the saved photo is a small 512px JPEG
const DESCRIPTION_MAX = 500;

const FIELDS = [
  "name",
  "firstName",
  "lastName",
  "country",
  "province",
  "city",
  "description",
];

const cardSx = {
  p: { xs: 3, md: 4 },
  borderRadius: 4,
  color: "primary.main",
  backgroundColor: "tiles.cream",
  boxShadow: (theme) => theme.customShadows.raised,
};

const pillButtonSx = {
  borderRadius: 999,
  px: 3,
  py: 1,
  textTransform: "none",
  fontSize: "1rem",
};

const accentButtonSx = {
  ...pillButtonSx,
  color: "accent.contrastText",
  backgroundColor: "accent.main",
  "&:hover": { backgroundColor: "accent.dark" },
  "&.Mui-disabled": { color: "accent.contrastText", opacity: 0.5 },
};

const inputSx = { "& .MuiInputBase-root": { backgroundColor: "common.white" } };

const sectionTitleSx = { fontSize: "1.25rem", mb: 2 };

const authHeaders = () => ({ "x-auth-token": localStorage.getItem("token") });

const formFromUser = (user) =>
  Object.fromEntries(FIELDS.map((field) => [field, user?.[field] || ""]));

const displayName = (user) =>
  [user.firstName, user.lastName].filter(Boolean).join(" ") || user.name;

function UserProfile() {
  const { currentUser, checkAuthStatus } = useAuth();
  const { showError, showSuccess } = useError();
  const [form, setForm] = useState(() => formFromUser(currentUser));
  const [saving, setSaving] = useState(false);
  const [photoBusy, setPhotoBusy] = useState(false);
  const fileInputRef = useRef(null);
  const [cropSrc, setCropSrc] = useState(null);

  // Refill the form if the logged-in user changes
  useEffect(() => {
    setForm(formFromUser(currentUser));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser?._id]);

  if (!currentUser?._id) return <Navigate replace to="/login" />;

  const saved = formFromUser(currentUser);
  const isDirty = FIELDS.some((field) => form[field].trim() !== saved[field]);
  const nameError = form.name.trim().length < 3 ? "At least 3 characters" : "";
  const location = [currentUser.city, currentUser.province, currentUser.country]
    .filter(Boolean)
    .join(", ");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (nameError) return;
    setSaving(true);
    try {
      const trimmed = Object.fromEntries(
        FIELDS.map((field) => [field, form[field].trim()]),
      );
      await axios.put("/api/users/me", trimmed, { headers: authHeaders() });
      await checkAuthStatus();
      setForm(trimmed);
      showSuccess("Profile saved.");
    } catch (error) {
      showError(null, errorText(error, "Could not save your profile."));
    } finally {
      setSaving(false);
    }
  };

  const handlePhotoChange = async (e) => {
    const file = e.target.files[0];
    e.target.value = ""; // Allow picking the same file again later
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      showError(null, "Please choose an image file.");
      return;
    }
    if (file.size > MAX_PHOTO_MB * 1024 * 1024) {
      showError(null, `Please choose a photo under ${MAX_PHOTO_MB} MB.`);
      return;
    }

    setCropSrc(URL.createObjectURL(file));
  };

  const closeCrop = () => {
    if (cropSrc) URL.revokeObjectURL(cropSrc);
    setCropSrc(null);
  };

  // Upload the cropped photo chosen in the crop dialog
  const handleCropped = async (blob) => {
    const data = new FormData();
    data.append("avatar", blob, "avatar.jpg");
    setPhotoBusy(true);
    try {
      await axios.put("/api/users/avatar", data, { headers: authHeaders() });
      await checkAuthStatus();
      closeCrop();
      showSuccess("Profile photo updated.");
    } catch (error) {
      showError(null, errorText(error, "Could not update your photo."));
    } finally {
      setPhotoBusy(false);
    }
  };

  const handleRemovePhoto = async () => {
    setPhotoBusy(true);
    try {
      await axios.delete("/api/users/avatar", { headers: authHeaders() });
      await checkAuthStatus();
      showSuccess("Profile photo removed.");
    } catch (error) {
      showError(null, errorText(error, "Could not remove your photo."));
    } finally {
      setPhotoBusy(false);
    }
  };

  const textField = (name, label, extra = {}) => (
    <TextField
      fullWidth
      name={name}
      label={label}
      value={form[name]}
      onChange={handleChange}
      inputProps={{ maxLength: 50 }}
      sx={inputSx}
      {...extra}
    />
  );

  return (
    <Container maxWidth="lg" sx={{ py: { xs: 3, md: 5 } }}>
      <Button
        component={Link}
        to="/dashboard"
        startIcon={<ArrowBackIcon />}
        sx={{ ...pillButtonSx, px: 2, mb: 2, color: "page.text" }}
      >
        Dashboard
      </Button>
      <Typography
        variant="h1"
        sx={{
          fontSize: { xs: "2rem", md: "2.75rem" },
          color: "page.text",
          mb: 1,
        }}
      >
        Edit Profile
      </Typography>
      <Typography sx={{ fontSize: "1.1rem", color: "page.text", mb: 4 }}>
        This is how other parents see you next to the recipes you share.
      </Typography>

      <Grid container spacing={4} alignItems="flex-start">
        {/* Profile summary and photo */}
        <Grid item xs={12} md={4}>
          <Box
            sx={{
              ...cardSx,
              textAlign: "center",
              position: { md: "sticky" },
              top: { md: 24 },
            }}
          >
            <Box sx={{ position: "relative", display: "inline-block", mb: 2 }}>
              <Avatar
                src={uploadUrl(currentUser.avatar)}
                alt={displayName(currentUser)}
                sx={{
                  width: 128,
                  height: 128,
                  fontSize: "3rem",
                  backgroundColor: "tiles.lavender",
                  color: "primary.main",
                  border: "4px solid",
                  borderColor: "common.white",
                  boxShadow: (theme) => theme.customShadows.soft,
                }}
              >
                {displayName(currentUser)?.[0]?.toUpperCase()}
              </Avatar>
              {photoBusy && (
                <CircularProgress
                  size={136}
                  thickness={2}
                  sx={{ position: "absolute", top: -4, left: -4 }}
                />
              )}
              <Tooltip title="Change photo">
                <IconButton
                  onClick={() => fileInputRef.current?.click()}
                  disabled={photoBusy}
                  aria-label="Change photo"
                  sx={{
                    position: "absolute",
                    right: 0,
                    bottom: 0,
                    backgroundColor: "accent.main",
                    color: "accent.contrastText",
                    boxShadow: (theme) => theme.customShadows.soft,
                    "&:hover": { backgroundColor: "accent.dark" },
                  }}
                >
                  <PhotoCameraIcon fontSize="small" />
                </IconButton>
              </Tooltip>
              <input
                ref={fileInputRef}
                type="file"
                hidden
                accept="image/*"
                onChange={handlePhotoChange}
              />
            </Box>

            <Typography sx={{ fontSize: "1.5rem", lineHeight: 1.3 }}>
              {displayName(currentUser)}
            </Typography>
            <Stack
              spacing={0.5}
              alignItems="center"
              sx={{ mt: 1, color: "text.secondary" }}
            >
              <Stack direction="row" spacing={0.75} alignItems="center">
                <MailOutlineIcon fontSize="small" />
                <Typography variant="body2">{currentUser.email}</Typography>
              </Stack>
              {location && (
                <Stack direction="row" spacing={0.75} alignItems="center">
                  <PlaceOutlinedIcon fontSize="small" />
                  <Typography variant="body2">{location}</Typography>
                </Stack>
              )}
            </Stack>

            <Stack
              direction="row"
              spacing={1}
              justifyContent="center"
              flexWrap="wrap"
              useFlexGap
              sx={{ mt: 2.5 }}
            >
              <Chip
                icon={<MonetizationOnIcon />}
                label={`${currentUser.coins ?? 0} coins`}
              />
              <Chip
                icon={<MenuBookIcon />}
                label={`${currentUser.myRecipes?.length ?? 0} shared`}
              />
            </Stack>

            {currentUser.avatar && (
              <Button
                onClick={handleRemovePhoto}
                disabled={photoBusy}
                color="error"
                startIcon={<DeleteOutlineIcon />}
                sx={{ ...pillButtonSx, mt: 2.5, px: 2 }}
              >
                Remove photo
              </Button>
            )}
            <Typography
              variant="body2"
              sx={{
                mt: currentUser.avatar ? 0.5 : 2.5,
                color: "text.secondary",
              }}
            >
              JPG or PNG, up to {MAX_PHOTO_MB} MB. You can crop it before
              saving.
            </Typography>
          </Box>
        </Grid>

        {/* Editable details */}
        <Grid item xs={12} md={8}>
          <Box component="form" onSubmit={handleSave} sx={cardSx}>
            <Typography sx={sectionTitleSx}>Personal info</Typography>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                {textField("name", "Display name", {
                  required: true,
                  error: !!nameError,
                  helperText:
                    nameError ||
                    "Your account name. Recipes show your first name if you add one.",
                })}
              </Grid>
              <Grid item xs={12} sm={6}>
                {textField("firstName", "First name")}
              </Grid>
              <Grid item xs={12} sm={6}>
                {textField("lastName", "Last name")}
              </Grid>
            </Grid>

            <Divider sx={{ my: 3 }} />
            <Typography sx={sectionTitleSx}>Location</Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={4}>
                {textField("city", "City")}
              </Grid>
              <Grid item xs={12} sm={4}>
                {textField("province", "Province / State")}
              </Grid>
              <Grid item xs={12} sm={4}>
                {textField("country", "Country")}
              </Grid>
            </Grid>

            <Divider sx={{ my: 3 }} />
            <Typography sx={sectionTitleSx}>About you</Typography>
            {textField("description", "Bio", {
              multiline: true,
              minRows: 4,
              placeholder:
                "e.g. Mom of a picky 2-year-old who loves veggie muffins",
              inputProps: { maxLength: DESCRIPTION_MAX },
              helperText: `${form.description.length}/${DESCRIPTION_MAX}`,
              FormHelperTextProps: { sx: { textAlign: "right" } },
            })}

            <Stack
              direction={{ xs: "column-reverse", sm: "row" }}
              spacing={1.5}
              justifyContent="flex-end"
              alignItems={{ sm: "center" }}
              mt={4}
            >
              {isDirty && (
                <Button
                  onClick={() => setForm(saved)}
                  disabled={saving}
                  sx={{ ...pillButtonSx, color: "primary.main" }}
                >
                  Discard changes
                </Button>
              )}
              <Button
                type="submit"
                disabled={!isDirty || !!nameError || saving}
                sx={accentButtonSx}
              >
                {saving
                  ? "Saving…"
                  : isDirty
                    ? "Save Changes"
                    : "All changes saved"}
              </Button>
            </Stack>
          </Box>
        </Grid>
      </Grid>

      <AvatarCropDialog
        imageSrc={cropSrc}
        open={!!cropSrc}
        onCancel={closeCrop}
        onCropped={handleCropped}
      />
    </Container>
  );
}

export default UserProfile;
