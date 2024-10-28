import React from "react";
import {
  Box,
  Container,
  Typography,
  Button,
  AppBar,
  Toolbar,
} from "@mui/material";
import { Link } from "react-router-dom";

const LandingPage = () => {
  return (
    <Box>
      {/* Navbar */}
      <AppBar position="static" color="primary">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            MunchieMaster
          </Typography>
          <Button color="inherit" component={Link} to="/about">
            About Us
          </Button>
          <Button color="inherit" component={Link} to="/how-it-works">
            How it Works
          </Button>
          <Button color="inherit" component={Link} to="/contact">
            Contact Us
          </Button>
          <Button color="inherit" component={Link} to="/signup">
            Join Munchie Family
          </Button>
        </Toolbar>
      </AppBar>

      {/* Hero Section */}
      <Box
        sx={{
          backgroundImage: "url(/images/IMG_4404.JPEG)",
          backgroundSize: "cover",
          backgroundPosition: "center",
          minHeight: "70vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
          color: "white",
          textAlign: "center",
        }}
      >
        <Typography variant="h2" gutterBottom>
          Munchie Master
        </Typography>
        <Button
          variant="contained"
          color="secondary"
          component={Link}
          to="/signup"
        >
          Join Us
        </Button>
      </Box>

      {/* About Us Section */}
      <Container sx={{ py: 4 }}>
        <Typography variant="h4" gutterBottom>
          About Us
        </Typography>
        <Typography>
          Munchie Master is a community for parents and caregivers looking for
          healthy, fun recipes for toddlers.
        </Typography>
      </Container>

      {/* How It Works Section */}
      <Container sx={{ py: 4, bgcolor: "#f9f9f9" }}>
        <Typography variant="h4" gutterBottom>
          How it Works
        </Typography>
        <Typography>
          Browse, save, and share recipes. Connect with other caregivers and
          contribute to our growing library of toddler recipes.
        </Typography>
      </Container>

      {/* Why Join Us Section */}
      <Container sx={{ py: 4 }}>
        <Typography variant="h4" gutterBottom>
          Why Join Us?
        </Typography>
        <Typography>
          Join MunchieMaster to gain access to a variety of recipes tailored to
          the needs of young children.
        </Typography>
      </Container>

      {/* Happy Munchie Family Section */}
      <Container sx={{ py: 4, bgcolor: "#f9f9f9" }}>
        <Typography variant="h4" gutterBottom>
          Happy Munchie Family
        </Typography>
        <Typography>
          Hear from our users about how MunchieMaster has helped them make meal
          times more enjoyable.
        </Typography>
      </Container>

      {/* Footer */}
      <Box
        sx={{
          py: 2,
          bgcolor: "primary.main",
          color: "white",
          textAlign: "center",
        }}
      >
        <Typography variant="body2">
          &copy; {new Date().getFullYear()} MunchieMaster. All rights reserved.
        </Typography>
      </Box>
    </Box>
  );
};

export default LandingPage;
