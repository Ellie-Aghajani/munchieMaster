import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { AppBar, Toolbar, Typography, Button } from "@mui/material";
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
        <Typography
          variant="h6"
          component={Link}
          to="/"
          style={{ flexGrow: 1, textDecoration: "none", color: "inherit" }}
        >
          MunchieMaster
        </Typography>
        {!isEmpty(currentUser) ? (
          <>
            <Button color="inherit" component={Link} to="/recipes">
              Recipes
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
