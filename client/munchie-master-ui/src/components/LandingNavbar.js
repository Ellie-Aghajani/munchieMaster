import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { Link } from "react-router-dom";

const LandingNavbar = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const toggleDrawer = (open) => () => {
    setIsDrawerOpen(open);
  };
  return (
    <AppBar position="static" color="primary">
      <Toolbar>
        <Box>
          <img
            src={process.env.PUBLIC_URL + "/images/logo.png"}
            alt="MunchieMaster Logo"
            style={{ height: "40px", marginRight: "10px" }}
          />
          {/* <Typography
            variant="h6"
            component="div"
            sx={{ flexGrow: 1, display: { xs: "none", md: "block" } }}
          >
            Munchie Master
          </Typography> */}
        </Box>
        <IconButton
          edge="start"
          color="inherit"
          aria-label="menu"
          sx={{ display: { xs: "block", md: "none" } }}
          onClick={toggleDrawer(true)}
        >
          <MenuIcon />
        </IconButton>

        {/* Drawer for menu items */}
        <Drawer
          anchor="right"
          open={isDrawerOpen}
          onClose={toggleDrawer(false)}
        >
          <List>
            <ListItem
              button
              component="a"
              href="#about-us"
              onClick={toggleDrawer(false)}
            >
              <ListItemText primary="About Me" />
            </ListItem>
            <ListItem
              button
              component="a"
              href="#how-it-works"
              onClick={toggleDrawer(false)}
            >
              <ListItemText primary="How it Works" />
            </ListItem>
            {/* <ListItem
              button
              component={Link}
              to="/contact"
              onClick={toggleDrawer(false)}
            >
              <ListItemText primary="Contact Us" />
            </ListItem> */}
            <ListItem
              button
              component={Link}
              to="/signup"
              onClick={toggleDrawer(false)}
            >
              <ListItemText primary="Join Munchie Family" />
            </ListItem>
          </List>
        </Drawer>

        {/* Regular buttons for large screens */}
        <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}>
          <Box sx={{ display: "flex", flexGrow: 1 }}>
            <Button
              color="inherit"
              component="a"
              href="#about-us"
              sx={{ display: { xs: "none", md: "inline-flex" } }}
            >
              About Me
            </Button>
            <Button
              color="inherit"
              component="a"
              href="#how-it-works"
              sx={{ display: { xs: "none", md: "inline-flex" } }}
            >
              How it Works
            </Button>
          </Box>
          {/* <Button
          color="inherit"
          component={Link}
          to="/contact"
          sx={{ display: { xs: "none", md: "inline-flex" } }}
        >
          Contact Us
        </Button> */}
          <Box>
            <Button
              color="inherit"
              component={Link}
              to="/signup"
              sx={{
                backgroundColor: "#f56759",
                "&:hover": {
                  backgroundColor: "#FF8225", // Slightly darker shade for hover effect
                },
                display: { xs: "none", md: "inline-flex" },
              }}
            >
              Join Munchie Family
            </Button>
          </Box>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default LandingNavbar;
