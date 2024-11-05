import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: {
      main: "#10375C", // Navbar color
    },
    secondary: {
      main: "#009688", // Any complementary color
    },
    background: {
      default: "#F0C14B", // Background color
    },
  },
  typography: {
    fontFamily: "'Itim', cursive",
  },
});

export default theme;
