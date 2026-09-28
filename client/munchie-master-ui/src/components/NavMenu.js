import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
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
  ListItemIcon,
  ListItemText,
  Divider,
  Chip,
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import MenuIcon from "@mui/icons-material/Menu";
import ColorModeToggle from "./ColorModeToggle";
import DashboardIcon from "@mui/icons-material/Dashboard";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import LogoutIcon from "@mui/icons-material/Logout";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
import isEmpty from "lodash/isEmpty";
import { useTranslation } from "react-i18next";
import LanguageToggle from "./LanguageToggle";

const NavMenu = () => {
  const { t } = useTranslation();
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const isLoggedIn = !isEmpty(currentUser);
  const homePath = isLoggedIn ? "/dashboard" : "/";
  const [mobileOpen, setMobileOpen] = useState(false);

  const onLoginClick = () => {
    logout();
    navigate("/login");
  };

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const sidebarLinks = [
    { label: t("nav.dashboard"), to: "/dashboard", icon: <DashboardIcon /> },
    { label: t("nav.recipes"), to: "/recipes", icon: <MenuBookIcon /> },
    {
      label: t("nav.shareRecipe"),
      to: "/recipes/new",
      icon: <AddCircleOutlineIcon />,
    },
  ];

  const coinChip = (
    <Chip
      component={Link}
      to="/dashboard"
      clickable
      icon={<MonetizationOnIcon />}
      label={t("coins", { count: currentUser?.coins ?? 0 })}
      sx={{
        fontSize: "0.95rem",
        color: "common.white",
        backgroundColor: (theme) => alpha(theme.palette.common.white, 0.12),
        "& .MuiChip-icon": { color: "inherit" },
        "&:hover": {
          backgroundColor: (theme) => alpha(theme.palette.common.white, 0.2),
        },
      }}
    />
  );

  const sidebarItemSx = {
    mx: 1.5,
    mb: 0.5,
    px: 2,
    py: 1.25,
    borderRadius: 2,
    "&:hover": {
      backgroundColor: (theme) => alpha(theme.palette.common.white, 0.08),
    },
    "&.Mui-selected, &.Mui-selected:hover": {
      backgroundColor: "accent.main",
      color: "accent.contrastText",
    },
  };

  const drawer = (
    <Box
      onClick={handleDrawerToggle}
      sx={{ display: "flex", flexDirection: "column", height: "100%" }}
    >
      <Box
        component={Link}
        to={homePath}
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1.5,
          px: 3,
          py: 3,
          color: "inherit",
          textDecoration: "none",
        }}
      >
        <Box
          component="img"
          src={process.env.PUBLIC_URL + "/images/logo.png"}
          alt={t("brandLogoAlt")}
          sx={{ height: 40 }}
        />
        <Typography sx={{ fontSize: "1.25rem" }}>{t("brand")}</Typography>
      </Box>
      {isLoggedIn && <Box sx={{ px: 3, pb: 2 }}>{coinChip}</Box>}
      <Divider
        sx={{ borderColor: (theme) => alpha(theme.palette.common.white, 0.15) }}
      />
      <List sx={{ pt: 2 }}>
        {sidebarLinks.map((link) => (
          <ListItemButton
            key={link.to}
            component={Link}
            to={link.to}
            selected={location.pathname === link.to}
            sx={sidebarItemSx}
          >
            <ListItemIcon sx={{ color: "inherit", minWidth: 40 }}>
              {link.icon}
            </ListItemIcon>
            <ListItemText
              primary={link.label}
              primaryTypographyProps={{ fontSize: "1.05rem" }}
            />
          </ListItemButton>
        ))}
      </List>
      <Box sx={{ mt: "auto", pb: 2 }}>
        <Divider
          sx={{
            mb: 2,
            borderColor: (theme) => alpha(theme.palette.common.white, 0.15),
          }}
        />
        <ListItemButton onClick={onLoginClick} sx={sidebarItemSx}>
          <ListItemIcon sx={{ color: "inherit", minWidth: 40 }}>
            <LogoutIcon />
          </ListItemIcon>
          <ListItemText
            primary={t("nav.logout")}
            primaryTypographyProps={{ fontSize: "1.05rem" }}
          />
        </ListItemButton>
      </Box>
    </Box>
  );

  return (
    <AppBar position="static" color="primary" elevation={0}>
      <Container maxWidth="lg">
        <Toolbar disableGutters sx={{ minHeight: { xs: 64, md: 76 } }}>
          <Box
            component={Link}
            to={homePath}
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
              alt={t("brandLogoAlt")}
              sx={{ height: { xs: 40, md: 48 } }}
            />
            <Typography
              component="span"
              sx={{ fontSize: { xs: "1.25rem", md: "1.5rem" } }}
            >
              {t("brand")}
            </Typography>
          </Box>

          <LanguageToggle />
          <ColorModeToggle sx={{ mr: { xs: 0.5, md: 1 } }} />
          {isLoggedIn && (
            <>
              {/* Desktop Menu */}
              <Box
                sx={{
                  display: { xs: "none", md: "flex" },
                  alignItems: "center",
                  gap: 1,
                }}
              >
                <Box sx={{ mr: 1 }}>{coinChip}</Box>
                {sidebarLinks.map((link) => (
                  <Button
                    key={link.to}
                    color="inherit"
                    component={Link}
                    to={link.to}
                    sx={{
                      fontSize: "1rem",
                      textTransform: "none",
                      px: 2,
                      borderRadius: 999,
                      backgroundColor:
                        location.pathname === link.to
                          ? (theme) => alpha(theme.palette.common.white, 0.12)
                          : "transparent",
                    }}
                  >
                    {link.label}
                  </Button>
                ))}
                <Button
                  onClick={onLoginClick}
                  variant="outlined"
                  color="inherit"
                  sx={{
                    ml: 2,
                    px: 3,
                    borderRadius: 999,
                    fontSize: "1rem",
                    textTransform: "none",
                  }}
                >
                  {t("nav.logout")}
                </Button>
              </Box>

              {/* Mobile Menu */}
              <IconButton
                edge="end"
                color="inherit"
                aria-label={t("nav.menu")}
                sx={{ display: { xs: "inline-flex", md: "none" } }}
                onClick={handleDrawerToggle}
              >
                <MenuIcon />
              </IconButton>
            </>
          )}
        </Toolbar>
      </Container>

      <Drawer
        anchor="right"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true, // Better open performance on mobile
        }}
        PaperProps={{
          sx: {
            width: 280,
            backgroundColor: "primary.main",
            color: "common.white",
          },
        }}
      >
        {drawer}
      </Drawer>
    </AppBar>
  );
};

export default NavMenu;
