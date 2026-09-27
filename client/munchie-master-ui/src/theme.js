import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: {
      main: "#10375C", // Navbar color
    },
    secondary: {
      main: "#009688", // Any complementary color
    },
    accent: {
      main: "#F56759", // Call-to-action buttons
      dark: "#FF8225", // Call-to-action hover
      contrastText: "#FFFFFF",
    },
    background: {
      default: "#EBBA45", // Page background for every page
    },
    text: {
      heading: "#2C3E50",
    },
    tiles: {
      aqua: "#8FD0D9", // About us
      sky: "#61ADEA", // How it works
      cream: "#FFF8E7", // Dashboard summary, recipes header, edit profile
      green: "#D5F0DC", // Saved recipes
      rose: "#FFD9D2", // Liked recipes
      blue: "#D6E9FA", // Bought recipes
      lavender: "#E6DFF7", // My recipes
    },
  },
  customShadows: {
    raised:
      "rgba(50, 50, 93, 0.25) 0px 50px 100px -20px, rgba(0, 0, 0, 0.3) 0px 30px 60px -30px, rgba(10, 37, 64, 0.35) 0px -2px 6px 0px inset",
    soft: "0 4px 6px rgba(0, 0, 0, 0.1)",
    text: "2px 2px 4px rgba(0, 0, 0, 0.1)",
  },
  typography: {
    fontFamily: "'Itim', cursive",
  },
});

export default theme;
