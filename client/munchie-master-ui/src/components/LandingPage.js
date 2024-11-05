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
            src="/images/logo.png"
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
            Munchie Master helps you find recipes based on your available
            ingredients, offering both free and featured recipes. Free recipes
            include images and easy instructions, while featured ones, shared by
            other parents, provide detailed steps and a comment section for
            questions and advice. New users receive 10 coins at sign-up, and you
            can earn more by sharing your recipes. When others buy them, you
            gain coins to access more content.
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
