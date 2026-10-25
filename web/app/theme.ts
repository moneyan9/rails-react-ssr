import { createTheme } from "@mui/material/styles";

export const theme = createTheme({
  palette: {
    primary: { main: "#1f4b3a" },
  },
  typography: {
    fontFamily: ["Inter", "sans-serif"].join(","),
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        html: {
          backgroundColor: "#fff",
          colorScheme: "light",
        },
        body: {
          minHeight: "100vh",
          backgroundColor: "#fff",
          color: "rgba(0, 0, 0, 0.87)",
        },
      },
    },
  },
});
