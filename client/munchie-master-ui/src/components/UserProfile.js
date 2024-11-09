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
} from "@mui/material";
import { useError } from "../contexts/ErrorContext";
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

  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      {/* Live Preview Section */}
      <Box display="flex" alignItems="center" mb={4}>
        <Avatar sx={{ width: 100, height: 100, mr: 2 }} src={user?.avatar} />
        <Box>
          <Typography variant="h5">
            {formData.firstName} {formData.lastName}
          </Typography>
          <Typography variant="body1">
            {formData.city}, {formData.province}, {formData.country}
          </Typography>
          <Typography variant="body2" mt={1}>
            {formData.description}
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
      </Grid>
    </Container>
  );
}

export default UserProfile;
