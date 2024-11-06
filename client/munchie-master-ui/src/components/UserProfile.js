import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Container,
  Typography,
  Box,
  Grid,
  Avatar,
  Button,
  TextField,
  Input,
} from "@mui/material";
import { useError } from "../contexts/ErrorContext";
import config from "../config";

function UserProfile() {
  const [user, setUser] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    country: "",
    province: "",
    city: "",
    description: "",
    avatar: null, // For storing the selected file
  });
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
        setFormData({
          firstName: userResponse.data.firstName || "",
          lastName: userResponse.data.lastName || "",
          country: userResponse.data.country || "",
          province: userResponse.data.province || "",
          city: userResponse.data.city || "",
          description: userResponse.data.description || "",
        });
      } catch (error) {
        showError("Failed to fetch user data");
      }
    };

    fetchUserData();
  }, [showError]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({
        ...prev,
        avatar: file,
      }));
    }
  };

  const handleUpdateProfile = async () => {
    const data = new FormData();
    Object.keys(formData).forEach((key) => {
      data.append(key, formData[key]);
    });

    try {
      await axios.put("/api/users/me", data, {
        headers: {
          "x-auth-token": localStorage.getItem("token"),
          "Content-Type": "multipart/form-data",
        },
      });
      setEditMode(false);
      // Re-fetch user data after update
    } catch (error) {
      showError("Failed to update user data");
    }
  };

  if (!user) {
    return <Typography>Loading...</Typography>;
  }

  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      {/* Profile Info Section */}
      <Box sx={{ display: "flex", mb: 4, alignItems: "center" }}>
        <Avatar
          sx={{ width: 100, height: 100, mr: 2 }}
          src={user.avatar || ""}
          alt={user.name}
        >
          {user.name.charAt(0)}
        </Avatar>
        <Box>
          <Typography variant="h4">{user.name}</Typography>
          <Typography variant="subtitle1" color="text.secondary">
            {user.email}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {user.city}, {user.province}, {user.country}
          </Typography>
          <Typography variant="body2" mt={1}>
            {user.description}
          </Typography>
        </Box>
      </Box>

      {/* Edit Profile Section */}
      {editMode ? (
        <Box sx={{ p: 3, border: "1px solid #ccc", borderRadius: 2, mb: 4 }}>
          <Typography variant="h5" mb={2}>
            Edit Profile
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="First Name"
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Last Name"
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Country"
                name="country"
                value={formData.country}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Province"
                name="province"
                value={formData.province}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="City"
                name="city"
                value={formData.city}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={3}
                label="Description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={12}>
              <Button variant="contained" component="label">
                Upload Profile Picture
                <input type="file" hidden onChange={handleImageChange} />
              </Button>
              {formData.avatar && (
                <Typography variant="body2">{formData.avatar.name}</Typography>
              )}
            </Grid>
          </Grid>
          <Button
            variant="contained"
            color="primary"
            sx={{ mt: 2, float: "right" }}
            onClick={handleUpdateProfile}
          >
            Update Profile
          </Button>
        </Box>
      ) : (
        <Button variant="outlined" onClick={() => setEditMode(true)}>
          Edit Profile
        </Button>
      )}
    </Container>
  );
}

export default UserProfile;
