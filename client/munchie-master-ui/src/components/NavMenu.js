import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { AppBar, Toolbar, Typography, Button, Box } from "@mui/material";
import isEmpty from "lodash/isEmpty";

const NavMenu = () => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  const onLoginClick = () => {
    logout();
    navigate("login");
  };

  return (
    <AppBar position="static">
      <Toolbar>
        <Box sx={{ display: "flex", alignItems: "center" }}>
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
              flexGrow: 1,
              textDecoration: "none",
              color: "inherit",
              display: "flex",
              alignItems: "center",
            }}
          >
            MUNCHIE MASTER
          </Typography>
        </Box>
        {!isEmpty(currentUser) ? (
          <>
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
        ) : null}
      </Toolbar>
    </AppBar>
  );
};
export default NavMenu;
