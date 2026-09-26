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
      panel: "#F0F8FF", // Recipes page header
      subtle: "#F8F8F8", // Recipe directions box
    },
    text: {
      heading: "#2C3E50",
    },
    tiles: {
      aqua: "#8FD0D9", // About us, edit profile
      sky: "#61ADEA", // How it works
      yellow: "#fcfcfa", // Dashboard summary
      lime: "#719332", // Saved recipes
      pink: "#a5386f", // Liked recipes
      mint: "#1e9170", // Bought recipes
      cyan: "#15717a", // My recipes
    },
    scrollbar: {
      track: "#F1F1F1",
      thumb: "#888888",
      thumbHover: "#555555",
    },
    carousel: {
      active: "#F46200", // Arrows and active dot
      dot: "#697455",
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
