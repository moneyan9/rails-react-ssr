import createCache from "@emotion/cache";

export function createEmotionCache() {
  const insertionPoint =
    typeof document === "undefined"
      ? undefined
      : document.querySelector<HTMLElement>('meta[name="emotion-insertion-point"]');

  return createCache({
    key: "css",
    insertionPoint: insertionPoint ?? undefined,
  });
}
