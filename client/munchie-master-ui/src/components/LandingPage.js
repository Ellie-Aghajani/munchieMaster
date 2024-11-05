import React from "react";
import LandingNavbar from "./LandingNavbar";
import {
  Box,
  //   Container,
  Typography,
  Button,
  //   AppBar,
  //   Toolbar,
} from "@mui/material";
// import { Link } from "react-router-dom";

const LandingPage = () => {
  return (
    <Box>
      <LandingNavbar />

      {/* Hero Section */}
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          alignItems: "center",
          justifyContent: "space-between",
          padding: "2rem",
          backgroundColor: "#EBBA45",
        }}
      >
        {/* Left-hand div for text */}
        <Box
          sx={{
            flex: 1,
            textAlign: { xs: "center", md: "left" },
            mb: { xs: "1rem", md: 0 },
          }}
        >
          <Typography
            variant="h2"
            gutterBottom
            sx={{
              fontSize: { xs: "2rem", sm: "3rem", md: "4rem" },
              textAlign: "center",
              fontWeight: "bold",
              color: "#FF8225",

              textShadow: `
                -1px -1px 0 #fff,
                1px -1px 0 #10375C,
                -1px 1px 0 #10375C,
                1px 1px 0 #10375C
              `,
            }}
          >
            MUNCHIE MASTER
          </Typography>
          <Typography
            variant="h5"
            sx={{
              fontSize: { xs: "1.5rem", sm: "2rem", md: "3rem" },
              textAlign: "center",
              color: "#10375C",
              textShadow: `
              -1px -1px 0 #fff`,
              //   1px -1px 0 #10375C,
              //   -1px 1px 0 #10375C,
              //   1px 1px 0 #10375C,
              //   -1px 0 0 #10375C`,
            }}
          >
            Easy Recipes for Happy Toddlers
          </Typography>
          <Box
            sx={{
              display: "flex",
              justifyContent: { xs: "center", md: "center" },
            }}
          >
            <Button
              variant="contained"
              sx={{
                mt: 2, // Margin top for spacing
                alignItems: "center",
                backgroundColor: "#f56759",
                color: "#fff",
                //     textShadow: `
                //   -1px -1px 0 #fff,
                //   1px -1px 0 #10375C,
                //   -1px 1px 0 #10375C,
                //   1px 1px 0 #10375C,
                //   -1px 0 0 #10375C`,
                "&:hover": {
                  backgroundColor: "#FF8225", // Slightly darker shade for hover effect
                },
              }}
              href="/signup"
            >
              Join Munchie Family
            </Button>
          </Box>
        </Box>

        {/* Right-hand div for bg */}
        <Box
          sx={{
            flex: 1,
            display: "flex",
            justifyContent: { xs: "center", md: "flex-end" },
          }}
        >
          <img
            src="/images/bg.jpeg"
            alt="Munchie Master Logo"
            style={{
              maxWidth: "100%",
              height: "auto",
              borderRadius: "15px",
              boxShadow:
                "rgba(50, 50, 93, 0.25) 0px 50px 100px -20px, rgba(0, 0, 0, 0.3) 0px 30px 60px -30px, rgba(10, 37, 64, 0.35) 0px -2px 6px 0px inset",
            }}
          />
        </Box>
      </Box>

      {/* Parent container for "About Me" and "How It Works" sections */}
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          gap: 4,
          backgroundColor: "#EBBA45",
          padding: "2rem",
        }}
      >
        {/* About Me Section */}
        <Box
          id="about-us"
          sx={{
            flex: 1,
            backgroundColor: "#8FD0D9",
            padding: "2rem",
            borderRadius: "15px",
            boxShadow:
              "rgba(50, 50, 93, 0.25) 0px 50px 100px -20px, rgba(0, 0, 0, 0.3) 0px 30px 60px -30px, rgba(10, 37, 64, 0.35) 0px -2px 6px 0px inset",
          }}
        >
          <Typography variant="h4" gutterBottom>
            About Me
          </Typography>
          <Typography>
            Hi, I’m Ellie—a web developer and mom to a toddler. As a first-time
            mom, I found it challenging to find reliable resources for toddler
            recipes and a supportive platform to ask questions. This inspired me
            to create Munchie Master, a space where moms can connect, share
            their favorite recipes, discuss their experiences, and offer each
            other valuable tips. Join our community and make mealtime easier and
            more enjoyable for you and your little ones!
          </Typography>
        </Box>

        <Box
          id="how-it-works"
          sx={{
            flex: 1,
            backgroundColor: "#61ADEA",
            padding: "2rem",
            borderRadius: "15px",
            boxShadow:
              "rgba(50, 50, 93, 0.25) 0px 50px 100px -20px, rgba(0, 0, 0, 0.3) 0px 30px 60px -30px, rgba(10, 37, 64, 0.35) 0px -2px 6px 0px inset",
          }}
        >
          <Typography variant="h4" gutterBottom>
            How it Works
          </Typography>
          <Typography>
            Here’s how Munchie Master works: Start by searching for recipes
            based on the ingredients you have on hand. The app will suggest two
            types of recipes: free recipes and featured recipes. Free recipes
            come with an image and clear instructions for preparation. Featured
            recipes are shared by fellow toddler parents and include detailed,
            step-by-step images and instructions. Each featured recipe also has
            a comment section, where you can ask questions, get advice from the
            creator, and share your thoughts. To get you started, we’ll welcome
            you with 10 coins in your wallet when you sign up. If you'd like to
            earn more coins, simply share your own recipes! When others buy your
            recipes, the coins are added to your wallet, allowing you to access
            even more featured content.
          </Typography>
        </Box>
      </Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: { xs: "center", md: "center" },
          gap: 4,
          backgroundColor: "#EBBA45",
          padding: "2rem",
        }}
      >
        <Button
          variant="contained"
          sx={{
            mt: 2, // Margin top for spacing
            alignItems: "center",
            backgroundColor: "#f56759",
            color: "#fff",
            // textShadow: `
            //   -1px -1px 0 #fff,
            //   1px -1px 0 #10375C,
            //   -1px 1px 0 #10375C,
            //   1px 1px 0 #10375C,
            //   -1px 0 0 #10375C`,
            "&:hover": {
              backgroundColor: "#FF8225", // Slightly darker shade for hover effect
            },
          }}
          href="/signup"
        >
          Join Munchie Family
        </Button>
      </Box>

      {/* Footer */}
      <Box
        sx={{
          py: 2,
          bgcolor: "primary.main",
          color: "white",
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
