import React from "react";
import LandingNavbar from "./LandingNavbar";
import { Box, Container, Grid, Stack, Typography, Button } from "@mui/material";
import { Link } from "react-router-dom";

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
  { amount: "+10", text: "Welcome coins when you join" },
  { amount: "+5", text: "For every recipe you share" },
  { amount: "+1", text: "For each like " },
  { amount: "+2", text: "For each save your recipes get" },
  { amount: "+5", text: "Each time someone unlocks your recipe" },
  { amount: "−5", text: "To unlock a recipe from another user" },
];

const sectionBodySx = {
  fontSize: { xs: "1rem", md: "1.125rem" },
  lineHeight: 1.7,
};

const LandingPage = () => {
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
                Make Mealtime Magic
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
                Munchie Master is where happy tummies and happy families meet!
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
                  Join Munchie Family
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
                  How it Works
                </Button>
              </Stack>
            </Box>
          </Grid>

          <Grid item xs={12} md={5}>
            <Box
              component="img"
              src="/images/logo.png"
              alt="Munchie Master Logo"
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
                About Me
              </Typography>
              <Typography sx={sectionBodySx}>
                Trying to eat healthy, stay fit, and keep up with work and
                everyday life? <br /> I know the struggle! I’m Ellie, a web
                developer, and I’ve found that one of the biggest challenges is
                simply figuring out what to eat when life gets busy. <br />{" "}
                Without a little meal prep, it’s so easy to reach for something
                quick and forget about those healthy goals. That’s why I created
                Munchie Master, a place to collect easy-to-prepare, nutritious,
                and healthy recipes. <br />
                Now, I’d love for you to be part of it! Share your favorite easy
                recipes, discover new meal ideas, and help us build a collection
                of simple, delicious, and nutritious meals that actually fit
                into our busy lives.
              </Typography>
            </Box>
          </Grid>

          <Grid item xs={12} md={6}>
            <Box
              id="how-it-works"
              sx={{ ...sectionCardSx, backgroundColor: "tiles.sky" }}
            >
              <Typography variant="h3" sx={sectionHeadingSx}>
                How it Works
              </Typography>
              <Typography sx={{ ...sectionBodySx, mb: 2.5 }}>
                Every Munchie Master recipe is free. Recipes shared by users
                cost coins to unlock, and you earn coins by sharing your own.
              </Typography>
              <Stack
                component="ul"
                spacing={1.5}
                sx={{ listStyle: "none", p: 0, m: 0 }}
              >
                {coinRules.map((rule) => (
                  <Stack
                    component="li"
                    key={rule.text}
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
                    >
                      {rule.amount}
                    </Box>
                    <Typography sx={sectionBodySx}>{rule.text}</Typography>
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
          Ready to make mealtime easier?
        </Typography>
        <Button
          variant="contained"
          component={Link}
          to="/signup"
          sx={ctaButtonSx}
        >
          Join Munchie Family
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
          &copy; {new Date().getFullYear()} MunchieMaster. All rights reserved.
        </Typography>
      </Box>
    </Box>
  );
};

export default LandingPage;
