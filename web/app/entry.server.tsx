import { PassThrough } from "node:stream";
import { renderToPipeableStream } from "react-dom/server";
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

  return new Promise((resolve, reject) => {
    const cache = createEmotionCache();
    const { extractCriticalToChunks } = createEmotionServer(cache);
    let status = responseStatusCode;
    let shellRendered = false;
    const timeoutId = setTimeout(() => abort(), streamTimeout + 1000);

    const { pipe, abort } = renderToPipeableStream(
      <CacheProvider value={cache}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <ServerRouter context={routerContext} url={request.url} />
        </ThemeProvider>
      </CacheProvider>,
      {
        onAllReady() {
          shellRendered = true;
          clearTimeout(timeoutId);
          const body = new PassThrough();
          const chunks: Buffer[] = [];

          body.on("data", (chunk: Buffer | string) => chunks.push(Buffer.from(chunk)));
          body.on("end", () => {
            const html = Buffer.concat(chunks).toString("utf8");

            if (!insertionPoint.test(html)) {
              reject(new Error("Emotion insertion point is missing from the document"));
              return;
            }

            const styles = extractCriticalToChunks(html)
              .styles.map(
                ({ key, ids, css }) => `<style data-emotion="${key} ${ids.join(" ")}">${css}</style>`,
              )
              .join("");
            const markup = html.replace(insertionPoint, (match) => `${match}${styles}`);
            const documentHtml = markup.startsWith("<!DOCTYPE html>")
              ? markup
              : `<!DOCTYPE html>${markup}`;

            responseHeaders.set("Content-Type", "text/html");
            resolve(
              new Response(documentHtml, {
                status,
                headers: responseHeaders,
              }),
            );
          });
          body.on("error", reject);
          pipe(body);
        },
        onShellError(error: unknown) {
          clearTimeout(timeoutId);
          reject(error);
        },
        onError(error: unknown) {
          status = 500;
          if (shellRendered) console.error(error);
        },
      },
    );
  });
}
