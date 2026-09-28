import React from "react";
import LandingNavbar from "./LandingNavbar";
import { Box, Container, Grid, Stack, Typography, Button } from "@mui/material";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { formatNumber, formatSigned } from "../i18n/format";

const ctaButtonSx = {
  width: { xs: "100%", sm: "auto" },
  maxWidth: 320,
  backgroundColor: "accent.main",
  color: "accent.contrastText",
  borderRadius: 999,
  px: 4,
  py: 1.5,
  fontSize: "1.1rem",
  textTransform: "none",
  "&:hover": {
    backgroundColor: "accent.dark",
  },
};

const sectionCardSx = {
  height: "100%",
  boxSizing: "border-box",
  p: { xs: 3, md: 5 },
  borderRadius: 4,
  color: "primary.main",
  boxShadow: (theme) => theme.customShadows.raised,
};

const sectionHeadingSx = {
  fontSize: { xs: "1.75rem", md: "2.25rem" },
  mb: 2,
};

// Keep in sync with server/utils/coinRules.js
const coinRules = [
  { amount: 10, key: "welcome" },
  { amount: 5, key: "share" },
  { amount: 1, key: "like" },
  { amount: 2, key: "save" },
  { amount: 5, key: "unlocked" },
  { amount: -5, key: "unlock" },
];

const sectionBodySx = {
  fontSize: { xs: "1rem", md: "1.125rem" },
  lineHeight: 1.7,
};

const LandingPage = () => {
  const { t, i18n } = useTranslation();
  const aboutParagraphs = t("landing.about", { returnObjects: true });

  return (
    <Box>
      <LandingNavbar />

      {/* Hero Section */}
      <Container maxWidth="lg" sx={{ py: { xs: 6, md: 10 } }}>
        <Grid container spacing={{ xs: 4, md: 8 }} alignItems="center">
          <Grid item xs={12} md={7}>
            <Box
              sx={{
                textAlign: { xs: "center", md: "left" },
                color: "page.text",
              }}
            >
              <Typography
                variant="h1"
                sx={{
                  fontSize: { xs: "2.5rem", sm: "3.25rem", md: "4rem" },
                  lineHeight: 1.1,
                  mb: 2,
                }}
              >
                {t("landing.heroTitle")}
              </Typography>
              <Typography
                variant="h2"
                sx={{
                  fontSize: { xs: "1.25rem", sm: "1.5rem", md: "1.75rem" },
                  lineHeight: 1.4,
                  mb: 4,
                  maxWidth: { md: 520 },
                }}
              >
                {t("landing.heroSubtitle")}
              </Typography>
              <Stack
                direction={{ xs: "column", sm: "row" }}
                spacing={2}
                justifyContent={{ xs: "center", md: "flex-start" }}
                alignItems="center"
              >
                <Button
                  variant="contained"
                  component={Link}
                  to="/signup"
                  sx={ctaButtonSx}
                >
                  {t("nav.join")}
                </Button>
                <Button
                  variant="outlined"
                  href="#how-it-works"
                  sx={{
                    width: { xs: "100%", sm: "auto" },
                    maxWidth: 320,
                    borderRadius: 999,
                    px: 4,
                    py: 1.5,
                    fontSize: "1.1rem",
                    textTransform: "none",
                    borderWidth: 2,
                    color: "page.text",
                    borderColor: "page.text",
                    "&:hover": { borderWidth: 2, borderColor: "page.text" },
                  }}
                >
                  {t("nav.howItWorks")}
                </Button>
              </Stack>
            </Box>
          </Grid>

          <Grid item xs={12} md={5}>
            <Box
              component="img"
              src="/images/logo.png"
              alt={t("landing.logoAlt")}
              sx={{
                display: "block",
                width: "100%",
                maxWidth: { xs: 280, sm: 360, md: 440 },
                height: "auto",
                mx: "auto",
              }}
            />
          </Grid>
        </Grid>
      </Container>

      {/* "About Me" and "How It Works" sections */}
      <Container maxWidth="lg" sx={{ pb: { xs: 6, md: 10 } }}>
        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <Box
              id="about-us"
              sx={{ ...sectionCardSx, backgroundColor: "tiles.aqua" }}
            >
              <Typography variant="h3" sx={sectionHeadingSx}>
                {t("landing.aboutTitle")}
              </Typography>
              <Typography sx={sectionBodySx}>
                {aboutParagraphs.map((paragraph, index) => (
                  <React.Fragment key={index}>
                    {index > 0 && <br />}
                    {paragraph}
                  </React.Fragment>
                ))}
              </Typography>
            </Box>
          </Grid>

          <Grid item xs={12} md={6}>
            <Box
              id="how-it-works"
              sx={{ ...sectionCardSx, backgroundColor: "tiles.sky" }}
            >
              <Typography variant="h3" sx={sectionHeadingSx}>
                {t("landing.howTitle")}
              </Typography>
              <Typography sx={{ ...sectionBodySx, mb: 2.5 }}>
                {t("landing.howIntro")}
              </Typography>
              <Stack
                component="ul"
                spacing={1.5}
                sx={{ listStyle: "none", p: 0, m: 0 }}
              >
                {coinRules.map((rule) => (
                  <Stack
                    component="li"
                    key={rule.key}
                    direction="row"
                    spacing={1.5}
                    alignItems="center"
                  >
                    <Box
                      sx={{
                        flexShrink: 0,
                        minWidth: 64,
                        px: 1,
                        py: 0.5,
                        borderRadius: 999,
                        border: "1px solid",
                        borderColor: "primary.main",
                        textAlign: "center",
                        typography: "body1",
                        fontSize: "0.95rem",
                      }}
                      dir="ltr" // Keep the sign before the number in Persian
                    >
                      {formatSigned(rule.amount, i18n.language)}
                    </Box>
                    <Typography sx={sectionBodySx}>
                      {t(`landing.rules.${rule.key}`)}
                    </Typography>
                  </Stack>
                ))}
              </Stack>
            </Box>
          </Grid>
        </Grid>
      </Container>

      {/* Closing call to action */}
      <Container
        maxWidth="md"
        sx={{
          pb: { xs: 8, md: 12 },
          textAlign: "center",
          color: "page.text",
        }}
      >
        <Typography
          variant="h2"
          sx={{ fontSize: { xs: "1.75rem", md: "2.5rem" }, mb: 3 }}
        >
          {t("landing.ctaTitle")}
        </Typography>
        <Button
          variant="contained"
          component={Link}
          to="/signup"
          sx={ctaButtonSx}
        >
          {t("nav.join")}
        </Button>
      </Container>

      {/* Footer */}
      <Box
        sx={{
          py: 3,
          bgcolor: "primary.main",
          color: "common.white",
          textAlign: "center",
        }}
      >
        <Typography variant="body2">
          {t("landing.footer", {
            year: formatNumber(new Date().getFullYear(), i18n.language, {
              useGrouping: false,
            }),
          })}
        </Typography>
      </Box>
    </Box>
  );
};

export default LandingPage;
