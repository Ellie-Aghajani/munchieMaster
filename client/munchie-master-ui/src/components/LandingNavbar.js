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
  Divider,
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import MenuIcon from "@mui/icons-material/Menu";
import ColorModeToggle from "./ColorModeToggle";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import LanguageToggle from "./LanguageToggle";

const navLinks = [
  { labelKey: "nav.aboutMe", href: "#about-us" },
  { labelKey: "nav.howItWorks", href: "#how-it-works" },
];

const LandingNavbar = () => {
  const { t } = useTranslation();
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
                {t(link.labelKey)}
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
              {t("nav.join")}
            </Button>
          </Box>

          <IconButton
            edge="end"
            color="inherit"
            aria-label={t("nav.menu")}
            sx={{ display: { xs: "inline-flex", md: "none" } }}
            onClick={toggleDrawer(true)}
          >
            <MenuIcon />
          </IconButton>
        </Toolbar>
      </Container>

      {/* Drawer for menu items */}
      <Drawer
        anchor="right"
        open={isDrawerOpen}
        onClose={toggleDrawer(false)}
        PaperProps={{
          sx: {
            width: 280,
            backgroundColor: "primary.main",
            color: "common.white",
          },
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, p: 3 }}>
          <Box
            component="img"
            src={process.env.PUBLIC_URL + "/images/logo.png"}
            alt={t("brandLogoAlt")}
            sx={{ height: 40 }}
          />
          <Typography sx={{ fontSize: "1.25rem" }}>{t("brand")}</Typography>
        </Box>
        <Divider
          sx={{
            borderColor: (theme) => alpha(theme.palette.common.white, 0.15),
          }}
        />
        <List sx={{ pt: 2 }}>
          {navLinks.map((link) => (
            <ListItemButton
              key={link.href}
              component="a"
              href={link.href}
              onClick={toggleDrawer(false)}
              sx={{
                mx: 1.5,
                mb: 0.5,
                px: 2,
                py: 1.25,
                borderRadius: 2,
                "&:hover": {
                  backgroundColor: (theme) =>
                    alpha(theme.palette.common.white, 0.08),
                },
              }}
            >
              <ListItemText
                primary={t(link.labelKey)}
                primaryTypographyProps={{ fontSize: "1.05rem" }}
              />
            </ListItemButton>
          ))}
        </List>
        <Box sx={{ px: 3, pt: 2 }}>
          <Button
            fullWidth
            component={Link}
            to="/signup"
            onClick={toggleDrawer(false)}
            sx={{
              py: 1.25,
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
            {t("nav.join")}
          </Button>
        </Box>
      </Drawer>
    </AppBar>
  );
};

export default LandingNavbar;
