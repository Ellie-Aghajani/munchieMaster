import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  Container,
  Typography,
  Button,
  Box,
  IconButton,
  Drawer,
  List,
  ListItemButton,
  ListItemText,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { Link } from "react-router-dom";

const navLinks = [
  { label: "About Me", href: "#about-us" },
  { label: "How it Works", href: "#how-it-works" },
];

const LandingNavbar = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const toggleDrawer = (open) => () => {
    setIsDrawerOpen(open);
  };
  return (
    <AppBar position="static" color="primary" elevation={0}>
      <Container maxWidth="lg">
        <Toolbar disableGutters sx={{ minHeight: { xs: 64, md: 76 } }}>
          <Box
            component={Link}
            to="/"
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1.5,
              color: "inherit",
              textDecoration: "none",
              flexGrow: 1,
            }}
          >
            <Box
              component="img"
              src={process.env.PUBLIC_URL + "/images/logo.png"}
              alt="MunchieMaster Logo"
              sx={{ height: { xs: 40, md: 48 } }}
            />
            <Typography
              component="span"
              sx={{ fontSize: { xs: "1.25rem", md: "1.5rem" } }}
            >
              Munchie Master
            </Typography>
          </Box>

          {/* Regular buttons for large screens */}
          <Box
            sx={{
              display: { xs: "none", md: "flex" },
              alignItems: "center",
              gap: 1,
            }}
          >
            {navLinks.map((link) => (
              <Button
                key={link.href}
                color="inherit"
                href={link.href}
                sx={{ fontSize: "1rem", textTransform: "none", px: 2 }}
              >
                {link.label}
              </Button>
            ))}
            <Button
              component={Link}
              to="/signup"
              sx={{
                ml: 2,
                px: 3,
                borderRadius: 999,
                fontSize: "1rem",
                textTransform: "none",
                color: "accent.contrastText",
                backgroundColor: "accent.main",
                "&:hover": {
                  backgroundColor: "accent.dark",
                },
              }}
            >
              Join Munchie Family
            </Button>
          </Box>

          <IconButton
            edge="end"
            color="inherit"
            aria-label="menu"
            sx={{ display: { xs: "inline-flex", md: "none" } }}
            onClick={toggleDrawer(true)}
          >
            <MenuIcon />
          </IconButton>
        </Toolbar>
      </Container>

      {/* Drawer for menu items */}
      <Drawer anchor="right" open={isDrawerOpen} onClose={toggleDrawer(false)}>
        <List sx={{ width: 240 }}>
          {navLinks.map((link) => (
            <ListItemButton
              key={link.href}
              component="a"
              href={link.href}
              onClick={toggleDrawer(false)}
            >
              <ListItemText primary={link.label} />
            </ListItemButton>
          ))}
          <ListItemButton
            component={Link}
            to="/signup"
            onClick={toggleDrawer(false)}
          >
            <ListItemText primary="Join Munchie Family" />
          </ListItemButton>
        </List>
      </Drawer>
    </AppBar>
  );
};

export default LandingNavbar;
