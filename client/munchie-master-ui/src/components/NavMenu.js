import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
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
  Divider,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import isEmpty from "lodash/isEmpty";

const NavMenu = () => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const onLoginClick = () => {
    logout();
    navigate("login");
  };

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const drawer = (
    <Box onClick={handleDrawerToggle} sx={{ textAlign: "center" }}>
      <Typography variant="h6" sx={{ my: 2 }}>
        MUNCHIE MASTER
      </Typography>
      <Divider />
      <List>
        <ListItem button component={Link} to="/dashboard">
          <ListItemText primary="Dashboard" />
        </ListItem>
        <ListItem button component={Link} to="/recipes">
          <ListItemText primary="Recipes" />
        </ListItem>
        <ListItem button component={Link} to="/profile">
          <ListItemText primary="Profile" />
        </ListItem>
        {currentUser?.isAdmin && (
          <ListItem button component={Link} to="/admin/create-recipe">
            <ListItemText primary="Create Recipe" />
          </ListItem>
        )}
        <ListItem button onClick={onLoginClick}>
          <ListItemText primary="Logout" />
        </ListItem>
      </List>
    </Box>
  );

  return (
    <AppBar position="static">
      <Toolbar>
        <Box sx={{ display: "flex", alignItems: "center", flexGrow: 1 }}>
          <img
            src={process.env.PUBLIC_URL + "/images/logo.png"}
            alt="MunchieMaster Logo"
            style={{ height: "40px", marginRight: "10px" }}
          />
          <Typography
            variant="h6"
            component={Link}
            to="/"
            style={{
              textDecoration: "none",
              color: "inherit",
              display: "flex",
              alignItems: "center",
            }}
          >
            MUNCHIE MASTER
          </Typography>
        </Box>

        {/* Desktop Menu */}
        <Box sx={{ display: { xs: "none", md: "flex" } }}>
          {!isEmpty(currentUser) && (
            <>
              <Button color="inherit" component={Link} to="/dashboard">
                Dashboard
              </Button>

              <Button color="inherit" component={Link} to="/recipes">
                Recipes
              </Button>
              <Button color="inherit" component={Link} to="/profile">
                Profile
              </Button>
              {currentUser.isAdmin && (
                <Button
                  color="inherit"
                  component={Link}
                  to="/admin/create-recipe"
                >
                  Create Recipe
                </Button>
              )}
              <Button color="inherit" onClick={onLoginClick}>
                Logout
              </Button>
            </>
          )}
        </Box>

        {/* Mobile Menu */}
        <Box sx={{ display: { xs: "flex", md: "none" } }}>
          <IconButton color="inherit" onClick={handleDrawerToggle}>
            <MenuIcon />
          </IconButton>
          <Drawer
            anchor="right"
            open={mobileOpen}
            onClose={handleDrawerToggle}
            ModalProps={{
              keepMounted: true, // Better open performance on mobile
            }}
          >
            {drawer}
          </Drawer>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default NavMenu;
