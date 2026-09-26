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
                color: "primary.main",
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
                    "&:hover": { borderWidth: 2 },
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
                Hi, I’m Ellie—a web developer and mom to a toddler. As a
                first-time mom, I found it challenging to find reliable
                resources for toddler recipes and a supportive platform to ask
                questions. This inspired me to create Munchie Master, a space
                where moms can connect, share their favorite recipes, discuss
                their experiences, and offer each other valuable tips. Join our
                community and make mealtime easier and more enjoyable for you
                and your little ones!
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
              <Typography sx={sectionBodySx}>
                Munchie Master helps you find recipes based on your available
                ingredients, offering both free and featured recipes. Free
                recipes include images and easy instructions, while featured
                ones, shared by other parents, provide detailed steps and a
                comment section for questions and advice. New users receive 10
                coins at sign-up, and you can earn more by sharing your recipes.
                When others buy them, you gain coins to access more content.
              </Typography>
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
          color: "primary.main",
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
