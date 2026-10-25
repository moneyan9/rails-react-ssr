import { startTransition, StrictMode } from "react";
import { hydrateRoot } from "react-dom/client";
import { HydratedRouter } from "react-router/dom";
import { CacheProvider } from "@emotion/react";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";

import { createEmotionCache } from "./emotion-cache";
import { theme } from "./theme";

startTransition(() => {
  const cache = createEmotionCache();

  hydrateRoot(
    document,
    <StrictMode>
      <CacheProvider value={cache}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <HydratedRouter />
        </ThemeProvider>
      </CacheProvider>
    </StrictMode>,
  );
});
