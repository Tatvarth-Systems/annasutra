/** Detects iOS/iPadOS WebKit (Safari and Chrome-for-iOS share the same engine), where forced blob downloads via the `download` attribute don't work. */
export const isIOSWebKit = (): boolean => {
  if (typeof navigator === "undefined") return false;
  return (
    /iP(hone|od|ad)/.test(navigator.userAgent) ||
    (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1)
  );
};
