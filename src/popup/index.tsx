import React from "react";
import { createRoot } from "react-dom/client";
import Popup from "./Popup";
import { createTheme, CssBaseline, ThemeProvider } from "@mui/material";

const theme = createTheme({
  colorSchemes: {
    dark: true,
  },
});

createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Popup />
    </ThemeProvider>
  </React.StrictMode>,
);
