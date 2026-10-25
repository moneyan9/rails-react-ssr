import { reactRouter } from "@react-router/dev/vite";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [tailwindcss(), reactRouter()],
  resolve: {
    tsconfigPaths: true,
    dedupe: ["@emotion/react", "@emotion/styled", "@emotion/cache"],
  },
  ssr: {
    noExternal: [
      "@mui/material",
      "@mui/system",
      "@mui/utils",
      "@emotion/react",
      "@emotion/styled",
      "@emotion/cache",
      "@emotion/server",
    ],
  },
});
