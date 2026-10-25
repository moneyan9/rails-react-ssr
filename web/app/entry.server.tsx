import { renderToString } from "react-dom/server";
import { ServerRouter, type EntryContext, type RouterContextProvider } from "react-router";
import createEmotionServer from "@emotion/server/create-instance";
import { CacheProvider } from "@emotion/react";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";

import { createEmotionCache } from "./emotion-cache";
import { theme } from "./theme";

export const streamTimeout = 5_000;

const insertionPoint =
  /<meta name="emotion-insertion-point" content="emotion-insertion-point"\s*\/?>/;

export default function handleRequest(
  request: Request,
  responseStatusCode: number,
  responseHeaders: Headers,
  routerContext: EntryContext,
  _loadContext: RouterContextProvider,
) {
  if (request.method.toUpperCase() === "HEAD") {
    return new Response(null, {
      status: responseStatusCode,
      headers: responseHeaders,
    });
  }

  const cache = createEmotionCache();
  const { extractCriticalToChunks } = createEmotionServer(cache);
  const html = renderToString(
    <CacheProvider value={cache}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <ServerRouter context={routerContext} url={request.url} />
      </ThemeProvider>
    </CacheProvider>,
  );

  if (!insertionPoint.test(html)) {
    throw new Error("Emotion insertion point is missing from the document");
  }

  const styles = extractCriticalToChunks(html)
    .styles.map(({ key, ids, css }) => `<style data-emotion="${key} ${ids.join(" ")}">${css}</style>`)
    .join("");
  const markup = html.replace(insertionPoint, (match) => `${match}${styles}`);

  responseHeaders.set("Content-Type", "text/html");

  return new Response(`<!DOCTYPE html>${markup}`, {
    status: responseStatusCode,
    headers: responseHeaders,
  });
}
