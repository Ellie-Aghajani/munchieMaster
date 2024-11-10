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
  IconButton,
} from "@mui/material";
import { useError } from "../contexts/ErrorContext";
import AddAPhotoIcon from "@mui/icons-material/AddAPhoto";
import DeleteIcon from "@mui/icons-material/Delete";
import config from "../config";

function UserProfile() {
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    country: "",
    province: "",
    city: "",
    description: "",
  });
  const { showError } = useError();

  // Fetch user data on component mount
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userResponse = await axios.get(
          `${config.serverUrl}/api/users/me`,
          {
            headers: {
              "x-auth-token": localStorage.getItem("token"),
            },
          }
        );
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
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const data = new FormData();
      data.append("avatar", file);
      try {
        const response = await axios.put(
          `${config.serverUrl}/api/users/avatar`,
          data,
          {
            headers: {
              "x-auth-token": localStorage.getItem("token"),
              "Content-Type": "multipart/form-data",
            },
          }
        );
        setUser(response.data.user); // Update user state with the new avatar
      } catch (error) {
        showError("Failed to update avatar");
      }
    }
  };

  const handleDeleteAvatar = async () => {
    try {
      const response = await axios.delete(
        `${config.serverUrl}/api/users/avatar`,
        {
          headers: {
            "x-auth-token": localStorage.getItem("token"),
          },
        }
      );
      setUser(response.data.user); // Update user state without the avatar
    } catch (error) {
      showError("Failed to delete avatar");
    }
  };

  // Update profile data in the database and re-fetch updated user data
  const handleUpdateProfile = async () => {
    try {
      await axios.put(`${config.serverUrl}/api/users/me`, formData, {
        headers: {
          "x-auth-token": localStorage.getItem("token"),
        },
      });
      // Re-fetch updated user data
      const updatedUserResponse = await axios.get(
        `${config.serverUrl}/api/users/me`,
        {
          headers: {
            "x-auth-token": localStorage.getItem("token"),
          },
        }
      );
      setUser(updatedUserResponse.data); // Update user state with fetched data
    } catch (error) {
      showError("Failed to update user data");
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      {/* Live Preview Section */}
      <Box display="flex" alignItems="center" mb={4}>
        <Box>
          <Avatar
            sx={{ width: 100, height: 100, mr: 2 }}
            src={
              user?.avatar
                ? `${config.serverUrl}/uploads/${user.avatar.replace(
                    /^\/?uploads\/?/,
                    ""
                  )}`
                : ""
            }
            alt={`${formData.firstName} ${formData.lastName}`}
          >
            {(formData.firstName[0] || "") + (formData.lastName[0] || "")}
          </Avatar>
          <Box>
            <IconButton component="label">
              <AddAPhotoIcon />
              <input type="file" hidden onChange={handleImageChange} />
            </IconButton>
            <IconButton onClick={handleDeleteAvatar}>
              <DeleteIcon />
            </IconButton>
          </Box>
        </Box>
        <Box ml={2}>
          <Typography variant="h5">
            {user?.firstName} {user?.lastName}
          </Typography>
          <Typography variant="body1">
            {user?.city}, {user?.province}, {user?.country}
          </Typography>
          <Typography variant="body2" mt={1}>
            {user?.description}
          </Typography>
        </Box>
      </Box>

      {/* Edit Profile Section */}
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
        <Grid item xs={12} textAlign="right">
          <Button
            variant="contained"
            color="primary"
            onClick={handleUpdateProfile}
          >
            Update Profile
          </Button>
        </Grid>
      </Grid>
    </Container>
  );
}

export default UserProfile;
