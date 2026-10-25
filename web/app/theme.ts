import { createTheme } from "@mui/material/styles";

export const theme = createTheme({
  palette: {
    primary: { main: "#1f4b3a" },
  },
  typography: {
    fontFamily: ["Inter", "sans-serif"].join(","),
  },
});
