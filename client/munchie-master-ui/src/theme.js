import { createTheme } from "@mui/material/styles";

// Page background and the text that sits directly on it, per color mode.
// Cards keep their own colors in both modes.
const pageColors = {
  light: { background: "#EBBA45", text: "#10375C" },
  dark: { background: "#0b3057", text: "#FFFFFF" },
};

export const createAppTheme = (mode = "light") =>
  createTheme({
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
        default: pageColors[mode].background, // Page background
      },
      // Text, icons and outlined buttons placed directly on the page background
      page: {
        mode,
        text: pageColors[mode].text,
      },
      text: {
        heading: "#2C3E50",
      },
      tiles: {
        aqua: "#8FD0D9", // About us
        sky: "#61ADEA", // How it works
        cream: "#FFF8E7", // Dashboard summary, recipes header, edit profile
        green: "#488943", // Saved recipes
        rose: "#f77547", // Liked recipes
        blue: "#27a1c3", // Bought recipes
        lavender: "#f4a032", // My recipes
        contrastText: "#FFFFFF", // Light text on the colored dashboard tiles
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
